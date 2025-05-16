import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { showYesNoChoice } from '../util/showYesNoChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-perspectivetaking-one-a';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);

	// Short break before showing response options
	await sleep(1000);

	// Show yes/no choice and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
};
