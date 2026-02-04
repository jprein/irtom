import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { playCorrectIncorrectResponse } from '../util/playCorrectIncorrectResponse';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-yesnotraining-d';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Short break before showing response options
	await sleep(500);

	// Show yes/no choice and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
	await playCorrectIncorrectResponse(currentSlide);
	await showBlockingState(slidePrefix);
};
