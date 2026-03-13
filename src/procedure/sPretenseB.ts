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
	const slidePrefix = 's-pretense-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';
	data.procedure[data.currentSlide].dimension = 'pretense';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boyKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-kneeling`
	) as SvgInHtml;
	const boyNoBrick = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-nobricks`
	) as SvgInHtml;
	const girlBrick = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-bricks`
	) as SvgInHtml;
	const girlKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-kneeling`
	) as SvgInHtml;
	const girlBucket = document.getElementById(
		`${slidePrefix}-bucket-girl`
	) as SvgInHtml;
	const girlBucketWithBricks = document.getElementById(
		`${slidePrefix}-bucket-girl-bricks`
	) as SvgInHtml;
	const boyBucket = document.getElementById(
		`${slidePrefix}-bucket-boy`
	) as SvgInHtml;
	const brickAfter = document.getElementById(
		`${slidePrefix}-bricks-after`
	) as SvgInHtml;
	const brickBefore = document.getElementById(
		`${slidePrefix}-bricks-before`
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girlBrick,
				boyNoBrick,
				boyKneeling,
				girlKneeling,
				boyBucket,
				girlBucket,
				girlBucketWithBricks,
				brickAfter,
				brickBefore,
			],
			{
				autoAlpha: 0,
				x: 0,
			}
		);
		gsap.set([boyKneeling, girlKneeling, boyBucket, girlBucket, brickBefore], {
			autoAlpha: 1,
			x: 0,
		});

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(girlBrick, {
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to([girlBrick, brickAfter], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[girlKneeling, brickBefore],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to([girlKneeling, girlBucketWithBricks], {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[girlBrick, girlBucket],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(boyKneeling, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boyNoBrick, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				boyKneeling,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(boyKneeling, {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				boyNoBrick,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			);

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
