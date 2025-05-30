import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { getResponse } from '../util/getResponse';
import { hideThreeOptions } from '../util/hideThreeOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-emojichoice';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Store correct response
	data.procedure[data.currentSlide].correct = '';
	data.procedure[data.currentSlide].score = '';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	const left = document.getElementById(`${slidePrefix}-left`) as SvgInHtml;
	const center = document.getElementById(`${slidePrefix}-center`) as SvgInHtml;
	const right = document.getElementById(`${slidePrefix}-right`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${slidePrefix}-repeat`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(left, {
				autoAlpha: 1,
				duration: 0.5,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(center, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 1,
				duration: 0.5,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(right, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 1,
				duration: 0.5,
			});

		// Short break before showing response options
		await sleep(1000);

		// Play question
		await data.sprite.playPromise(`${slidePrefix}`);
	}

	// Function to show the choice options and handle the response
	async function showChoice() {
		// Enable clicking on emojis
		await gsap.timeline().to([center, left, right, repeat], {
			autoAlpha: 1,
			duration: 0.5,
			pointerEvents: 'visible',
			cursor: 'pointer',
		});

		// Only wait for response once, namely in first run of trial
		// When trial is repeated, skip this because we're still awaiting original getResponse
		if (!data.clickedRepeat) {
			// Wait for participant response
			const response = await getResponse([left.id, center.id, right.id]);

			// Remove event listener so that not multiple audios can be played
			gsap.timeline().to([center, left, right, repeat], {
				autoAlpha: 1,
				duration: 0.5,
				pointerEvents: 'none',
			});

			// Response returns the clicked element.
			// We take the ID of the clicked element (e.g. "link-s-perspectivetaking-yes")
			// and only keep the last part of it, after the last hyphen - (e.g. "yes" or "no")
			data.procedure[data.currentSlide].response = response.id.split('-').pop();

			// We also store emoji choice in the data object for easier access later on
			switch (data.procedure[data.currentSlide].response) {
				case 'left':
					data.emoji = 'blue';
					break;
				case 'center':
					data.emoji = 'yellow';
					break;
				case 'right':
					data.emoji = 'purple';
					break;
				default:
					data.emoji = 'yellow'; // default to yellow if something goes wrong
					break;
			}

			// Play motivating feedback for first choice
			await data.sprite.playPromise(`${slidePrefix}-feedback`);
		}
	}

	// In beginning, hide response options
	await hideThreeOptions(slidePrefix);

	// Show the animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showChoice();
};
