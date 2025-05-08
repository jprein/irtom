import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';

export const hideYesNoChoice = async (
	choicePrefix: string,
) => {

	// Get elements for binary response format (yes/no animated nodding)
	const choiceSlide = document.getElementById(`${choicePrefix}`) as SvgInHtml;
	choiceSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${choicePrefix}-blurr`) as SvgInHtml;
	const headphones = document.getElementById(`link-${choicePrefix}-headphones`) as SvgInHtml;
	const yesGroup = document.getElementById(`${choicePrefix}-yes`) as SvgInHtml;
	const yesFace = document.getElementById(`${choicePrefix}-face-yes`) as SvgInHtml;
	const yesFacefeatures = document.getElementById(`${choicePrefix}-facefeatures-yes`) as SvgInHtml;
	const noGroup = document.getElementById(`${choicePrefix}-no`) as SvgInHtml;
	const noFace = document.getElementById(`${choicePrefix}-face-no`) as SvgInHtml;
	const noFacefeatures = document.getElementById(`${choicePrefix}-facefeatures-no`) as SvgInHtml;

	gsap.set([yesGroup, noGroup, blurr, headphones], { autoAlpha: 0, pointerEvents: 'none' });
	gsap.set([yesFace, yesFacefeatures, noFace, noFacefeatures], {transformOrigin: '50% 50%'});
};
