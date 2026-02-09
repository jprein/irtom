/* eslint-disable prettier/prettier */
import { gsap } from 'gsap';
import type { SvgInHtml } from '../../src/types';
import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { hideTwoOptions } from '../../src/util/hideTwoOptions';
import { showTwoOptions } from '../../src/util/showTwoOptions';
import { hideBlockingState } from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversebeliefs-b';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get response from previous slide with interactive choice
	// response stores what participant chose (left or right)
	// code naySide as the side that the participant chose, so the girl DOES NOT think the boy is there
	// for dev mode if no previous slide / response exists, default to left
	const naySide =
		data.previousSlide && data.procedure[data.previousSlide]
			? data.procedure[data.previousSlide].response || 'left'
			: 'left';
	// yaySide is opposite, so where the girl thinks the dog hides
	const yaySide = naySide === 'left' ? 'right' : 'left';

	// Store correct response
	data.procedure[data.currentSlide].correct = yaySide;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-${naySide}-pointing`,
	) as SvgInHtml;
	const girlYay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-${yaySide}-pointing`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([girlNay, girlYay], { autoAlpha: 0 });
		gsap.set(girl, { autoAlpha: 1, x: 0 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(girl, {
			onComplete: () => {
				data.sprite.play(`${slidePrefix}-${naySide}-nay`);
			},
		})
			.to(
				girl,
				{
					delay:
						data.spriteJSON.sprite[`${slidePrefix}-${naySide}-nay`][1] / 1000,
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(
				girlYay,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				girlYay,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			);

		await sleep(500);
		
		await tl.then();
		tl.kill();
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before response choices
	await sleep(500);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
	//await showBlockingState(slidePrefix);
};
