import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import gsap from 'gsap';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-uc-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';
	data.procedure[data.currentSlide].dimension = 'falsebelief';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyWithPensAndCookie = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-pens-cookies`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const cookieBoxClosed = document.getElementById(
		`${slidePrefix}-cb-closed`,
	) as SvgInHtml;
	const cookieBoxWithCookies = document.getElementById(
		`${slidePrefix}-cb-cookies`,
	) as SvgInHtml;
	const cookieBoxWithPens = document.getElementById(
		`${slidePrefix}-cb-pens`,
	) as SvgInHtml;
	const cookieBoxEmpty = document.getElementById(
		`${slidePrefix}-cb-empty`,
	) as SvgInHtml;
	const pensBoxClosed = document.getElementById(
		`${slidePrefix}-pb-closed`,
	) as SvgInHtml;
	const pensBoxWithCookies = document.getElementById(
		`${slidePrefix}-pb-cookies`,
	) as SvgInHtml;
	const pensBoxWithPens = document.getElementById(
		`${slidePrefix}-pb-pens`,
	) as SvgInHtml;
	const pensBoxEmpty = document.getElementById(
		`${slidePrefix}-pb-empty`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girl,
				boyWithPensAndCookie,
				boy,
				cookieBoxClosed,
				cookieBoxWithCookies,
				cookieBoxWithPens,
				cookieBoxEmpty,
				pensBoxClosed,
				pensBoxWithCookies,
				pensBoxWithPens,
				pensBoxEmpty,
			],
			{
				autoAlpha: 0,
				x: 0,
			},
		);
		gsap.set([boy, girl, cookieBoxClosed, pensBoxClosed], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(girl, { x: -1200 });
		gsap.set(boy, { x: 1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();

		tl.to(boy, {
			delay: 0.5,
			x: 0,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to([cookieBoxClosed, pensBoxClosed], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[cookieBoxWithCookies, pensBoxWithPens],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([boyWithPensAndCookie, cookieBoxEmpty, pensBoxEmpty], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[boy, cookieBoxWithCookies, pensBoxWithPens],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to([boyWithPensAndCookie, cookieBoxEmpty, pensBoxEmpty], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boy, cookieBoxWithPens, pensBoxWithCookies],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([cookieBoxWithPens, pensBoxWithCookies], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[cookieBoxClosed, pensBoxClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boy, {
				x: 1200,
				duration: 2,
				delay: 3,
			})
			.to(girl, {
				x: 0,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			});

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
