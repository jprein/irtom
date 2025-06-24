import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-aspectuality-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const stranger = document.getElementById(
		`${slidePrefix}-${data.community}-stranger`,
	) as SvgInHtml;
	const strangerHurt = document.getElementById(
		`${slidePrefix}-${data.community}-stranger-hurt`,
	) as SvgInHtml;
	const manCook = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-cook`,
	) as SvgInHtml;
	const manDoctor = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-doctor`,
	) as SvgInHtml;
	const womanCook = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-cook`,
	) as SvgInHtml;
	const womanDoctor = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-doctor`,
	) as SvgInHtml;

	gsap.set([womanCook, womanDoctor, manCook, manDoctor], {
		transformOrigin: 'center center',
	});

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([strangerHurt, manDoctor, womanCook], {
			autoAlpha: 0,
			x: 0,
			y: 0,
			scale: 1,
		});
		gsap.set([womanDoctor, manCook], { autoAlpha: 1, x: -800, y: 0, scale: 1 });
		gsap.set(womanCook, {
			autoAlpha: 0,
			x: -280,
			y: -80,
			scale: 0.5,
		});
		gsap.set(manDoctor, {
			autoAlpha: 0,
			x: -370,
			y: -80,
			scale: 0.5,
		});
		gsap.set(stranger, { autoAlpha: 1, x: 800 });

		// Play initial audio
		await gsap
			.timeline()
			.to(womanDoctor, {
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-1`);
				},
			})
			.to(
				[womanDoctor, manCook],
				{
					x: 0,
					duration: 3,
				},
				'<+=1',
			)
			.to(womanDoctor, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-1`][1] / 1000 - 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(womanDoctor, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				x: 370,
				y: -50,
				scale: 0.5,
				duration: 2,
			})
			.to(
				manCook,
				{
					x: 290,
					y: -50,
					scale: 0.5,
					duration: 2,
				},
				'<',
			)
			.to([womanDoctor, manCook], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(womanCook, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(womanCook, {
				delay: 1,
				x: 0,
				y: 0,
				scale: 1,
				autoAlpha: 1,
				duration: 2,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(manDoctor, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(manDoctor, {
				delay: 1,
				x: 0,
				y: 0,
				scale: 1,
				autoAlpha: 1,
				duration: 2,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(stranger, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 1,
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(stranger, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(strangerHurt, { autoAlpha: 1, duration: 0.1 }, '<');
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(2000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
