import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideThreeOptions } from '../util/hideThreeOptions';
import { getResponse } from '../util/getResponse';

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

	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	);

	await gsap
		.timeline()
		.to(left, {
			autoAlpha: 1,
			duration: 0.5,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
			},
		})
		.to(center, {
			delay: 2,
			autoAlpha: 1,
			duration: 0.5,
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			},
		})
		.to(right, {
			delay: 2,
			autoAlpha: 1,
			duration: 0.5,
		});

	// Short break before showing response options
	await sleep(1000);

	// Play question
	await playPromise(`./communities/${data.community}/audio/${slidePrefix}.mp3`);

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
	data.emoji = data.procedure[data.currentSlide].response;

	// play motivating feedback for first choice
	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-feedback.mp3`,
	);
};
