import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-appearance-reality-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-slightright-standing`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const dogRunning = document.getElementById(
		`link-${slidePrefix}-dog-running`,
	) as SvgInHtml;
	const dogLying = document.getElementById(
		`link-${slidePrefix}-dog-lying`,
	) as SvgInHtml;
	const hole = document.getElementById(`${slidePrefix}-hole`) as SvgInHtml;
	const holeHidden = document.getElementById(
		`${slidePrefix}-leafs-hole`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set([dogRunning, dogLying, holeHidden, girl, boy], {
			autoAlpha: 0,
		});

		gsap.set([boy, hole], {
			autoAlpha: 1,
		});

		gsap.set([dogRunning, girl], { autoAlpha: 1, x: -1200 });
		gsap.set(boy, { autoAlpha: 1, x: -1200 });
		gsap.set([hole, holeHidden], { y: -100 });

		//await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();

		tl.to(boy, {
			x: -100,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-1`);
			},
		})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(hole, {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(holeHidden, {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				hole,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(boy, {
				delay: 2,
				x: 1200,
				duration: 3,
			})
			.to(dogRunning, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(dogRunning, {
				x: 0,
				duration: 2,
			})
			.to(dogLying, {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				dogRunning,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(girl, {
				x: 0,
				duration: 3,
			});

		await tl.then();
		await sleep(500);
		tl.kill();
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
