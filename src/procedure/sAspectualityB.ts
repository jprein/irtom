import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import { gsap } from 'gsap';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-aspectuality-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';
	data.procedure[data.currentSlide].dimension = 'aspectuality';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girlBallSqueezed = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball-squeezed`
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`
	) as SvgInHtml;
	const girlBall = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball`
	) as SvgInHtml;
	const girlRightBall = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-right-ball`
	) as SvgInHtml;
	const girlLeftBall = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-left-ball`
	) as SvgInHtml;
	const girlTowel = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball-towel`
	) as SvgInHtml;
	const girlRightTowel = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-right-towel`
	) as SvgInHtml;
	const girlLeftTowel = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-left-towel`
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`
	) as SvgInHtml;
	const basketClosed = document.getElementById(
		`${slidePrefix}-basket-closed`
	) as SvgInHtml;
	const basketOpen = document.getElementById(
		`${slidePrefix}-basket-open`
	) as SvgInHtml;
	const ball = document.getElementById(`${slidePrefix}-ball`) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girlBallSqueezed,
				girlBall,
				girlTowel,
				boxOpen,
				basketOpen,
				girlLeftBall,
				girlRightBall,
				girlLeftTowel,
				girlRightTowel,
			],
			{
				autoAlpha: 0,
			}
		);

		gsap.set([girl, basketClosed, boxClosed, ball], {
			autoAlpha: 1,
		});
		gsap.set([girl, girlTowel, girlLeftTowel], { x: 0 });

		gsap.set(boy, { autoAlpha: 1, x: -400 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		const tl = await gsap.timeline();

		tl.to([girl, ball], {
			autoAlpha: 0,
			duration: 0.1,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(girlBall, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlLeftBall, { delay: 1, autoAlpha: 1, duration: 0.1 })
			.to(girlBall, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(boxClosed, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(boxOpen, { autoAlpha: 1, duration: 0.1 }, '<')
			.to([boxOpen, girlLeftBall], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girl, boxClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				x: -1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boxClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(boxOpen, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlLeftBall, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlLeftBall, { delay: 1, autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlBall, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlBall, {})
			.to(girlBallSqueezed, {
				delay: 2,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`squeak`);
				},
			})
			.to(girlBall, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlBallSqueezed, { delay: 1, autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlBall, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlBall, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 4,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(girl, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlBall, { autoAlpha: 1, duration: 0.1 })
			.to(girlBall, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(girlLeftBall, { autoAlpha: 1, duration: 0.1 }, '<')
			.to([girlLeftBall, boxOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girl, boxClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				x: -400,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(boxClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(boxOpen, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlLeftTowel, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boxOpen, { delay: 0.5, autoAlpha: 0, duration: 0.1 })
			.to(boxClosed, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlLeftTowel, {
				delay: 0.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(girlTowel, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlTowel, {
				delay: 2,
				onStart: () => {
					data.sprite.play(`squeak`);
				},
			})
			.to(basketClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(basketOpen, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlTowel, { x: 80, duration: 1 })
			.to(girlRightTowel, { x: 60, duration: 0 }, '<')
			.to(girlTowel, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlRightTowel, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, { x: 100, duration: 0 }, '<')
			.to(girlRightTowel, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(basketOpen, { delay: 0.5, autoAlpha: 0, duration: 0.1 })
			.to(basketClosed, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, { x: 400, duration: 1.5 });

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
