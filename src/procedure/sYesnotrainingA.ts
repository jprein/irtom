import { swapSlides } from '../../src/util/slideVisibility';
import { hideYesNoChoice } from '../../src/util/hideYesNoChoice';
import { showYesNoChoice } from '../../src/util/showYesNoChoice';
import { playCorrectIncorrectResponse } from '../util/playCorrectIncorrectResponse';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';
import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-yesnotraining-a';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'yes';
	data.procedure[data.currentSlide].dimension = 'training';
	data.procedure[data.currentSlide].analyse = false;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide yes/no choice (hide all colors)
	await hideYesNoChoice(choicePrefix);

	// only get face features for choosen emoji color
	// and show them already, special for this trial
	const yesGroup = document.getElementById(
		`${choicePrefix}-${data.emoji}-yes`,
	) as SvgInHtml;
	const yesThumbs = document.getElementById(
		`${choicePrefix}-${data.emoji}-thumbs-yes`,
	) as SvgInHtml;
	const noGroup = document.getElementById(
		`${choicePrefix}-${data.emoji}-no`,
	) as SvgInHtml;
	const noThumbs = document.getElementById(
		`${choicePrefix}-${data.emoji}-thumbs-no`,
	) as SvgInHtml;

	await gsap.set([yesThumbs, noThumbs], {
		autoAlpha: 0,
		pointerEvents: 'none',
	});
	await gsap.set([yesGroup, noGroup], {
		autoAlpha: 1,
		pointerEvents: 'none',
	});

	await hideBlockingState(slidePrefix);

	const stopBlockingState = await showYesNoChoice(slidePrefix, choicePrefix);

	if (!stopBlockingState) {
		await playCorrectIncorrectResponse(currentSlide);
		await showBlockingState(slidePrefix);
	}
};
