import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import gsap from 'gsap';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-uc-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyWithPuzzleAndCookie = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-puzzle-cookies`,
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
	const cookieBoxWithPuzzle = document.getElementById(
		`${slidePrefix}-cb-puzzle`,
	) as SvgInHtml;
	const cookieBoxEmpty = document.getElementById(
		`${slidePrefix}-cb-empty`,
	) as SvgInHtml;
	const puzzleBoxClosed = document.getElementById(
		`${slidePrefix}-pb-closed`,
	) as SvgInHtml;
	const puzzleBoxWithCookies = document.getElementById(
		`${slidePrefix}-pb-cookies`,
	) as SvgInHtml;
	const puzzleBoxWithPuzzle = document.getElementById(
		`${slidePrefix}-pb-puzzle`,
	) as SvgInHtml;
	const puzzleBoxEmpty = document.getElementById(
		`${slidePrefix}-pb-empty`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girl,
				boyWithPuzzleAndCookie,
				boy,
				cookieBoxClosed,
				cookieBoxWithCookies,
				cookieBoxWithPuzzle,
				cookieBoxEmpty,
				puzzleBoxClosed,
				puzzleBoxWithCookies,
				puzzleBoxWithPuzzle,
				puzzleBoxEmpty,
			],
			{
				autoAlpha: 0,
				x: 0,
			},
		);
		gsap.set([boy, girl, cookieBoxClosed, puzzleBoxClosed], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(girl, { x: -1200 });
		gsap.set(boy, { x: 1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(boy, {
				x: 0,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to([cookieBoxClosed, puzzleBoxClosed], {
				delay: 3,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[cookieBoxWithCookies, puzzleBoxWithPuzzle],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(
				[boyWithPuzzleAndCookie, cookieBoxEmpty, puzzleBoxEmpty],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(
				[boy, cookieBoxWithCookies, puzzleBoxWithPuzzle],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(boyWithPuzzleAndCookie, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([boyWithPuzzleAndCookie, cookieBoxEmpty, puzzleBoxEmpty], {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boy, cookieBoxWithPuzzle, puzzleBoxWithCookies],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 + 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(
				[cookieBoxWithPuzzle, puzzleBoxWithCookies],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(
				[cookieBoxClosed, puzzleBoxClosed],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(
				boy,
				{
					x: 1200,
					duration: 3,
					delay: 3,
				},
				'<',
			)
			.to(girl, {
				x: 0,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			});

		await sleep(2000);
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
