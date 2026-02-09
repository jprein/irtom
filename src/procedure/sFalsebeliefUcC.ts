import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import gsap from 'gsap';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-uc-c';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set([girl, boy, boxClosed, boxOpen], {
			autoAlpha: 0,
			x: 0,
		});

		gsap.set([boy, girl, boxClosed], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(boy, { x: 1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();

		tl.to(girl, {
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(boxClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				boxOpen,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(
				boxClosed,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(
				boxOpen,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(
				girl,
				{
					x: -1200,
					duration: 2,
				},
				'=+2',
			)
			.to(boy, {
				x: 0,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
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
