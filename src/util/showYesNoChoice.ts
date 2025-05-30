import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { getResponse } from './getResponse';

export const showYesNoChoice = async (
	slidePrefix: string,
	choicePrefix: string,
) => {
	// Get elements for binary response format (yes/no animated nodding)
	const choiceSlide = document.getElementById(`${choicePrefix}`) as SvgInHtml;
	choiceSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${choicePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${choicePrefix}-repeat`,
	) as SvgInHtml;
	const yesGroup = document.getElementById(
		`${choicePrefix}-${data.emoji}-yes`,
	) as SvgInHtml;
	const yesThumbs = document.getElementById(
		`${choicePrefix}-${data.emoji}-thumbs-yes`,
	) as SvgInHtml;
	const yesFace = document.getElementById(
		`${choicePrefix}-${data.emoji}-face-yes`,
	) as SvgInHtml;
	const yesFacefeatures = document.getElementById(
		`${choicePrefix}-${data.emoji}-facefeatures-yes`,
	) as SvgInHtml;
	const noGroup = document.getElementById(
		`${choicePrefix}-${data.emoji}-no`,
	) as SvgInHtml;
	const noThumbs = document.getElementById(
		`${choicePrefix}-${data.emoji}-thumbs-no`,
	) as SvgInHtml;
	const noFace = document.getElementById(
		`${choicePrefix}-${data.emoji}-face-no`,
	) as SvgInHtml;
	const noFacefeatures = document.getElementById(
		`${choicePrefix}-${data.emoji}-facefeatures-no`,
	) as SvgInHtml;

	// Play audio
	await data.sprite.playPromise(`${slidePrefix}`);

	//first hide thumbs, later let them appear after head nodding/shaking
	gsap.set([yesThumbs, noThumbs], { autoAlpha: 0, pointerEvents: 'none' });

	// animate head shaking & nodding
	await gsap
		.timeline()
		.to(blurr, {
			delay: 1,
			autoAlpha: 0.7,
			duration: 0.6,
		})
		.to(yesGroup, {
			duration: 0.5,
			autoAlpha: 1,
			onStart: () => {
				data.sprite.play('yes');
			},
		})
		.to(yesFace, { y: -8, duration: 0.3 })
		.to(yesFacefeatures, { y: -20, duration: 0.3 }, '<')
		.to(yesFace, {
			y: 8,
			repeat: 2,
			yoyo: true,
			ease: 'power1.inOut',
		})
		.to(
			yesFacefeatures,
			{
				y: 20,
				repeat: 2,
				yoyo: true,
				ease: 'power1.inOut',
			},
			'<',
		)
		.to([yesFace, yesFacefeatures], { y: 0, ease: 'power1.inOut' })
		.to(yesThumbs, { autoAlpha: 1, duration: 1 }, '<')
		.to(noGroup, {
			duration: 0.5,
			autoAlpha: 1,
			onStart: () => {
				data.sprite.play('no');
			},
		})
		.to(noFace, { x: 8, duration: 0.3 })
		.to(noFacefeatures, { x: 20, duration: 0.3 }, '<')
		.to(noFace, {
			x: -8,
			repeat: 2,
			yoyo: true,
			ease: 'power1.inOut',
		})
		.to(
			noFacefeatures,
			{
				x: -20,
				repeat: 2,
				yoyo: true,
				ease: 'power1.inOut',
			},
			'<',
		)
		.to([noFace, noFacefeatures], { x: 0, ease: 'power1.inOut' })
		.to(noThumbs, { autoAlpha: 1, duration: 0.5 }, '<')
		.to([yesGroup, noGroup, repeat], {
			autoAlpha: 1,
			pointerEvents: 'visible',
			cursor: 'pointer',
		});

	// Get Response
	const response = await getResponse([yesGroup.id, noGroup.id]);

	// If the repeat button was clicked, exit early. Otherwise, neutral response audio gets played twice
	if (data.clickedRepeat) {
		// reset the flag for next use
		data.clickedRepeat = false;
		return;
	}

	// Response returns the clicked element.
	// We take the ID of the clicked element (e.g. "link-s-perspectivetaking-yes")
	// and only keep the last part of it, after the last hyphen - (e.g. "yes" or "no")
	data.procedure[data.currentSlide].response = response.id.split('-').pop();

	// Check if the response is correct, and store the score (0 = incorrect, 1 = correct)
	data.procedure[data.currentSlide].score =
		data.procedure[data.currentSlide].response ===
		data.procedure[data.currentSlide].correct
			? 1
			: 0;

	// Hide response slide
	choiceSlide.setAttribute('visibility', 'hidden');

	// play button response sounds only for the first trials
	if (data.simpleSlideCounter <= config.globals.playResponseFeedback) {
		const responseOption = ['ok', 'alright'];
		const randomResponse =
			responseOption[Math.floor(Math.random() * responseOption.length)];
		await data.sprite.playPromise(`neutral-response-${randomResponse}`);
	}
};
