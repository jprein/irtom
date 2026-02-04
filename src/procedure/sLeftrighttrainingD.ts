import { swapSlides } from '../util/slideVisibility';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import { playCorrectIncorrectResponse } from '../util/playCorrectIncorrectResponse';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-leftrighttraining-d';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
	await playCorrectIncorrectResponse(currentSlide);
	await showBlockingState(slidePrefix);
};
