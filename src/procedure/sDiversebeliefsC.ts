import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversebeliefs-c';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get response from previous slide with interactive choice
	// correct from previous slide is what is the naySide for the boy now
	const naySide =
		data.previousSlide && data.procedure[data.previousSlide]
			? data.procedure[data.previousSlide].correct || 'right'
			: 'left';
	// yaySide is opposite, so where the boy thinks the dog hides
	const yaySide = naySide === 'left' ? 'right' : 'left';

	// Store correct response
	data.procedure[data.currentSlide].correct =
		yaySide === 'right' ? 'right' : 'left';

	data.procedure[data.currentSlide].dimension = 'diversebeliefs';
	data.procedure[data.currentSlide].analyse = true;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-${naySide}-pointing`,
	) as SvgInHtml;
	const boyYay = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-${yaySide}-pointing`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([boyNay, boyYay], { autoAlpha: 0 });
		gsap.set(boy, { autoAlpha: 1, x: 1200 });

		await data.sprite.playPromise(`${slidePrefix}-1-${naySide}`);

		const tl = await gsap.timeline();
		tl.to(boy, {
			x: 0,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3-${yaySide}`);
				},
			})
			.to(boy, {
				delay:
					data.spriteJSON.sprite[`${slidePrefix}-3-${yaySide}`][1] / 1000 - 1.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boyYay, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(boyYay, { autoAlpha: 0, duration: 0.1 }, '<');
		await tl.then();
		await sleep(500);
		tl.kill();
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before response choices
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
