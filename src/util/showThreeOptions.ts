import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { getResponse } from './getResponse';
import { isPauseResponse } from './pauseControls';

export const showThreeOptions = async (slidePrefix: string) => {
	let stopBlockingState = true;
	// Get elements for binary response format (yes/no animated nodding)
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const repeat = document.getElementById(
		`link-${slidePrefix}-repeat`
	) as SvgInHtml;
	const optionLeft = document.getElementById(
		`${slidePrefix}-left`
	) as SvgInHtml;
	const optionCenter = document.getElementById(
		`${slidePrefix}-center`
	) as SvgInHtml;
	const optionRight = document.getElementById(
		`${slidePrefix}-right`
	) as SvgInHtml;
	const subject = document.querySelector(
		`[id*="${slidePrefix}"][id*="subject"]`
	) as SvgInHtml;
	const interactiveElements = [
		optionLeft,
		optionCenter,
		optionRight,
		repeat,
	].filter((element): element is SvgInHtml => Boolean(element));

	if (interactiveElements.length > 0) {
		gsap.set(interactiveElements, {
			pointerEvents: 'none',
			cursor: 'default',
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

	let rightAudioDone: Promise<void> | null = null;

	// for all other slides, show directly response buttons
	await timeline
		.to(optionLeft, {
			delay: 0.2,
			scale: 1.3,
			autoAlpha: 1,
			duration: 0.5,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-left`);
			},
		})
		.to(optionLeft, { delay: 0.2, scale: 1, duration: 0.1 })
		.to(optionCenter, {
			delay: data.spriteJSON.sprite[`${slidePrefix}-left`][1] / 1000,
			scale: 1.3,
			autoAlpha: 1,
			duration: 0.5,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-center`);
			},
		})
		.to(optionCenter, { delay: 0.2, scale: 1, duration: 0.1 })
		.to(optionRight, {
			delay: data.spriteJSON.sprite[`${slidePrefix}-center`][1] / 1000,
			scale: 1.3,
			autoAlpha: 1,
			duration: 0.5,
			onStart: () => {
				rightAudioDone = data.sprite
					.playPromise(`${slidePrefix}-right`)
					.catch(() => undefined);
			},
		})
		.to(optionRight, { delay: 0.2, scale: 1, duration: 0.1 });

	if (rightAudioDone) {
		await rightAudioDone;
	}

	await gsap.to(interactiveElements, {
		autoAlpha: 1,
		duration: 0.1,
		pointerEvents: 'visible',
		cursor: 'pointer',
	});

	// Get Response
	if (!data.clickedRepeat || data.incorrectResponse) {
		const responseStartMs = Date.now();
		const response = await getResponse([
			optionLeft.id,
			optionCenter.id,
			optionRight.id,
		]);
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
	return stopBlockingState;
};
