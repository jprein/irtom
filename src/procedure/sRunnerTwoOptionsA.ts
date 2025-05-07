import { gsap } from 'gsap';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';
import { play, playPromise } from '../util/audio';
import { getResponse } from '../util/getResponse';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';

export const sRunnerTwoOptionsA = async (
	currentSlide: string,
	previousSlide: string,
	slideName: string,
) => {
	swapSlides(currentSlide, previousSlide);

	data.simpleSlideCounter++;

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const slidePrefix = slideName;

	// Get elements for binary response format (yes/no animated nodding)
	const blurr = document.getElementById(`${slidePrefix}-blurr`) as SvgInHtml;
	const headphones = document.getElementById(`link-${slidePrefix}-headphones`) as SvgInHtml;
	const optionLeft = document.getElementById(`${slidePrefix}-left`) as SvgInHtml;
	const optionRight = document.getElementById(`${slidePrefix}-right`) as SvgInHtml;
	// Check if the subject element exists
	const subject = document.getElementById(`${slidePrefix}-subject`) as SvgInHtml;
	if (subject) {
   		gsap.set(subject, { autoAlpha: 0, pointerEvents: 'none' });
	}

	gsap.set([optionLeft, optionRight, blurr, headphones], { autoAlpha: 0, pointerEvents: 'none' });


	// HERE FALSEBELIEF STUFF 
	gsap.defaults({ease: "none",});

	const girlDigging = document.getElementById('s-sofalsebelief-a-girl-digging') as SvgInHtml;
	const girlStanding = document.getElementById('s-sofalsebelief-a-girl-standing') as SvgInHtml;
	const girlHiding = document.getElementById('s-sofalsebelief-a-girl-hiding') as SvgInHtml;
	const boyDigging = document.getElementById('s-sofalsebelief-a-boy-digging') as SvgInHtml;
	const boyStanding = document.getElementById('s-sofalsebelief-a-boy-standing') as SvgInHtml;
	const treasure = document.getElementById('s-sofalsebelief-a-treasure') as SvgInHtml;
	const dirt1 = document.getElementById('s-sofalsebelief-a-dirt1') as SvgInHtml;
	const dirt2 = document.getElementById('s-sofalsebelief-a-dirt2') as SvgInHtml;

	gsap.set([girlStanding, girlHiding, boyStanding], { autoAlpha: 0, });

	await playPromise(`./communities/${data.community}/audio/${slidePrefix}-1.mp3`);

	await gsap
		.timeline()
		.to([treasure, dirt1, dirt2], {delay: 1, autoAlpha: 0, duration: 0.5})
		.to([girlDigging, boyDigging], {delay: 1, autoAlpha: 0, duration: 0.1})
		.to([girlStanding, boyStanding], {autoAlpha: 1, duration: 0.1, 
			onComplete: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
			},
		}, '<')
		.to(girlStanding, {delay: 7, x: -1620, duration: 4})
		.to(boyStanding, {x: 370, duration: 2}, '<')
		.to(girlHiding, {delay: 1.5, autoAlpha: 1, duration: 0.2, 
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-3.mp3`);
			}
		})
		.to(boyStanding, {delay: 6, x: 50, duration: 2,
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
			}
		})
		.to(boyStanding, {delay: 2, autoAlpha: 0, duration: 0.1})
		.to(boyDigging, {autoAlpha: 1, duration: 0.1}, '<')
		.to(dirt2, {delay: 1, autoAlpha: 1, duration: 0.1})
		.to(treasure, {delay: 1, autoAlpha: 1, duration: 0.1})
		.to([boyDigging, dirt2], {delay: 1, autoAlpha: 0, duration: 0.1})
		.to(boyStanding, {x: 50, duration: 0}, '<')
		.to(boyStanding, {autoAlpha: 1, duration: 0.1}, '<')
		.to([boyStanding, treasure], {delay: 1, x: -600, duration: 2})
		.to(boyStanding, {delay: 1, autoAlpha: 0, duration: 0.1})
		.to(boyDigging, {x: -600, duration: 0}, '<')
		.to(boyDigging, {autoAlpha: 1, duration: 0.1})
		.to(treasure, {delay: 1, autoAlpha: 0, duration: 0.1})
		.to(boyDigging, {delay: 1, autoAlpha: 0, duration: 0.1})
		.to(boyStanding, {autoAlpha: 1, duration: 0.1}, '<')
		.to(boyStanding, {delay: 1, x: 370, duration: 4, 
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-5.mp3`);
			}
		})
		.to(girlHiding, {delay: 1, autoAlpha: 0, duration: 0.1})



	// END

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
		.to(subject || {}, {
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
			autoAlpha: 1, 
			duration: 0.5,
			delay: 2,
			pointerEvents: 'visible', 
			cursor: 'pointer', 
			onStart: () => {
				play(`./communities/${data.community}/audio/${slidePrefix}-right.mp3`);
			},
		})

	// if headphone is clicked, play audio again
	play(
		`./communities/${data.community}/audio/${slidePrefix}.mp3`,
		`link-${slidePrefix}-headphones`,
	);

	// while audio is playing, hide yes and no response buttons
	function handlePlay() {
		gsap.timeline()
			.to([optionLeft, optionRight], { 
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
		.to([optionLeft, optionRight], { 
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
	const response = await getResponse([optionLeft.id, optionRight.id]);

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
