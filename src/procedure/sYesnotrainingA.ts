import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
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

	// Trial-specific animation
	// Get all relevant elements
	const choiceSlide = document.getElementById(`${slidePrefix}`) as SvgInHtml;
	choiceSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${slidePrefix}-repeat`,
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

	// Define animation function
	async function showAnimation() {
		// Play audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		gsap.set([yesThumbs, noThumbs], { autoAlpha: 0, pointerEvents: 'none' });

		// Animate head shaking & nodding
		await gsap
			.timeline()
			.to(blurr, {
				autoAlpha: 0.7,
				duration: 0.6,
			})
			.to(yesGroup, {
				duration: 0.5,
				autoAlpha: 1,
				onStart: () => {
					data.sprite.play('yes');
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
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(noGroup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				duration: 0.5,
				autoAlpha: 1,
				onStart: () => {
					data.sprite.play('no');
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
			});
	}

	// Function to show the choice options and handle the response
	async function showChoice() {
		// Play question and show choices
		await data.sprite.playPromise(`${slidePrefix}`);
		await gsap.timeline().to([yesGroup, noGroup, repeat], {
			autoAlpha: 1,
			duration: 0.5,
			pointerEvents: 'visible',
			cursor: 'pointer',
		});

		// Wait for participant response
		const response = await getResponse([yesGroup.id, noGroup.id]);

		// If the repeat button was clicked, exit early. Otherwise, neutral response audio gets played twice
		if (data.clickedRepeat) {
			// reset the flag for next use
			data.clickedRepeat = false;
			return;
		}

		// Remove event listener so that not multiple audios can be played
		gsap.timeline().to([yesGroup, noGroup, repeat], {
			autoAlpha: 1,
			duration: 0.5,
			pointerEvents: 'none',
		});

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

		// For this initial trial, we check response
		// If correct, move on to the next trial
		if (correct) {
			await data.sprite.playPromise(`${slidePrefix}-correct`);
			// If incorrect, play the same again.
		} else {
			await data.sprite.playPromise(`${slidePrefix}-incorrect`);
			await hideYesNoChoice(slidePrefix);
			await showAnimation();
			await showChoice();
		}
	}

	// In beginning, hide yes/no choice
	await hideYesNoChoice(slidePrefix);

	// Short break before showing response options
	await sleep(1000);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show response choice and store participant response
	await showChoice();
};
