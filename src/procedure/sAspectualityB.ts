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
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girlBallSqueezed = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball-squeezed`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlBall = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball`,
	) as SvgInHtml;
	const girlBallRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball-right`,
	) as SvgInHtml;
	const girlBallLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball-left`,
	) as SvgInHtml;
	const girlTowel = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-ball-towl`,
	) as SvgInHtml;
	const girlTowelRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-towl-right`,
	) as SvgInHtml;
	const girlTowelLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-towl-left`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const basketClosed = document.getElementById(
		`${slidePrefix}-basket-closed`,
	) as SvgInHtml;
	const basketOpen = document.getElementById(
		`${slidePrefix}-basket-open`,
	) as SvgInHtml;
	const ball = document.getElementById(`${slidePrefix}-ball`) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girlBallSqueezed,
				boy,
				girl,
				girlBall,
				girlTowel,
				boxClosed,
				boxOpen,
				basketClosed,
				basketOpen,
				ball,
				girlBallLeft,
				girlBallRight,
				girlTowelLeft,
				girlTowelRight,
			],
			{
				autoAlpha: 0,
			},
		);

		gsap.set([girl, boy, basketClosed, boxClosed, ball], {
			autoAlpha: 1,
		});

		gsap.set(boy, { x: -400 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		const tl = await gsap.timeline();

		tl.to([girl, ball], {
			delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
			autoAlpha: 0,
			duration: 0.1,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(
				[girlBall],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlBallLeft], {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				girlBall,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(boxClosed, {
				delay: 1,
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
			.to([boxOpen, girlBallLeft], {
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
				'<',
			)
			.to(boy, {
				x: -1200,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boxClosed, {
				autoAlpha: 0,
				duration: 0.1,
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(
				[boxOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girl], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girlBallLeft],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(
				[girlBallLeft],
				{
					delay: 1,
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(
				[girlBall],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlBall], {
				delay: data.spriteJSON.sprite[`squeak`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`squeak`);
				},
			})
			.to(
				[girlBallSqueezed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(
				[girlBall],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(
				[girlBallSqueezed],
				{
					delay: 1,
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(
				[girlBall],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girlBall, {
				autoAlpha: 1,
				duration: 0.1,
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(
				[girl],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girlBall, {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to([girlBall], {
				autoAlpha: 0,
				duration: 0.1,
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(
				girlBallLeft,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlBallLeft, boxOpen], {
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
				'<',
			)
			.to(boy, {
				x: -400,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 4,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(boxClosed, {
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
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlTowelLeft,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girlTowelLeft, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlTowel,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlTowel], {
				delay: data.spriteJSON.sprite[`squeak`][1] / 1000 + 1,
				onStart: () => {
					data.sprite.play(`squeak`);
				},
			})
			.to([girlTowel], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to([basketClosed], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[basketOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girlTowel, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlTowelRight,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girlTowelRight, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girl,
				{
					autoAlpha: 1,
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

	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
