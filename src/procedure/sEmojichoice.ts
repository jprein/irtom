import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideThreeOptions } from '../util/hideThreeOptions';
import { showThreeOptions } from '../util/showThreeOptions';

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

	// In beginning, hide response options
	await hideThreeOptions(slidePrefix);

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showThreeOptions(slidePrefix);

	// Play motivating feedback for first choice
	await data.sprite.playPromise(`${slidePrefix}-feedback`);
};
