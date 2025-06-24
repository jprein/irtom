import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { hideYesNoChoice } from '../../src/util/hideYesNoChoice';
import { showYesNoChoice } from '../../src/util/showYesNoChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-perspectivetaking-one-c';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'no';

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
