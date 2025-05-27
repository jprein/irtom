import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { getResponse } from '../util/getResponse';
import { hideThreeOptions } from '../util/hideThreeOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-emojichoice';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Store correct response
	data.procedure[data.currentSlide].correct = '';
	data.procedure[data.currentSlide].score = '';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideThreeOptions(slidePrefix);

	// Trial-specific animation
	const left = document.getElementById(`${slidePrefix}-left`) as SvgInHtml;
	const center = document.getElementById(`${slidePrefix}-center`) as SvgInHtml;
	const right = document.getElementById(`${slidePrefix}-right`) as SvgInHtml;
	const headphones = document.getElementById(
		`link-${slidePrefix}-headphones`,
	) as SvgInHtml;

	await data.sprite.playPromise(`${slidePrefix}-1`);

	await gsap
		.timeline()
		.to(left, {
			autoAlpha: 1,
			duration: 0.5,
			onComplete: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
		.to(center, {
			delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
			autoAlpha: 1,
			duration: 0.5,
			onComplete: () => {
				data.sprite.play(`${slidePrefix}-3`);
			},
		})
		.to(right, {
			delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
			autoAlpha: 1,
			duration: 0.5,
		});

	// Short break before showing response options
	await sleep(1000);

	// Play question
	await data.sprite.playPromise(`${slidePrefix}`);

	// enable clicking on emojis
	await gsap.timeline().to([center, left, right, headphones], {
		autoAlpha: 1,
		duration: 0.5,
		pointerEvents: 'visible',
		cursor: 'pointer',
	});

	// Get Response
	const response = await getResponse([left.id, center.id, right.id]);

	// Response returns the clicked element.
	// We take the ID of the clicked element (e.g. "link-s-perspectivetaking-yes")
	// and only keep the last part of it, after the last hyphen - (e.g. "yes" or "no")
	data.procedure[data.currentSlide].response = response.id.split('-').pop();

	// we also store emoji choice in the data object for easier access later on
	switch (data.procedure[data.currentSlide].response) {
		case 'left':
			data.emoji = 'blue';
			break;
		case 'center':
			data.emoji = 'yellow';
			break;
		case 'right':
			data.emoji = 'purple';
			break;
		default:
			data.emoji = 'yellow'; // default to yellow if something goes wrong
			break;
	}

	// play motivating feedback for first choice
	await data.sprite.playPromise(`${slidePrefix}-feedback`);
};
