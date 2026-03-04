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
	const slidePrefix = 's-knowledgeaccess-d';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';
	data.procedure[data.currentSlide].dimension = 'knowledgeaccess';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-bruise`,
	) as SvgInHtml;
	const mother = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-doctor-nomask`,
	) as SvgInHtml;
	const father = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-cook-no-pot`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set([mother], { autoAlpha: 1, x: +1200 });
		gsap.set([girl, father], { autoAlpha: 1, x: -1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(mother, {
			x: 0,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(father, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				x: 0,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 0.5,
				x: 0,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			});

		await tl.then();
		await sleep(1000);
		tl.kill();
	}
	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
