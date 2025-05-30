import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { getResponse } from '../util/getResponse';
import { sleep } from '../util/helpers';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-names';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
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
	const repeat = document.getElementById(
		`link-${slidePrefix}-repeat`,
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

	// Define animation function
	async function showAnimation() {
		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(girlHandsdown, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlHandsup,
				{
					autoAlpha: 1,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-2`);
					},
				},
				'<',
			)
			.to(girlHandsup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlHandsdown,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-3`);
					},
				},
				'<',
			)
			.to(boyHandsdown, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 + 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				boyHandsup,
				{
					autoAlpha: 1,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-4`);
					},
				},
				'<',
			)
			.to(boyHandsup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
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

	// Define function to show left/right response options
	async function showChoice() {
		// Play audio
		await data.sprite.playPromise(`${slidePrefix}`);

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
				onStart: () => {
					data.sprite.play(`${slidePrefix}-left`);
				},
			})
			.to(optionRight, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-left`][1] / 1000,
				autoAlpha: 1,
				duration: 0.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-right`);
				},
			})
			.to([optionLeft, optionRight, repeat], {
				autoAlpha: 1,
				duration: 0.5,
				pointerEvents: 'visible',
				cursor: 'pointer',
			});

		// Get Response
		const response = await getResponse([optionLeft.id, optionRight.id]);

		// If the repeat button was clicked, exit early. Otherwise, neutral response audio gets played twice
		if (data.clickedRepeat) {
			// reset the flag for next use
			data.clickedRepeat = false;
			return;
		}

		// remove event listener so that not multiple audios can be played
		gsap.timeline().to([optionLeft, optionRight, repeat], {
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
			await hideTwoOptions(slidePrefix);
			await showAnimation();
			await showChoice();
		}
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show response options and store participant response
	await showChoice();
};
