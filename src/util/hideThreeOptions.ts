import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';

export const hideThreeOptions = async (slidePrefix: string) => {
	// Get elements for binary response format (yes/no animated nodding)
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${slidePrefix}-repeat`,
	) as SvgInHtml;
	const optionLeft = document.getElementById(
		`${slidePrefix}-left`,
	) as SvgInHtml;
	const optionCenter = document.getElementById(
		`${slidePrefix}-center`,
	) as SvgInHtml;
	const optionRight = document.getElementById(
		`${slidePrefix}-right`,
	) as SvgInHtml;

	// Check if the subject element exists (visual reminder for content of test question)
	const subject = document.querySelector(
		`[id*="${slidePrefix}"][id*="subject"]`,
	) as SvgInHtml;

	if (subject) {
		gsap.set(subject, {
			autoAlpha: 0,
			pointerEvents: 'none',
		});
	}

	// Originally, hide response options
	gsap.set([optionLeft, optionCenter, optionRight, blurr, repeat], {
		autoAlpha: 0,
		pointerEvents: 'none',
	});
};
