import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import { gsap } from 'gsap';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-uc-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';
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
	const girlWithShoes = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-shoes`
	) as SvgInHtml;
	const girlWithBook = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-book`
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`
	) as SvgInHtml;
	const boxOpenShoes = document.getElementById(
		`${slidePrefix}-box-shoes`
	) as SvgInHtml;
	const boxOpenBook = document.getElementById(
		`${slidePrefix}-box-book`
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girl,
				girlWithShoes,
				girlWithBook,
				boy,
				boxClosed,
				boxOpenShoes,
				boxOpenBook,
			],
			{
				autoAlpha: 0,
				x: 0,
			}
		);
		gsap.set([girlWithBook, boxClosed, boy], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(girlWithBook, { x: -1200 });
		gsap.set(boy, { x: 1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();

		tl.to(girlWithBook, {
			delay: 0.5,
			x: 0,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(boxClosed, {
				duration: 0.1,
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				autoAlpha: 0,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boxOpenShoes, { autoAlpha: 1, duration: 0.1 }, '<')
			.to([girlWithShoes, boxOpenBook], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(
				[girlWithBook, boxOpenShoes],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(boxClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 + 0.5,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(boxOpenBook, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlWithShoes, {
				delay: 2,
				x: -1200,
				duration: 2,
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 2,
				autoAlpha: 1,
				x: -60,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
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
