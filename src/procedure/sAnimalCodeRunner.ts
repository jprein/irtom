import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { getResponse } from '../util/getResponse';
import { swapSlides } from '../util/slideVisibility';

export const sAnimalCodeRunner = async (
	currentSlide: string,
	previousSlide: string,
	animal: string,
) => {
	swapSlides(currentSlide, previousSlide);

	data.animalSlideCounter++;

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const animalPrefix = animal;
	const yesButton = document.getElementById(
		`link-${animalPrefix}-yes`,
	) as SvgInHtml;
	const noButton = document.getElementById(
		`link-${animalPrefix}-no`,
	) as SvgInHtml;

	gsap.set([yesButton, noButton], { pointerEvents: 'none' });

	if (data.animalSlideCounter <= config.globals.playAnimalYesNoAudio) {
		gsap.set([yesButton, noButton], { autoAlpha: 0 });
	} else {
		gsap.set([yesButton, noButton], { autoAlpha: 0.5 });
	}

	await playPromise(`./communities/${data.community}/audio/${animalPrefix}.mp3`);

	// for the first two animal slides, hide yes and no response buttons
	if (data.animalSlideCounter <= config.globals.playAnimalYesNoAudio) {
		await gsap
			.timeline()
			.to(yesButton, {
				duration: 0.5,
				autoAlpha: 0.5,
				onStart: () => {
					play(`./communities/${data.community}/audio/yes-no.mp3`);
				},
			})
			.to(noButton, {
				delay: 1,
				duration: 0.5,
				autoAlpha: 0.5,
				onComplete: () => {
					gsap.set([yesButton, noButton], { pointerEvents: 'visible' });
					gsap.to([yesButton, noButton], { autoAlpha: 1 });
				},
			});
	} else {
		gsap.set([yesButton, noButton], { autoAlpha: 1, pointerEvents: 'visible' });
	}

	play(
		`./communities/${data.community}/audio/${animalPrefix}.mp3`,
		`link-${animalPrefix}-headphones`,
	);

	function handlePlay() {
		yesButton.style.pointerEvents = 'none';
		noButton.style.pointerEvents = 'none';
		gsap.to([yesButton, noButton], { autoAlpha: 0.5 });
	}

	function handleEnded() {
		yesButton.style.pointerEvents = 'visible';
		noButton.style.pointerEvents = 'visible';
		gsap.to([yesButton, noButton], { autoAlpha: 1 });
	}

	audio.addEventListener('play', handlePlay);
	audio.addEventListener('ended', handleEnded);

	// Get Response
	const response = await getResponse([yesButton.id, noButton.id]);

	data.procedure[data.currentSlide].response = response.id;

	// Remove Event Listeners after response
	audio.removeEventListener('play', handlePlay);
	audio.removeEventListener('ended', handleEnded);

	// play button response sounds only for the first four trials
	if (data.animalSlideCounter <= config.globals.playAnimalResponseFeedback) {
		if (response.id.includes('-yes')) {
			const responseOption = ['ok', 'alright'];
			const randomResponse =
				responseOption[Math.floor(Math.random() * responseOption.length)];
			await playPromise(
				`./communities/${data.community}/audio/neutral-resp-${randomResponse}.mp3`,
			);
		}

		if (response.id.includes('-no')) {
			const responseOption = ['resp-no', 'resp-no-next'];
			const randomResponse =
				responseOption[Math.floor(Math.random() * responseOption.length)];
			await playPromise(
				`./communities/${data.community}/audio/animal-${randomResponse}.mp3`,
			);
		}
	}
};
