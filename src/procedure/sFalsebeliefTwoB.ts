import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import type { SvgInHtml } from '../types';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-two-b';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';
	data.procedure[data.currentSlide].dimension = 'falsebelief';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`
	) as SvgInHtml;
	const girlBox = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-box`
	) as SvgInHtml;
	const girlCookieBox = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-cookiebox`
	) as SvgInHtml;
	const girlCookie = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-cookies`
	) as SvgInHtml;
	const womanGroceries = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-grocery`
	) as SvgInHtml;
	const womanStanding = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-standing`
	) as SvgInHtml;
	const womanSpeaking = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-speaking`
	) as SvgInHtml;
	const womenWithWindow = document.getElementById(
		`${slidePrefix}-window`
	) as SvgInHtml;
	const cupboardClosed = document.getElementById(
		`${slidePrefix}-cupboard-closed`
	) as SvgInHtml;
	const cupboardOpen = document.getElementById(
		`${slidePrefix}-cupboard-open`
	) as SvgInHtml;
	const cupboardOpenWithCookies = document.getElementById(
		`${slidePrefix}-cupboard-cookies`
	) as SvgInHtml;
	const blueBoxClosed = document.getElementById(
		`${slidePrefix}-box-blue-close`
	) as SvgInHtml;
	const blueBoxEmpty = document.getElementById(
		`${slidePrefix}-box-blue-empty`
	) as SvgInHtml;
	const blueBoxCookies = document.getElementById(
		`${slidePrefix}-box-blue-cookies`
	) as SvgInHtml;
	const pinkBoxClosed = document.getElementById(
		`${slidePrefix}-box-pink-close`
	) as SvgInHtml;
	const pinkBoxEmpty = document.getElementById(
		`${slidePrefix}-box-pink-empty`
	) as SvgInHtml;
	const pinkBoxCookies = document.getElementById(
		`${slidePrefix}-box-pink-cookies`
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girlCookie,
				girlCookieBox,
				womanSpeaking,
				womenWithWindow,
				cupboardOpenWithCookies,
				cupboardOpen,
				blueBoxClosed,
				blueBoxEmpty,
				blueBoxCookies,
				pinkBoxClosed,
				pinkBoxEmpty,
				pinkBoxCookies,
			],
			{
				autoAlpha: 0,
			}
		);

		gsap.set([womanStanding, cupboardClosed], {
			autoAlpha: 1,
		});

		gsap.set(girl, { autoAlpha: 1, x: +200 });
		gsap.set(girlBox, { autoAlpha: 1, x: +1600 });
		gsap.set(womanGroceries, { autoAlpha: 1, x: -1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(womanStanding, {
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(womanSpeaking, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(womanStanding, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(womanStanding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(womanSpeaking, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(womanStanding, {
				delay: 2,
				x: -1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girl, { x: +1200, duration: 2 }, '<')
			.to(girlBox, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 1,
				x: 0,
				duration: 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(girlBox, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(girl, { x: 0, duration: 0 })
			.to([girl, blueBoxClosed], {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(girlBox, { autoAlpha: 0, duration: 0.1 }, '<')
			.to([cupboardClosed], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(cupboardOpenWithCookies, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(cupboardOpenWithCookies, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[cupboardOpen, pinkBoxClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([blueBoxClosed, pinkBoxClosed], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(
				[blueBoxEmpty, pinkBoxCookies],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([pinkBoxEmpty, girlCookie], {
				delay: 2,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[pinkBoxCookies, girl],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to([blueBoxEmpty, pinkBoxCookies, girlCookie], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[blueBoxCookies, pinkBoxEmpty, girl],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([blueBoxCookies, pinkBoxEmpty], {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(
				[blueBoxClosed, pinkBoxClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([pinkBoxClosed, cupboardOpen], {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[cupboardOpenWithCookies],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([cupboardOpenWithCookies], {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(cupboardClosed, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(womenWithWindow, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(womenWithWindow, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(girlBox, {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to(
				[girl, blueBoxClosed],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(girlBox, { duration: 2, x: -1200 })
			.to(womanGroceries, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000,
				duration: 3,
				x: 150,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-11`);
				},
			});

		await tl.then();
		await sleep(1000);
		tl.kill();
	}

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showYesNoChoice(slidePrefix, choicePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
