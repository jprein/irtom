import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { getResponse } from '../util/getResponse';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';

export const sRunner = async (
	currentSlide: string,
	previousSlide: string,
	slideName: string,
) => {
	swapSlides(currentSlide, previousSlide);

	data.simpleSlideCounter++;

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const slidePrefix = slideName;
	const blurr = document.getElementById(
		`${slidePrefix}-blurr`,
	) as SvgInHtml;

	const yesButton = document.getElementById(
		`link-${slidePrefix}-yes`,
	) as SvgInHtml;
	const noButton = document.getElementById(
		`link-${slidePrefix}-no`,
	) as SvgInHtml;

	gsap.set([yesButton, noButton, blurr], { autoAlpha: 0, pointerEvents: 'none' });

	await sleep(1000);

	await playPromise(`./communities/${data.community}/audio/${slidePrefix}.mp3`);

	// for the first two slides, hide yes and no response buttons
	if (data.simpleSlideCounter <= config.globals.playYesNoAudio) {
		await gsap
			.timeline()
			.to(blurr, {
				autoAlpha: 0.8,
				duration: 0.8,
			})
			.to(yesButton, {
				duration: 0.5,
				autoAlpha: 0.5,
				onStart: () => {
					play(`./communities/${data.community}/audio/yes.mp3`);
				},
			})
			.to(noButton, {
				delay: 1,
				duration: 0.5,
				autoAlpha: 0.5,
				onStart: () => {
					play(`./communities/${data.community}/audio/no.mp3`);
				},
				onComplete: () => {
					gsap.to([yesButton, noButton], { delay: 2, duration: 0.8, autoAlpha: 1, pointerEvents: 'visible' });
				},
			});
	} else {
		gsap.set([yesButton, noButton], { autoAlpha: 1, pointerEvents: 'visible' });
	}

	play(
		`./communities/${data.community}/audio/${slidePrefix}.mp3`,
		`link-${slidePrefix}-headphones`,
	);

	function handlePlay() {
		gsap.timeline()
			.set([yesButton, noButton], { autoAlpha: 0, pointerEvents: 'none'
			})
			.to(blurr, {
				autoAlpha: 0,
				duration: 0.8,
			});
	}

	function handleEnded() {
		gsap.timeline()
		.set([yesButton, noButton], { autoAlpha: 1, pointerEvents: 'visible'
		})
		.to(blurr, {
			autoAlpha: 0.8,
			duration: 0.8,
		});
	}

	audio.addEventListener('play', handlePlay);
	audio.addEventListener('ended', handleEnded);

	// Get Response
	const response = await getResponse([yesButton.id, noButton.id]);

	// Response returns the clicked element. 
	// We take the ID of the clicked element (e.g. "link-s-perspectivetaking-yes")
	// and only keep the last part of it, after the last hyphen - (e.g. "yes" or "no")
	data.procedure[data.currentSlide].response = response.id.split('-').pop();

	// Check if the response is correct, and store the score (0 = incorrect, 1 = correct) 
	data.procedure[data.currentSlide].score = 
	data.procedure[data.currentSlide].response === data.procedure[data.currentSlide].correct ? 1 : 0;

	// Remove Event Listeners after response
	audio.removeEventListener('play', handlePlay);
	audio.removeEventListener('ended', handleEnded);

	// play button response sounds only for the first trials
	if (data.simpleSlideCounter <= config.globals.playResponseFeedback) {
			const responseOption = ['ok', 'alright'];
			const randomResponse =
				responseOption[Math.floor(Math.random() * responseOption.length)];
			await playPromise(
				`./communities/${data.community}/audio/neutral-resp-${randomResponse}.mp3`,
			);
	}
};
