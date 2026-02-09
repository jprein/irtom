import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { hideYesNoChoice } from '../../src/util/hideYesNoChoice';
import { showYesNoChoice } from '../../src/util/showYesNoChoice';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-perspectivetaking-one-b';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'no';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Short break before showing response options
	await sleep(500);

	// Show yes/no choice and store participant response
	const stopBlockingState = await showYesNoChoice(slidePrefix, choicePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
