import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideLeftRightChoice } from '../util/hideLeftRightChoice';
import { showLeftRightChoice } from '../util/showLeftRightChoice';
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
	await hideLeftRightChoice(slidePrefix);

	// Trial-specific animation
	const girlHandsup = document.getElementById(
		`${slidePrefix}-girl-arm-up`,
	) as SvgInHtml;

	const girlHandsdown = document.getElementById(
		`${slidePrefix}-girl-arm-down`,
	) as SvgInHtml;

	const boyHandsup = document.getElementById(
		`${slidePrefix}-boy-arm-up`,
	) as SvgInHtml;

	const boyHandsdown = document.getElementById(
		`${slidePrefix}-boy-arm-down`,
	) as SvgInHtml;

	gsap.set([girlHandsup, boyHandsup], { autoAlpha: 0 });

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
			},
			'<',
		)
		.to(girlHandsup, {
			delay: 1,
			autoAlpha: 0,
			duration: 0.1,
		})
		.to(
			girlHandsdown,
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
				},
			},
			'<',
		)
		.to(boyHandsdown, {
			delay: 4,
			autoAlpha: 0,
			duration: 0.1,
		})
		.to(
			boyHandsup,
			{
				autoAlpha: 1,
				duration: 0.1,
			},
			'<',
		)
		.to(boyHandsup, {
			delay: 1,
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

	// Show left/right response options and store participant response
	await showLeftRightChoice(slidePrefix);
};
