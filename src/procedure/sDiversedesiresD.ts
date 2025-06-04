import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversedesires-d';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get response from previous slide with interactive choice
	// response stores what participant likes (left or right), boy agent always likes the opposite
	const naySide = data.procedure[data.previousSlide].response;
	const yaySide = naySide === 'left' ? 'right' : 'left';

	// Store correct response
	data.procedure[data.currentSlide].correct = yaySide;

	// Trial-specific animation
	gsap.defaults({ ease: 'none' });

	// Get all relevant elements
	const boy = document.getElementById(`${slidePrefix}-boy`) as SvgInHtml;
	const boyNay = document.getElementById(
		`${slidePrefix}-boy-nay-${naySide}`,
	) as SvgInHtml;
	const boyYay = document.getElementById(
		`${slidePrefix}-boy-yay-${yaySide}`,
	) as SvgInHtml;

	// also get the other (irrelevant) yay/nay agent sides to hide them
	const boyNayHide = document.getElementById(
		`${slidePrefix}-boy-nay-${yaySide}`,
	) as SvgInHtml;
	const boyYayHide = document.getElementById(
		`${slidePrefix}-boy-yay-${naySide}`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(boy, { x: 1200 });
		gsap.set([boyNay, boyYay, boyNayHide, boyYayHide], { opacity: 0 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		await gsap.timeline().to(boy, {
			x: 0,
			duration: 3,
			onComplete: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		});

		// For the case that Max doesn't like the cracker but the cucumber
		if (naySide === 'left') {
			// Max first tries the cracker on the left
			await gsap
				.timeline()
				.to(boy, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-3-nay`);
					},
				})
				.to(
					boyNay,
					{
						autoAlpha: 1,
						duration: 0.1,
					},
					'<',
				)
				.to(boyNay, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-3-nay`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-4`);
					},
				})
				// Max then tries the cracker on the right
				.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
				.to(boy, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-5-yay`);
					},
				})
				.to(boyYay, { autoAlpha: 1, duration: 0.1 }, '<')
				.to(boyYay, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-5-yay`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-6`);
					},
				})
				.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
				.to(boy, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
					x: 1200,
					duration: 3,
				});
			// For the case that Max likes the cracker but not the cucumber
		} else {
			await gsap
				.timeline()
				.to(boy, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-3-yay`);
					},
				})
				.to(
					boyYay,
					{
						autoAlpha: 1,
						duration: 0.1,
					},
					'<',
				)
				.to(boyYay, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-3-yay`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-4`);
					},
				})
				.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
				.to(boy, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-5-nay`);
					},
				})
				.to(boyNay, { autoAlpha: 1, duration: 0.1 }, '<')
				.to(boyNay, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-5-nay`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-6`);
					},
				})
				.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
				.to(boy, {
					delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
					x: 1200,
					duration: 3,
				});
		}
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
