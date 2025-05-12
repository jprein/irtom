import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { play, playPromise } from '../util/audio';
import { sleep } from '../util/helpers';
import { hideLeftRightChoice } from '../util/hideLeftRightChoice';
import { showLeftRightChoice } from '../util/showLeftRightChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-c';

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
	const boyOrangeHandsUp = document.getElementById(
		`${slidePrefix}-boyorange-handsup`,
	) as SvgInHtml;
	const boyOrangeHandsDown = document.getElementById(
		`${slidePrefix}-boyorange-handsdown`,
	) as SvgInHtml;
	const boyBrownHandsUp = document.getElementById(
		`${slidePrefix}-boybrown-handsup`,
	) as SvgInHtml;
	const boyBrownHandsDown = document.getElementById(
		`${slidePrefix}-boybrown-handsdown`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set(boyBrownHandsDown, { x: -1200 });
	gsap.set([boyOrangeHandsUp, boyBrownHandsUp, boxOpen], { autoAlpha: 0 });

	// Play initial audio
	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	);

	// Animation sequence
	await gsap
		.timeline()
		.to([boyOrangeHandsDown, boxClosed], {
			delay: 1.5,
			autoAlpha: 0,
			duration: 0.1,
		})
		.to(
			[boyOrangeHandsUp, boxOpen],
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
				},
			},
			'<',
		)
		.to([boyOrangeHandsUp, boxOpen], { delay: 4, autoAlpha: 0, duration: 0.1 })
		.to([boyOrangeHandsDown, boxClosed], { autoAlpha: 1, duration: 0.1 }, '<')
		.to(boyOrangeHandsDown, {
			delay: 0.5,
			x: 1100,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			},
		})
		.to(boyBrownHandsDown, {
			delay: 4,
			x: 0,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
			},
		})
		.to(boxClosed, { delay: 4, y: -300, duration: 0 })
		.to(boyBrownHandsDown, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(boyBrownHandsUp, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(boxClosed, { y: -800, duration: 1, repeat: 2, yoyo: true })
		.to(boyBrownHandsUp, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(
			boyBrownHandsDown,
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
		.to(boyBrownHandsDown, { delay: 2, x: -1200, duration: 3 });

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showLeftRightChoice(slidePrefix);
};
