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
		`link-${slidePrefix}-${data.community}-girl-pot`,
	) as SvgInHtml;
	const mother = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-doctor-nomask`,
	) as SvgInHtml;
	const father = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-cook-no-pot`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set([girl, mother, father], {
			autoAlpha: 0,
		});

		gsap.set([girl, mother, father], {
			autoAlpha: 1,
		});

		gsap.set([girl, mother], { autoAlpha: 1, x: -1200 });
		gsap.set([father], { autoAlpha: 1, x: +1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(mother, {
			delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 5,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(
				mother,
				{
					x: 0,
					duration: 2,
				},
				'<',
			)
			.to(father, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(
				father,
				{
					x: 0,
					duration: 2,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girl, {
				x: 0,
				duration: 2,
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
