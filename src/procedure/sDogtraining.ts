import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { showYesNoChoice } from '../util/showYesNoChoice';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';
import { playCorrectIncorrectResponse } from '../util/playCorrectIncorrectResponse';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-dogtraining';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Add trial-specific animation
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-kneeling`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-kneeling`,
	) as SvgInHtml;
	const dogLying = document.getElementById(
		`link-${slidePrefix}-dog-lying`,
	) as SvgInHtml;
	const dogRunning = document.getElementById(
		`link-${slidePrefix}-dog-running`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some elements
		gsap.set([boyKneeling, girlKneeling, dogLying], { autoAlpha: 0 });
		gsap.set(dogRunning, { x: -1200 });
		gsap.set([boy, girl, dogRunning], { autoAlpha: 1 });

		await gsap
			.timeline()
			.to(dogRunning, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-1`);
				},
			})
			.to(dogRunning, {
				delay: 1,
				x: 0,
				duration: 3,
			})
			.to([boy, girl, dogRunning], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-1`][1] / 1000 - 4,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(
				[boyKneeling, girlKneeling, dogLying],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			);

		// Short break before showing response options
		await sleep(data.spriteJSON.sprite[`${slidePrefix}-2`][1]);
	}

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show yes/no choice and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
	await playCorrectIncorrectResponse(currentSlide);
	await showBlockingState(slidePrefix);
};
