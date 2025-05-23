import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { play, playPromise } from '../util/audio';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-two-a';

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
	const girlDigging = document.getElementById(
		`${slidePrefix}-girl-digging`,
	) as SvgInHtml;
	const girlStanding = document.getElementById(
		`${slidePrefix}-girl-standing`,
	) as SvgInHtml;
	const girlHiding = document.getElementById(
		`${slidePrefix}-girl-hiding`,
	) as SvgInHtml;
	const boyDigging = document.getElementById(
		`${slidePrefix}-boy-digging`,
	) as SvgInHtml;
	const boyStanding = document.getElementById(
		`${slidePrefix}-boy-standing`,
	) as SvgInHtml;
	const treasure = document.getElementById(
		`${slidePrefix}-treasure`,
	) as SvgInHtml;
	const dirt1 = document.getElementById(`${slidePrefix}-dirt1`) as SvgInHtml;
	const dirt2 = document.getElementById(`${slidePrefix}-dirt2`) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set([girlStanding, girlHiding, boyStanding], { autoAlpha: 0 });

	// Play initial audio
	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	);

	// Animation sequence
	await gsap
		.timeline()
		.to([treasure, dirt1, dirt2], { delay: 1, autoAlpha: 0, duration: 0.5 })
		.to([girlDigging, boyDigging], { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(
			[girlStanding, boyStanding],
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
				},
			},
			'<',
		)
		.to(girlStanding, { delay: 7, x: -1620, duration: 4 })
		.to(boyStanding, { x: 370, duration: 2 }, '<')
		.to(girlHiding, {
			delay: 1.5,
			autoAlpha: 1,
			duration: 0.2,
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			},
		})
		.to(boyStanding, {
			delay: 4,
			x: 50,
			duration: 2,
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
			},
		})
		.to(boyStanding, { delay: 5, autoAlpha: 0, duration: 0.1 })
		.to(boyDigging, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(dirt2, { delay: 1, autoAlpha: 1, duration: 0.1 })
		.to(treasure, { delay: 1, autoAlpha: 1, duration: 0.1 })
		.to([boyDigging, dirt2], { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(boyStanding, { x: 50, duration: 0 }, '<')
		.to(boyStanding, { autoAlpha: 1, duration: 0.1 }, '<')
		.to([boyStanding, treasure], { delay: 1, x: -600, duration: 2 })
		.to(boyStanding, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(boyDigging, { x: -600, duration: 0 }, '<')
		.to(boyDigging, { autoAlpha: 1, duration: 0.1 })
		.to(treasure, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(boyDigging, { delay: 1, autoAlpha: 0, duration: 0.1 })
		.to(boyStanding, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(boyStanding, {
			delay: 1,
			x: 370,
			duration: 4,
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-5.mp3`);
			},
		})
		.to(girlHiding, { delay: 0.5, autoAlpha: 0, duration: 0.1 });

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
