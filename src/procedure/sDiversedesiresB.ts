import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { play, playPromise } from '../util/audio';
import { sleep } from '../util/helpers';
import { hideLeftRightChoice } from '../util/hideLeftRightChoice';
import { showLeftRightChoice } from '../util/showLeftRightChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversedesires-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideLeftRightChoice(slidePrefix);

	// Trial-specific animation
	gsap.defaults({ ease: 'none' });

	// Get all relevant elements
	const girl = document.getElementById(`${slidePrefix}-girl`) as SvgInHtml;
	const girlYay = document.getElementById(
		`${slidePrefix}-girl-yay`,
	) as SvgInHtml;
	const girlNay = document.getElementById(
		`${slidePrefix}-girl-nay`,
	) as SvgInHtml;
	const boy = document.getElementById(`${slidePrefix}-boy`) as SvgInHtml;
	const boyNay = document.getElementById(`${slidePrefix}-boy-nay`) as SvgInHtml;
	const boyYay = document.getElementById(`${slidePrefix}-boy-yay`) as SvgInHtml;
	const carrot = document.getElementById(`${slidePrefix}-carrot`) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set(boy, { x: -1200 });
	gsap.set(girl, { x: 1200 });
	gsap.set([girlYay, girlNay, boyYay, boyNay], { opacity: 0 });

	// Play initial audio
	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	);

	// Animation sequence
	await gsap
		.timeline()
		.to(girl, {
			x: 0,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
			},
		})
		.to(girl, { delay: 2, autoAlpha: 0, duration: 0.1 })
		.to(
			girlYay,
			{
				autoAlpha: 1,
				duration: 0.1,
			},
			'<',
		)
		.to(girlYay, {
			delay: 3,
			autoAlpha: 0,
			duration: 0.1,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			},
		})
		.to(girlNay, {
			autoAlpha: 1,
			duration: 0.1,
		})
		.to(girlNay, {
			delay: 3,
			autoAlpha: 0,
			duration: 0.1,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
			},
		})
		.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(girl, {
			delay: 2,
			x: -1200,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-5.mp3`);
			},
		})

		.to(boy, {
			delay: 1,
			x: 0,
			duration: 3,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-6.mp3`);
			},
		})
		.to(boy, { delay: 2, autoAlpha: 0, duration: 0.1 })
		.to(
			boyNay,
			{
				autoAlpha: 1,
				duration: 0.1,
			},
			'<',
		)
		.to(boyNay, {
			delay: 3,
			autoAlpha: 0,
			duration: 0.1,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-7.mp3`);
			},
		})
		.to(boyYay, {
			autoAlpha: 1,
			duration: 0.1,
		})
		.to(boyYay, {
			delay: 3,
			autoAlpha: 0,
			duration: 0.1,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-8.mp3`);
			},
		})
		.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(boy, {
			delay: 2,
			x: 1200,
			duration: 3,
		})
		.to(carrot, { delay: 2, autoAlpha: 0, duration: 0.1 });

	// Show left/right response options and store participant response
	await showLeftRightChoice(slidePrefix);
};
