import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { getResponse } from '../util/getResponse';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';

export const sRunnerYesNoResponse = async (
	currentSlide: string,
	previousSlide: string,
	slideName: string,
) => {
	swapSlides(currentSlide, previousSlide);

	data.simpleSlideCounter++;

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const slidePrefix = slideName;

	// Get elements for binary response format (yes/no animated nodding)
	const responsePrefix = 's-yesnoresponse';
	const responseSlide = document.getElementById(responsePrefix) as SvgInHtml;
	responseSlide.setAttribute('visibility', 'visible');
	const blurr = document.getElementById(`${responsePrefix}-blurr`) as SvgInHtml;
	const yesGroup = document.getElementById(`${responsePrefix}-yes`) as SvgInHtml;
	const yesFace = document.getElementById(`${responsePrefix}-face-yes`) as SvgInHtml;
	const yesFacefeatures = document.getElementById(`${responsePrefix}-facefeatures-yes`) as SvgInHtml;
	const noGroup = document.getElementById(`${responsePrefix}-no`) as SvgInHtml;
	const noFace = document.getElementById(`${responsePrefix}-face-no`) as SvgInHtml;
	const noFacefeatures = document.getElementById(`${responsePrefix}-facefeatures-no`) as SvgInHtml;

	gsap.set([yesGroup, noGroup, blurr], { autoAlpha: 0, pointerEvents: 'none' });
	gsap.set([yesFace, yesFacefeatures, noFace, noFacefeatures], {transformOrigin: '50% 50%'});

	await sleep(1000);

	// Play audio
	await playPromise(`./communities/${data.community}/audio/${slidePrefix}.mp3`);

	// for the first two slides, hide yes and no response buttons
	if (data.simpleSlideCounter <= config.globals.playYesNoAudio) {
		gsap.set(yesFace, {y: -3}); 
		gsap.set(yesFacefeatures, {y: -4}); 
		gsap.set(noFace, {x: 3})
		gsap.set(noFacefeatures, {x: 4})

		// animate head shaking & nodding
		await gsap
			.timeline()
			.to(blurr, {
				autoAlpha: 0.9,
				duration: 0.6,
			})
			.to(yesGroup, {
				duration: 0.5,
				autoAlpha: 1,
				onStart: () => {
					play(`./communities/${data.community}/audio/yes.mp3`);
				},
			})
			.to(yesFace, {
				y: 3,
				repeat: 3,
				yoyo: true,
				ease: 'power1.inOut',
			})
			.to(yesFacefeatures, {
				y: 4,
				repeat: 3,
				yoyo: true,
				ease: 'power1.inOut',
				onComplete: () => {
					// reset head position
					gsap.to([yesFace, yesFacefeatures], {y: 0, ease: 'power1.inOut'})
				}
			}, "<")
			.to(noGroup, {
				duration: 0.5,
				autoAlpha: 1,
				onStart: () => {
					play(`./communities/${data.community}/audio/no.mp3`);
				},
			})
			.to(noFace, {
				x: -3,
				repeat: 3,
				yoyo: true,
				ease: 'power1.inOut',
			})
			.to(noFacefeatures, {
				x: -4,
				repeat: 3,
				yoyo: true,
				ease: 'power1.inOut',
				onComplete: () => {
					// reset head position
					gsap.to([noFace, noFacefeatures], {x: 0, ease: 'power1.inOut'})
					// enable clicking response
					gsap.to([yesGroup, noGroup], { pointerEvents: 'visible', cursor: 'pointer' });
				}
			}, "<");

	// for all other slides, show directly yes and no response buttons
	} else {
		await gsap
			.timeline()
			.to(blurr, {
			autoAlpha: 0.9,
			duration: 0.6,
			})
			.to([yesGroup, noGroup], { 
				autoAlpha: 1, 
				duration: 0.5,
				pointerEvents: 'visible', 
				cursor: 'pointer' 
			});
	}

	// if headphone is clicked, play audio again
	play(
		`./communities/${data.community}/audio/${slidePrefix}.mp3`,
		`link-${responsePrefix}-headphones`,
	);

	// while audio is playing, hide yes and no response buttons
	function handlePlay() {
		gsap.timeline()
			.set([yesGroup, noGroup], { 
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
		.set([yesGroup, noGroup], { 
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
	const response = await getResponse([yesGroup.id, noGroup.id]);

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

	// Hide response slide
	responseSlide.setAttribute('visibility', 'hidden');
};
