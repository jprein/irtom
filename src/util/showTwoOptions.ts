import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { getResponse } from './getResponse';
import { isPauseResponse } from './pauseControls';

export const showTwoOptions = async (slidePrefix: string) => {
	let stopBlockingState = true;
	// Get elements for binary response format (yes/no animated nodding)
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${slidePrefix}-repeat`
	) as SvgInHtml;
	const optionLeft = document.getElementById(
		`${slidePrefix}-left`
	) as SvgInHtml;
	const optionRight = document.getElementById(
		`${slidePrefix}-right`
	) as SvgInHtml;
	const subject = document.querySelector(
		`[id*="${slidePrefix}"][id*="subject"]`
	) as SvgInHtml;
	const interactiveElements = [optionLeft, optionRight, repeat].filter(
		(element): element is SvgInHtml => Boolean(element)
	);

	// Keep options non-clickable until all option audios are done.
	// Reset scale to 1 to prevent stale hover-scale tweens from leaving an
	// option visually enlarged (seen intermittently on iPad Chrome where
	// mouseenter fires on tap and the mouseleave reset races with audio seeks).
	if (interactiveElements.length > 0) {
		gsap.set(interactiveElements, {
			pointerEvents: 'none',
			cursor: 'default',
			scale: 1,
		});
	}

	// Play audio
	await data.sprite.playPromise(`${slidePrefix}`);

	// If the blurr element exists, fade it in
	const timeline = gsap.timeline();
	if (blurr) {
		await timeline.to(blurr, {
			delay: 0.5,
			autoAlpha: 0.7,
			duration: 0.1,
		});
	}

	// If the subject element exists (visual reminder for content of test question),fade it in
	if (subject) {
		await timeline.to(subject, {
			autoAlpha: 1,
			duration: 0.1,
		});
	}

	// for training trials, slower response options
	if (
		slidePrefix.startsWith('s-leftrighttraining') ||
		slidePrefix.startsWith('s-emojichoice') ||
		slidePrefix.startsWith('s-namestraining') ||
		slidePrefix.startsWith('s-yesnotraining')
	) {
		// Show response options
		await timeline
			.to(optionLeft, {
				delay: 0.5,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(optionRight, {
				delay: 0.5,
				autoAlpha: 1,
				duration: 0.1,
			});

		await timeline.to(interactiveElements, {
			autoAlpha: 1,
			duration: 0.1,
			pointerEvents: 'visible',
			cursor: 'pointer',
		});

		// for all other trials, faster response options with animation
	} else {
		let rightAudioDone: Promise<void> | null = null;

		// Show response options
		await timeline
			.to(optionLeft, {
				delay: 0.2,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-left`);
				},
			})
			.to(optionRight, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-left`][1] / 1000 + 0.2,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					rightAudioDone = data.sprite.playPromise(`${slidePrefix}-right`);
				},
			});

		// Keep options disabled until the second option audio has fully finished.
		if (rightAudioDone) {
			await rightAudioDone;
		}

		// Enable clicking only after both audios are finished
		await timeline.to(interactiveElements, {
			autoAlpha: 1,
			duration: 0.1,
			pointerEvents: 'visible',
			cursor: 'pointer',
		});
	}

	// Get Response
	if (!data.clickedRepeat || data.incorrectResponse) {
		const responseStartMs = Date.now();
		const response = await getResponse([optionLeft.id, optionRight.id]);
		if (isPauseResponse(response)) {
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

		// If the correct answer is empty, keep score undefined (e.g. for training trials)
		if (data.procedure[data.currentSlide].correct === undefined) {
			// Otherwise, check if the response is correct, and store the score (0 = incorrect, 1 = correct)
		} else {
			data.procedure[data.currentSlide].score =
				data.procedure[data.currentSlide].response ===
				data.procedure[data.currentSlide].correct
					? 1
					: 0;
		}
	}

	// for two trials where participants provide their own opinion, play confirmation of choice
	if (slidePrefix.startsWith('s-diversedesires-c')) {
		if (data.procedure[data.currentSlide].response === 'left')
			await data.sprite.playPromise('s-diversedesires-c-left-feedback');
		if (data.procedure[data.currentSlide].response === 'right')
			await data.sprite.playPromise('s-diversedesires-c-right-feedback');
	}
	if (slidePrefix.startsWith('s-diversebeliefs-a')) {
		if (data.procedure[data.currentSlide].response === 'left')
			await data.sprite.playPromise('s-diversebeliefs-a-left-feedback');
		if (data.procedure[data.currentSlide].response === 'right')
			await data.sprite.playPromise('s-diversebeliefs-a-right-feedback');
	}
	return stopBlockingState;
};
