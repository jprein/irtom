import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideLeftRightChoice } from '../util/hideLeftRightChoice';
import { showLeftRightChoice } from '../util/showLeftRightChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-perspectivetaking-f';
	
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'left';
	
	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideLeftRightChoice(slidePrefix);
	
	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showLeftRightChoice(slidePrefix);
};
