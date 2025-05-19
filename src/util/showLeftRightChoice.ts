import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { play, playPromise } from './audio';
import { getResponse } from './getResponse';

export const showLeftRightChoice = async (slidePrefix: string) => {
	const audio = document.getElementById('audio') as HTMLMediaElement;

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
	const subject = document.getElementById(
		`${slidePrefix}-subject`,
	) as SvgInHtml;

	// Play audio
	await playPromise(`./communities/${data.community}/audio/${slidePrefix}.mp3`);

	// for all other slides, show directly yes and no response buttons
	await gsap
		.timeline()
		.to(blurr, {
			delay: 1,
			autoAlpha: 0.7,
			duration: 0.6,
		})
		.to(subject, {
			autoAlpha: 1,
			duration: 0.5,
		})
		.to(optionLeft, {
			delay: 0.5,
			autoAlpha: 1,
			duration: 0.5,
			pointerEvents: 'visible',
			cursor: 'pointer',
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-left.mp3`);
			},
		})
		.to(optionRight, {
			delay: 2,
			autoAlpha: 1,
			duration: 0.5,
			pointerEvents: 'visible',
			cursor: 'pointer',
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-right.mp3`);
			},
			onComplete: () => {
				gsap.to(headphones, {
					autoAlpha: 1,
					pointerEvents: 'visible',
					cursor: 'pointer',
				});
			},
		});

	// if headphone is clicked, play audio again
	play(
		`./communities/${data.community}/audio/${slidePrefix}.mp3`,
		`link-${slidePrefix}-headphones`,
	);

	// while audio is playing, hide yes and no response buttons
	function handlePlay() {
		gsap
			.timeline()
			.set([optionLeft, optionRight, subject], {
				autoAlpha: 0,
				pointerEvents: 'none',
				cursor: 'default',
			})
			.to(blurr, {
				autoAlpha: 0,
				duration: 0.6,
			});
	}

	// when audio ends, show yes and no response buttons
	function handleEnded() {
		gsap
			.timeline()
			.set([optionLeft, optionRight, subject], {
				autoAlpha: 1,
				pointerEvents: 'visible',
				cursor: 'pointer',
			})
			.to(blurr, {
				autoAlpha: 0.7,
				duration: 0.6,
			});
	}

	audio.addEventListener('play', handlePlay);
	audio.addEventListener('ended', handleEnded);

	// Get Response
	const response = await getResponse([optionLeft.id, optionRight.id]);

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

	// Remove Event Listeners after response
	audio.removeEventListener('play', handlePlay);
	audio.removeEventListener('ended', handleEnded);

	// play button response sounds only for the first trials
	if (data.simpleSlideCounter <= config.globals.playResponseFeedback) {
		const responseOption = ['ok', 'alright'];
		const randomResponse =
			responseOption[Math.floor(Math.random() * responseOption.length)];
		await playPromise(
			`./communities/${data.community}/audio/neutral-response-${randomResponse}.mp3`,
		);
	}
};
