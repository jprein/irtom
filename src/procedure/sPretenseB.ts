import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import gsap from 'gsap';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-pretense-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boyKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-kneeling`,
	) as SvgInHtml;
	const boyNoBrick = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-nobricks`,
	) as SvgInHtml;
	const girlBrick = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-bricks`,
	) as SvgInHtml;
	const girlKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-kneeling`,
	) as SvgInHtml;
	const girlBucket = document.getElementById(
		`${slidePrefix}-bucket-girl`,
	) as SvgInHtml;
	const girlBucketWithBricks = document.getElementById(
		`${slidePrefix}-bucket-girl-bricks`,
	) as SvgInHtml;
	const boyBucket = document.getElementById(
		`${slidePrefix}-bucket-boy`,
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
			],
			{
				autoAlpha: 0,
				x: 0,
			},
		);
		gsap.set([boyKneeling, girlKneeling, boyBucket, girlBucket], {
			autoAlpha: 1,
			x: 0,
		});

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(girlBrick, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(girlBrick, {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				girlKneeling,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to([girlKneeling, girlBucketWithBricks], {
				delay: 2,
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[girlBrick, girlBucket],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(boyKneeling, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boyNoBrick, {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				boyKneeling,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(boyKneeling, {
				delay: 3,
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				boyNoBrick,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			);

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
