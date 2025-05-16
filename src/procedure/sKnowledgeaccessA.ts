import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { playPromise } from '../util/audio';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-a';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'no';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);

	// Add trial-specific animation
	const boyHandsDown = document.getElementById(
		`${slidePrefix}-boy-handsdown`,
	) as SvgInHtml;
	const boyBall = document.getElementById(
		`${slidePrefix}-boy-ball`,
	) as SvgInHtml;
	const boyHandsUp = document.getElementById(
		`${slidePrefix}-boy-handsup`,
	) as SvgInHtml;
	const girl = document.getElementById(`${slidePrefix}-girl`) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;

	gsap.defaults({ ease: 'none' });

	// Initially hide some elements
	gsap.set([boyBall, girl], { x: -1200 });
	gsap.set([boyHandsDown, boyHandsUp, boxOpen], {
		autoAlpha: 0,
	});

	await gsap
		.timeline()
		.to(null, {
			onStart: () => {
				playPromise(
					`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
				);
			},
		})
		.to(boyBall, {
			delay: 5,
			x: 0,
			duration: 3,
			onComplete: () => {
				playPromise(
					`./communities/${data.community}/audio/${slidePrefix}-2.mp3`,
				);
			},
		})
		.to([boyBall, boxClosed], { delay: 4, autoAlpha: 0, duration: 0.1 })
		.to(
			[boyHandsUp, boxOpen],
			{
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					playPromise(
						`./communities/${data.community}/audio/${slidePrefix}-3.mp3`,
					);
				},
			},
			'<',
		)
		.to([boyHandsUp, boxOpen], { delay: 4, autoAlpha: 0, duration: 0.1 })
		.to([boyHandsDown, boxClosed], { autoAlpha: 1, duration: 0.1 }, '<')
		.to(boyHandsDown, {
			delay: 1,
			x: 1200,
			duration: 3,
			onComplete: () => {
				playPromise(
					`./communities/${data.community}/audio/${slidePrefix}-4.mp3`,
				);
			},
		})
		.to(girl, { autoAlpha: 1, duration: 0.1 })
		.to(girl, {
			delay: 2,
			x: 0,
			duration: 3,
		});

	// Short break before showing response options
	await sleep(1000);

	// Show yes/no choice and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
};
