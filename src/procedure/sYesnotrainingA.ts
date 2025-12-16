import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { hideYesNoChoice } from '../../src/util/hideYesNoChoice';
import { showYesNoChoice } from '../../src/util/showYesNoChoice';
import { hideNextOption, showNextOption } from '../util/hideNextOption';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-yesnotraining-a';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);
	await hideNextOption(slidePrefix);

	// Short break before showing response options
	await sleep(1000);

	await showYesNoChoice(slidePrefix, choicePrefix);

	await showNextOption(slidePrefix);
};
