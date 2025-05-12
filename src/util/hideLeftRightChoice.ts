import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';

export const hideLeftRightChoice = async (slidePrefix: string) => {
	// Get elements for binary response format (yes/no animated nodding)
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const headphones = document.getElementById(
		`link-${slidePrefix}-headphones`,
	) as SvgInHtml;
	const optionLeft = document.getElementById(
		`${slidePrefix}-left`,
	) as SvgInHtml;
	const optionRight = document.getElementById(
		`${slidePrefix}-right`,
	) as SvgInHtml;

	// Check if the subject element exists (visual reminder for content of test question)
	const subject = document.getElementById(
		`${slidePrefix}-subject`,
	) as SvgInHtml;
	if (subject) {
		gsap.set(subject, { autoAlpha: 0, pointerEvents: 'none' });
	}

	// Originally, hide response options
	gsap.set([optionLeft, optionRight, blurr, headphones], {
		autoAlpha: 0,
		pointerEvents: 'none',
	});
};
