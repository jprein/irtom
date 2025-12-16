import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { hideNextOption, showNextOption } from '../util/hideNextOption';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-yesnotraining-e';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'no';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice
	await hideYesNoChoice(choicePrefix);
	await hideNextOption(slidePrefix);
	gsap.set(`#${slidePrefix}-block`, { autoAlpha: 0 });

	// Short break before showing response options
	await sleep(1000);

	// Show yes/no choice and store participant response
	await showYesNoChoice(slidePrefix, choicePrefix);
	await showNextOption(slidePrefix);
	gsap.set(`#${slidePrefix}-block`, { autoAlpha: 1 });
};
