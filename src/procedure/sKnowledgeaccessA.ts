import { gsap } from 'gsap';
import type { SvgInHtml } from '../../src/types';
import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { hideYesNoChoice } from '../../src/util/hideYesNoChoice';
import { showYesNoChoice } from '../../src/util/showYesNoChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-a';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'no';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Add trial-specific animation
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyBall = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-ball`,
	) as SvgInHtml;
	const boyHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-handsup`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some elements
		gsap.set([boyBall, girl], { x: -1200 });
		gsap.set(boyBall, { autoAlpha: 1 });
		gsap.set([boy, boyHandsup, boxOpen], {
			autoAlpha: 0,
		});
		gsap.set(boy, { x: 0 });

		await gsap
			.timeline()
			.to(boyBall, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-1`);
				},
			})
			.to(boyBall, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-1`][1] / 1000 - 3,
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to([boyBall, boxClosed], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boyHandsup, boxOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-3`);
					},
				},
				'<',
			)
			.to([boyHandsup, boxOpen], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to([boy, boxClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: 1,
				x: 1200,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girl, { autoAlpha: 1, duration: 0.1 })
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				x: 0,
				duration: 3,
			});

		// Short break before showing response options
		await sleep(1000);
	}

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show yes/no choice and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
};
