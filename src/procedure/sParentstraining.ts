import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { sleep } from '../util/helpers';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';
import { playCorrectIncorrectResponse } from '../util/playCorrectIncorrectResponse';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-parentstraining';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const womanWaving = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-waving`,
	) as SvgInHtml;

	const woman = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman`,
	) as SvgInHtml;

	const manWaving = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-waving`,
	) as SvgInHtml;

	const man = document.getElementById(
		`link-${slidePrefix}-${data.community}-man`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide waving elements and position characters off-screen
		gsap.set([womanWaving, manWaving], { autoAlpha: 0 });
		gsap.set(woman, { x: -1200 });
		gsap.set(man, { x: 1200 });

		await gsap
			.timeline()
			.to(woman, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-1`);
				},
			})
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-1`][1] / 1000 - 3.5,
				x: 0,
				duration: 2.5,
			})
			.to(
				man,
				{
					x: 0,
					duration: 2.5,
				},
				'<',
			)
			.to(woman, {
				delay: 1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				womanWaving,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(womanWaving, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				woman,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-3`);
					},
				},
				'<',
			)
			.to(man, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				manWaving,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(manWaving, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				man,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			);
	}

	// In beginning, hide response options
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show response options and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
	await playCorrectIncorrectResponse(currentSlide);
	await showBlockingState(slidePrefix);
};
