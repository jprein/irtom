import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { getResponse } from './getResponse';

export const showYesNoChoice = async (
	slidePrefix: string,
	choicePrefix: string,
) => {
	let stopBlockingState = true;
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
	const tl = gsap.timeline({
		defaults: { ease: 'power1.inOut' },
	});

	// 1) blur + show yesGroup (keep durations explicit where needed)
	tl.to(blurr, { delay: 1, autoAlpha: 0.7, duration: 0.3 })
		.to(yesGroup, {
			autoAlpha: 1,
			duration: 0.5,
			onStart: () => data.sprite.play('yes'),
		})

		// 2) YES: move face + features together using a single call each phase
		// phase A: jump up
		.to([yesFace, yesFacefeatures], {
			y: (i) => (i === 0 ? -8 : -20),
			duration: 0.3,
			ease: 'none',
		})

		// phase B: yoyo bounce (one tween instead of two)
		.to([yesFace, yesFacefeatures], {
			y: (i) => (i === 0 ? 8 : 20),
			duration: 0.3,
			repeat: 1,
			yoyo: true,
		})

		// phase C: reset + show thumbs at same time
		.to([yesFace, yesFacefeatures], { y: 0, duration: 0.2 })
		.to(yesThumbs, { autoAlpha: 1, duration: 0.5 }, '<')

		// 3) NO group
		.to(noGroup, {
			autoAlpha: 1,
			duration: 0.5,
			onStart: () => data.sprite.play('no'),
		})

		// NO: left/right together
		.to([noFace, noFacefeatures], {
			x: (i) => (i === 0 ? 8 : 20),
			duration: 0.3,
			ease: 'none',
		})
		.to([noFace, noFacefeatures], {
			x: (i) => (i === 0 ? -8 : -20),
			duration: 0.3,
			repeat: 1,
			yoyo: true,
		})
		.to([noFace, noFacefeatures], { x: 0, duration: 0.2 })
		.to(noThumbs, { autoAlpha: 1, duration: 0.5 }, '<');

	// If you truly need to await completion:
	await tl.then();

	// For the very first yes/no response, play extra audio
	if (data.currentSlide === 'sYesnotrainingA') {
		await data.sprite.playPromise(`${slidePrefix}-1`);
	}

	// Make yes/no response options clickable
	await gsap.to([yesGroup, noGroup, repeat], {
		autoAlpha: 1,
		pointerEvents: 'visible',
		cursor: 'pointer',
	});

	// Get Response (only add event listener for response if not clicked repeat; otherwise two...)
	if (!data.clickedRepeat || data.incorrectResponse) {
		const response = await getResponse([yesGroup.id, noGroup.id]);
		stopBlockingState = false;
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
	}
	return stopBlockingState;
};
