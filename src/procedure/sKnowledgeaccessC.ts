import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { play, playPromise } from '../util/audio';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-c';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Trial-specific animation
	gsap.defaults({ ease: 'none' });

	// Get all relevant elements
	const girlHandsup = document.getElementById(
		`${slidePrefix}-girl-handsup`,
	) as SvgInHtml;
	const girlHandsdown = document.getElementById(
		`${slidePrefix}-girl-handsdown`,
	) as SvgInHtml;
	const boyHandsdown = document.getElementById(
		`${slidePrefix}-boy-handsdown`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;
	const rooster = document.getElementById(
		`${slidePrefix}-rooster`,
	) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set([boyHandsdown, girlHandsdown], { x: -1200 });
	gsap.set(rooster, { x: 1200 });
	gsap.set([girlHandsup, boxOpen], { autoAlpha: 0 });

	// Play initial audio
	// await playPromise(
	// 	`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	// );

	// Animation sequence
	await gsap
		.timeline()
		.to(rooster, {
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-1.mp3`);
			},
		})
		.to(rooster, { delay: 3, x: 0, duration: 3 })
		.to(boxOpen, { delay: 2, autoAlpha: 1, duration: 0.1 })
		.to(rooster, { autoAlpha: 0, duration: 0.1 }, '<')
		.to(boxOpen, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(
			boxClosed,
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
				},
			},
			'<',
		)
		.to(girlHandsdown, {
			delay: 3,
			x: 0,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			},
		})
		.to(girlHandsdown, {
			delay: 3,
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
		.to(boxClosed, {
			x: 50,
			y: -700,
			duration: 1,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
			},
		})
		.to(girlHandsup, { delay: 3, autoAlpha: 0, duration: 0.1 })
		.to(
			girlHandsdown,
			{
				autoAlpha: 1,
				duration: 0.1,
			},
			'<',
		)
		.to(boxClosed, {
			x: 0,
			y: 0,
			duration: 1,
		})
		.to(girlHandsdown, {
			delay: 1,
			x: -1200,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-5.mp3`);
			},
		})
		.to(boyHandsdown, {
			delay: 3,
			x: 0,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-6.mp3`);
			},
		})
		.to(boyHandsdown, {
			delay: 5,
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-7.mp3`);
			},
		})
		.to(boyHandsdown, { delay: 3, x: -1200, duration: 3 });

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
