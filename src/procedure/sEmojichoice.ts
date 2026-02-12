import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { showThreeOptions } from '../../src/util/showThreeOptions';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';
import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-emojichoice';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// There is no correct response / no score
	data.procedure[data.currentSlide].correct = '';
	data.procedure[data.currentSlide].score = '';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// usually hide options, but in this trial we want to show emojis from beginning on
	// get elements, so that we can disable pointerEvent before audio played
	const optionLeft = document.getElementById(
		`${slidePrefix}-left`,
	) as SvgInHtml;
	const optionCenter = document.getElementById(
		`${slidePrefix}-center`,
	) as SvgInHtml;
	const optionRight = document.getElementById(
		`${slidePrefix}-right`,
	) as SvgInHtml;
	// Originally, hide response options
	gsap.set([optionLeft, optionCenter, optionRight], {
		pointerEvents: 'none',
	});

	await hideBlockingState(slidePrefix);
	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showThreeOptions(slidePrefix);

	if (data.procedure[data.currentSlide].response === 'left')
		data.emoji = 'blue';
	else if (data.procedure[data.currentSlide].response === 'center')
		data.emoji = 'yellow';
	else if (data.procedure[data.currentSlide].response === 'right')
		data.emoji = 'purple';

	// Play motivating feedback for first choice
	await data.sprite.playPromise(`${slidePrefix}-feedback`);

	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
