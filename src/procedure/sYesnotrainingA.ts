import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { getResponse } from '../util/getResponse';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-yesnotraining-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(slidePrefix);

	// Short break before showing response options
	await sleep(1000);

	// Trial-specific animation
	// Get all relevant elements
	const audio = document.getElementById('audio') as HTMLMediaElement;
	const choiceSlide = document.getElementById(`${slidePrefix}`) as SvgInHtml;
	choiceSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const headphones = document.getElementById(
		`link-${slidePrefix}-headphones`,
	) as SvgInHtml;
	const yesGroup = document.getElementById(
		`${slidePrefix}-${data.emoji}-yes`,
	) as SvgInHtml;
	const yesThumbs = document.getElementById(
		`${slidePrefix}-${data.emoji}-thumbs-yes`,
	) as SvgInHtml;
	const yesFace = document.getElementById(
		`${slidePrefix}-${data.emoji}-face-yes`,
	) as SvgInHtml;
	const yesFacefeatures = document.getElementById(
		`${slidePrefix}-${data.emoji}-facefeatures-yes`,
	) as SvgInHtml;
	const noGroup = document.getElementById(
		`${slidePrefix}-${data.emoji}-no`,
	) as SvgInHtml;
	const noThumbs = document.getElementById(
		`${slidePrefix}-${data.emoji}-thumbs-no`,
	) as SvgInHtml;
	const noFace = document.getElementById(
		`${slidePrefix}-${data.emoji}-face-no`,
	) as SvgInHtml;
	const noFacefeatures = document.getElementById(
		`${slidePrefix}-${data.emoji}-facefeatures-no`,
	) as SvgInHtml;

	// Set initial state for response variables
	data.procedure[data.currentSlide].score = 0;
	let correct = false;

	// Define function to show names
	async function showNames() {
		// Play audio
		await playPromise(
			`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
		);

		gsap.set([yesThumbs, noThumbs], { autoAlpha: 0, pointerEvents: 'none' });

		// animate head shaking & nodding
		await gsap
			.timeline()
			.to(blurr, {
				delay: 1,
				autoAlpha: 0.7,
				duration: 0.6,
			})
			.to(yesGroup, {
				duration: 0.5,
				autoAlpha: 1,
				onStart: () => {
					play(`./communities/${data.community}/audio/yes.mp3`);
				},
			})
			.to(yesFace, { y: -8, duration: 0.3 })
			.to(yesFacefeatures, { y: -20, duration: 0.3 }, '<')
			.to(yesFace, {
				y: 8,
				repeat: 3,
				yoyo: true,
				ease: 'power1.inOut',
			})
			.to(
				yesFacefeatures,
				{
					y: 20,
					repeat: 3,
					yoyo: true,
					ease: 'power1.inOut',
				},
				'<',
			)
			.to([yesFace, yesFacefeatures], { y: 0, ease: 'power1.inOut' })
			.to(yesThumbs, {
				autoAlpha: 1,
				duration: 1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
				},
			})
			.to(noGroup, {
				delay: 5,
				duration: 0.5,
				autoAlpha: 1,
				onStart: () => {
					play(`./communities/${data.community}/audio/no.mp3`);
				},
			})
			.to(noFace, { x: 8, duration: 0.3 })
			.to(noFacefeatures, { x: 20, duration: 0.3 }, '<')
			.to(noFace, {
				x: -8,
				repeat: 3,
				yoyo: true,
				ease: 'power1.inOut',
			})
			.to(
				noFacefeatures,
				{
					x: -20,
					repeat: 3,
					yoyo: true,
					ease: 'power1.inOut',
				},
				'<',
			)
			.to([noFace, noFacefeatures], { x: 0, ease: 'power1.inOut' })
			.to(noThumbs, {
				autoAlpha: 1,
				duration: 0.5,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}.mp3`);
				},
			})
			.to([yesGroup, noGroup, headphones], {
				delay: 2,
				autoAlpha: 1,
				pointerEvents: 'visible',
				cursor: 'pointer',
			});
	}

	async function showChoice() {
		// if headphone is clicked, play audio again
		play(
			`./communities/${data.community}/audio/${slidePrefix}.mp3`,
			`link-${slidePrefix}-headphones`,
		);

		// while audio is playing, hide yes and no response buttons
		function handlePlay() {
			gsap
				.timeline()
				.set([yesGroup, noGroup], {
					autoAlpha: 0,
					pointerEvents: 'none',
					cursor: 'default',
				})
				.to(blurr, {
					autoAlpha: 0,
					duration: 0.6,
				});
		}

		// when audio ends, show yes and no response buttons
		function handleEnded() {
			gsap
				.timeline()
				.set([yesGroup, noGroup], {
					autoAlpha: 1,
					pointerEvents: 'visible',
					cursor: 'pointer',
				})
				.to(blurr, {
					autoAlpha: 0.7,
					duration: 0.6,
				});
		}

		audio.addEventListener('play', handlePlay);
		audio.addEventListener('ended', handleEnded);

		// Get Response
		const response = await getResponse([yesGroup.id, noGroup.id]);

		// Response returns the clicked element.
		// We take the ID of the clicked element (e.g. "link-s-perspectivetaking-yes")
		// and only keep the last part of it, after the last hyphen - (e.g. "yes" or "no")
		data.procedure[data.currentSlide].response = response.id.split('-').pop();

		// Check if the response is correct, and store the score (0 = incorrect, 1 = correct)
		data.procedure[data.currentSlide].score += 1;
		correct =
			data.procedure[data.currentSlide].response ===
			data.procedure[data.currentSlide].correct
				? true
				: false;

		// Remove Event Listeners after response
		audio.removeEventListener('play', handlePlay);
		audio.removeEventListener('ended', handleEnded);

		// For this initial trial, we check response
		// If correct, move on to the next trial
		if (correct) {
			await playPromise(
				`./communities/${data.community}/audio/${slidePrefix}-correct.mp3`,
			);
			// If incorrect, play the same again.
		} else {
			await playPromise(
				`./communities/${data.community}/audio/${slidePrefix}-incorrect.mp3`,
			);
			await hideYesNoChoice(slidePrefix);
			await showNames();
			await showChoice();
		}
	}

	// Actually running
	await showNames();
	await showChoice();
};
