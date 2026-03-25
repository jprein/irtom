import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { getResponse } from './getResponse';
import { isPauseResponse } from './pauseControls';

export const showYesNoChoice = async (
	slidePrefix: string,
	choicePrefix: string
) => {
	let stopBlockingState = true;
	// Get elements for binary response format (yes/no animated nodding)
	const choiceSlide = document.getElementById(`${choicePrefix}`) as SvgInHtml;
	choiceSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${choicePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${choicePrefix}-repeat`
	) as SvgInHtml;
	const yesGroup = document.getElementById(
		`${choicePrefix}-${data.emoji}-yes`
	) as SvgInHtml;
	const yesThumbs = document.getElementById(
		`${choicePrefix}-${data.emoji}-thumbs-yes`
	) as SvgInHtml;
	const yesFace = document.getElementById(
		`${choicePrefix}-${data.emoji}-face-yes`
	) as SvgInHtml;
	const yesFacefeatures = document.getElementById(
		`${choicePrefix}-${data.emoji}-facefeatures-yes`
	) as SvgInHtml;
	const noGroup = document.getElementById(
		`${choicePrefix}-${data.emoji}-no`
	) as SvgInHtml;
	const noThumbs = document.getElementById(
		`${choicePrefix}-${data.emoji}-thumbs-no`
	) as SvgInHtml;
	const noFace = document.getElementById(
		`${choicePrefix}-${data.emoji}-face-no`
	) as SvgInHtml;
	const noFacefeatures = document.getElementById(
		`${choicePrefix}-${data.emoji}-facefeatures-no`
	) as SvgInHtml;
	const interactiveElements = [yesGroup, noGroup, repeat].filter(
		(element): element is SvgInHtml => Boolean(element)
	);

	if (interactiveElements.length > 0) {
		gsap.set(interactiveElements, {
			pointerEvents: 'none',
			cursor: 'default',
		});
	}

	// Play audio
	await data.sprite.playPromise(`${slidePrefix}`);

	//first hide thumbs, later let them appear after head nodding/shaking
	gsap.set([yesThumbs, noThumbs], { autoAlpha: 0, pointerEvents: 'none' });

	// animate head shaking & nodding
	const tl = gsap.timeline({
		defaults: { ease: 'power1.inOut' },
	});
	let yesAudioDone: Promise<void> | null = null;
	let noAudioDone: Promise<void> | null = null;

	// 1) blur + show yesGroup (keep durations explicit where needed)
	tl.to(blurr, { delay: 0.5, autoAlpha: 0.7, duration: 0.1 });

	// for first yes/no training trial, enlarge the particular group to make it more salient
	if (slidePrefix === 's-yesnotraining-a') {
		tl.to(yesGroup, {
			scale: 1.2,
			duration: 0.2,
		});
	}

	tl.to(yesGroup, {
		delay: 0.5,
		autoAlpha: 1,
		duration: 0.1,
		onStart: () => {
			yesAudioDone = data.sprite.playPromise('yes').catch(() => undefined);
		},
	});

	// 2) YES: move face + features together using a single call each phase
	// phase A: jump up
	tl.to([yesFace, yesFacefeatures], {
		y: (i) => (i === 0 ? -8 : -20),
		duration: 0.1,
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
		.to([yesFace, yesFacefeatures], { y: 0, duration: 0.1 })
		.to(yesThumbs, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(yesGroup, { scale: 1, duration: 0.1 });

	// 3) NO group
	// for first yes/no training trial, enlarge the particular group to make it more salient
	if (slidePrefix === 's-yesnotraining-a') {
		tl.to(noGroup, {
			scale: 1.2,
			duration: 0.2,
		});
	}

	tl.to(noGroup, {
		delay: 0.3,
		autoAlpha: 1,
		duration: 0.1,
		onStart: () => {
			noAudioDone = data.sprite.playPromise('no').catch(() => undefined);
		},
	});

	// NO: left/right together
	tl.to([noFace, noFacefeatures], {
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
		.to([noFace, noFacefeatures], { x: 0, duration: 0.1 })
		.to(noThumbs, { autoAlpha: 1, duration: 0.1 }, '<')
		.to(noGroup, { scale: 1, duration: 0.1 });

	// If you truly need to await completion:
	await tl.then();
	await Promise.all([yesAudioDone, noAudioDone].filter(Boolean));

	// For the very first yes/no response, play extra audio
	if (data.currentSlide === 'sYesnotrainingA') {
		await data.sprite.playPromise(`${slidePrefix}-1`);
	}

	// Make yes/no response options clickable
	await gsap.to(interactiveElements, {
		autoAlpha: 1,
		pointerEvents: 'visible',
		cursor: 'pointer',
	});

	// Get Response (only add event listener for response if not clicked repeat; otherwise two...)
	if (!data.clickedRepeat || data.incorrectResponse) {
		const responseStartMs = Date.now();
		const response = await getResponse([yesGroup.id, noGroup.id]);
		if (isPauseResponse(response)) {
			choiceSlide.setAttribute('visibility', 'hidden');
			return true;
		}
		data.procedure[data.currentSlide].responseTimeSec = Number(
			((Date.now() - responseStartMs) / 1000).toFixed(2)
		);
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
	}
	return stopBlockingState;
};
