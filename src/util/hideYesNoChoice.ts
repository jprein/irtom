import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';

export const hideYesNoChoice = async (choicePrefix: string) => {
	// Get elements for binary response format (yes/no animated nodding)
	const choiceSlide = document.getElementById(`${choicePrefix}`) as SvgInHtml;
	choiceSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${choicePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${choicePrefix}-repeat`,
	) as SvgInHtml;

	// Hide all yes/no choice elements
	const blueYes = document.getElementById(
		`${choicePrefix}-blue-yes`,
	) as SvgInHtml;
	const blueNo = document.getElementById(
		`${choicePrefix}-blue-no`,
	) as SvgInHtml;
	const yellowYes = document.getElementById(
		`${choicePrefix}-yellow-yes`,
	) as SvgInHtml;
	const yellowNo = document.getElementById(
		`${choicePrefix}-yellow-no`,
	) as SvgInHtml;
	const purpleYes = document.getElementById(
		`${choicePrefix}-purple-yes`,
	) as SvgInHtml;
	const purpleNo = document.getElementById(
		`${choicePrefix}-purple-no`,
	) as SvgInHtml;

	// only get face features for choosen emoji color
	const yesFace = document.getElementById(
		`${choicePrefix}-${data.emoji}-face-yes`,
	) as SvgInHtml;
	const yesFacefeatures = document.getElementById(
		`${choicePrefix}-${data.emoji}-facefeatures-yes`,
	) as SvgInHtml;
	const noFace = document.getElementById(
		`${choicePrefix}-${data.emoji}-face-no`,
	) as SvgInHtml;
	const noFacefeatures = document.getElementById(
		`${choicePrefix}-${data.emoji}-facefeatures-no`,
	) as SvgInHtml;

	// hide elements
	gsap.set(
		[blueYes, blueNo, yellowYes, yellowNo, purpleYes, purpleNo, blurr, repeat],
		{
			autoAlpha: 0,
			pointerEvents: 'none',
		},
	);

	// set transform origin to center for yes/no faces
	gsap.set([yesFace, yesFacefeatures, noFace, noFacefeatures], {
		transformOrigin: '50% 50%',
	});
};
