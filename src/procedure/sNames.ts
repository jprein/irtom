import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { getResponse } from '../util/getResponse';
import { play, playPromise } from '../util/audio';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-names';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Trial-specific animation
	// Get all relevant elements
	const audio = document.getElementById('audio') as HTMLMediaElement;

	const girlHandsup = document.getElementById(
		`${slidePrefix}-girl-waving`,
	) as SvgInHtml;

	const girlHandsdown = document.getElementById(
		`${slidePrefix}-girl`,
	) as SvgInHtml;

	const boyHandsup = document.getElementById(
		`${slidePrefix}-boy-waving`,
	) as SvgInHtml;

	const boyHandsdown = document.getElementById(
		`${slidePrefix}-boy`,
	) as SvgInHtml;

	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const headphones = document.getElementById(
		`link-${slidePrefix}-headphones`,
	) as SvgInHtml;
	const optionLeft = document.getElementById(
		`${slidePrefix}-left`,
	) as SvgInHtml;
	const optionRight = document.getElementById(
		`${slidePrefix}-right`,
	) as SvgInHtml;

	// Set initial state for response variables
	data.procedure[data.currentSlide].score = 0;
	let correct = false;

	// Initially hide agents with hands up
	gsap.set([girlHandsup, boyHandsup], { autoAlpha: 0 });

	// Define function to show names
	async function showNames() {
		await playPromise(
			`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
		);

		await gsap
			.timeline()
			.to(girlHandsdown, {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlHandsup,
				{
					autoAlpha: 1,
					duration: 0.1,
					onStart: () => {
						play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
					},
				},
				'<',
			)
			.to(girlHandsup, {
				delay: 1.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlHandsdown,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
					},
				},
				'<',
			)
			.to(boyHandsdown, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				boyHandsup,
				{
					autoAlpha: 1,
					duration: 0.1,
					onStart: () => {
						play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
					},
				},
				'<',
			)
			.to(boyHandsup, {
				delay: 1.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				boyHandsdown,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			);
	}

	// define function to show left/right response options
	async function showChoice() {
		// Play audio
		await playPromise(
			`./communities/${data.community}/audio/${slidePrefix}.mp3`,
		);

		await gsap
			.timeline()
			.to(blurr, {
				autoAlpha: 0.7,
				duration: 0.6,
			})
			.to(optionLeft, {
				delay: 0.5,
				autoAlpha: 1,
				duration: 0.5,
				pointerEvents: 'visible',
				cursor: 'pointer',
				onStart: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-left.mp3`);
				},
			})
			.to(optionRight, {
				delay: 2,
				autoAlpha: 1,
				duration: 0.5,
				pointerEvents: 'visible',
				cursor: 'pointer',
				onStart: () => {
					play(
						`./communities/${data.community}/audio/${slidePrefix}-right.mp3`,
					);
				},
				onComplete: () => {
					gsap.to(headphones, {
						autoAlpha: 1,
						pointerEvents: 'visible',
						cursor: 'pointer',
					});
				},
			});

		// if headphone is clicked, play audio again
		play(
			`./communities/${data.community}/audio/${slidePrefix}.mp3`,
			`link-${slidePrefix}-headphones`,
		);

		// while audio is playing, hide yes and no response buttons
		function handlePlay() {
			gsap
				.timeline()
				.set([optionLeft, optionRight], {
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
				.set([optionLeft, optionRight], {
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
		const response = await getResponse([optionLeft.id, optionRight.id]);

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
			await hideTwoOptions(slidePrefix);
			await showNames();
			await showChoice();
		}
	}

	// Actually running
	await showNames();
	await showChoice();
};
