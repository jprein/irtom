import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { play, playPromise } from '../util/audio';
import { sleep } from '../util/helpers';
import { hideLeftRightChoice } from '../util/hideLeftRightChoice';
import { showLeftRightChoice } from '../util/showLeftRightChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideLeftRightChoice(slidePrefix);

	// Trial-specific animation
	gsap.defaults({ ease: 'none' });

	// Get all relevant elements
	const girlHandsUp = document.getElementById(
		`${slidePrefix}-girl-handsup`,
	) as SvgInHtml;
	const girlHandsDown = document.getElementById(
		`${slidePrefix}-girl-handsdown`,
	) as SvgInHtml;
	const boyHandsUp = document.getElementById(
		`${slidePrefix}-boy-handsup`,
	) as SvgInHtml;
	const boyHandsDown = document.getElementById(
		`${slidePrefix}-boy-handsdown`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set(boyHandsDown, { x: -1200 });
	gsap.set([girlHandsUp, boyHandsUp, boxOpen], { autoAlpha: 0 });

	// Play initial audio
	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	);

	// Animation sequence
	await gsap
		.timeline()
		.to([girlHandsDown, boxClosed], {
			delay: 1.5,
			autoAlpha: 0,
			duration: 0.1,
		})
		.to(
			[girlHandsUp, boxOpen],
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
				},
			},
			'<',
		)
		.to([girlHandsUp, boxOpen], { delay: 4, autoAlpha: 0, duration: 0.1 })
		.to([girlHandsDown, boxClosed], { autoAlpha: 1, duration: 0.1 }, '<')
		.to(girlHandsDown, {
			delay: 0.5,
			x: 1100,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			},
		})
		.to(boyHandsDown, {
			delay: 2.5,
			x: 0,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
			},
		})
		.to(boxClosed, { delay: 4, x: 50, y: -400, duration: 0 })
		.to(boyHandsDown, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(boyHandsUp, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(boxClosed, { y: -700, duration: 1, repeat: 2, yoyo: true })
		.to(boyHandsUp, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(
			boyHandsDown,
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-5.mp3`);
				},
			},
			'<',
		)
		.to(boxClosed, { y: 0, duration: 1 })
		.to(boyHandsDown, { delay: 2, x: -1200, duration: 3 });

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showLeftRightChoice(slidePrefix);
};
