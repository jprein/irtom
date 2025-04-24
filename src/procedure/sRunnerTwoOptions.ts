import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { getResponse } from '../util/getResponse';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';

export const sRunnerTwoOptions = async (
	currentSlide: string,
	previousSlide: string,
	slideName: string,
) => {
	swapSlides(currentSlide, previousSlide);

	data.simpleSlideCounter++;

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const slidePrefix = slideName;

	// Get elements for binary response format (yes/no animated nodding)
	const responsePrefix = 's-perspectivetaking-e';
	const blurr = document.getElementById(`${responsePrefix}-blurr`) as SvgInHtml;
	const headphones = document.getElementById(`link-${responsePrefix}-headphones`) as SvgInHtml;
	const turtleFeet = document.getElementById(`${responsePrefix}-turtle-feet`) as SvgInHtml;
	const turtleShell = document.getElementById(`${responsePrefix}-turtle-shell`) as SvgInHtml;

	gsap.set([turtleFeet, turtleShell, blurr, headphones], { autoAlpha: 0, pointerEvents: 'none' });

	await sleep(1000);

	// Play audio
	await playPromise(`./communities/${data.community}/audio/${slidePrefix}.mp3`);

	// for all other slides, show directly yes and no response buttons
	await gsap
		.timeline()
		.to(blurr, {
			autoAlpha: 0.9,
			duration: 0.6,
		})
		.to(turtleFeet, { 
			autoAlpha: 1, 
			duration: 0.5,
			pointerEvents: 'visible', 
			cursor: 'pointer', 
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-turtle-feet.mp3`);
			},
		})
		.to(turtleShell, { 
			autoAlpha: 1, 
			duration: 0.5,
			delay: 1,
			pointerEvents: 'visible', 
			cursor: 'pointer', 
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-turtle-shell.mp3`);
			},
		})

	// if headphone is clicked, play audio again
	play(
		`./communities/${data.community}/audio/${slidePrefix}.mp3`,
		`link-${responsePrefix}-headphones`,
	);

	// while audio is playing, hide yes and no response buttons
	function handlePlay() {
		gsap.timeline()
			.set([turtleFeet, turtleShell], { 
				autoAlpha: 0, 
				pointerEvents: 'none', 
				cursor: 'default'
			})
			.to(blurr, {
				autoAlpha: 0,
				duration: 0.6,
			});
	}

	// when audio ends, show yes and no response buttons
	function handleEnded() {
		gsap.timeline()
		.set([turtleFeet, turtleShell], { 
			autoAlpha: 1, 
			pointerEvents: 'visible', 
			cursor: 'pointer' 
		})
		.to(blurr, {
			autoAlpha: 0.9,
			duration: 0.6,
		});
	}

	audio.addEventListener('play', handlePlay);
	audio.addEventListener('ended', handleEnded);

	// Get Response
	const response = await getResponse([turtleFeet.id, turtleShell.id]);

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
