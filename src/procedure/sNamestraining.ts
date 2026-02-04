import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import { sleep } from '../util/helpers';
import { playCorrectIncorrectResponse } from '../util/playCorrectIncorrectResponse';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-namestraining';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girlHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-waving`,
	) as SvgInHtml;

	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;

	const boyHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-waving`,
	) as SvgInHtml;

	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;

	// Initially hide agents with hands up
	gsap.set([girlHandsup, boyHandsup], { autoAlpha: 0 });

	// Define animation function
	async function showAnimation() {
		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(girl, {
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
				girl,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-3`);
					},
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
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
				boy,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			);
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show response options and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);

	if (!stopBlockingState) {
		await playCorrectIncorrectResponse(currentSlide);
		await showBlockingState(slidePrefix);
	}
};
