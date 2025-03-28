import { gsap } from 'gsap';
import { play } from '../util/audio';
import { swapSlides } from '../util/slideVisibility';
import { getResponse } from '../util/getResponse';
import { startFullscreen } from '../util/helpers';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';

export default async ({ currentSlide, previousSlide }) => {
	// show slide
	swapSlides(currentSlide, previousSlide);

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const speaker = document.getElementById('link-si-speaker') as SvgInHtml;
	const pinda = document.getElementById('pinda') as HTMLVideoElement;
	const headphones = document.getElementById('link-si-headphones') as SvgInHtml;
	const nextButton = document.getElementById('link-si-next') as SvgInHtml;
	const childQuestion = document.getElementById('text-introChild') as SvgInHtml;
	const adultQuestion = document.getElementById('text-introAdult') as SvgInHtml;
	gsap.set([headphones, nextButton], { autoAlpha: 0, pointerEvents: 'none' });

	const parentBlock = document.getElementById('s-blocking-state') as SvgInHtml;
	parentBlock.removeAttribute('visibility');
	
	let preloadVideo: Response; 
	
	if(config.devmode.on) {
		preloadVideo = await fetch(
			`./communities/${data.community}/video/s-introduction-short.${data.videoExtension}`
		);
	} else {
		preloadVideo = await fetch(
			`./communities/${data.community}/video/s-introduction.${data.videoExtension}`
		);
	}

	const blob = await preloadVideo.blob();
	const url = URL.createObjectURL(blob);
	parentBlock.setAttribute('visibility', 'hidden');

	if (data.agegroup === 'adult') {
		gsap.set(childQuestion, { autoAlpha: 0 });
	} else {
		// default to child version
		gsap.set(adultQuestion, { autoAlpha: 0 });
	}

	let playingTimeline = true;
	speaker.addEventListener('click', () => {
		if (!config.devmode.on) {
			startFullscreen();
		}
		play(`./communities/${data.community}/audio/pop.mp3`);
		gsap.to(speaker, { autoAlpha: 0 });
		play(`./communities/${data.community}/audio/si-next-red.mp3`, headphones.id);

		audio.addEventListener('play', () => {
			gsap.set([nextButton, headphones], { autoAlpha: 0.25, pointerEvents: 'none' });
		});
		pinda.addEventListener('play', () => {
			gsap.set([nextButton, headphones], { pointerEvents: 'none' });
			if (playingTimeline) {
				gsap.set([nextButton, headphones], { autoAlpha: 0 });
			} else {
				gsap.set([nextButton, headphones], { autoAlpha: 0.5 });
			}
		});
		audio.addEventListener('ended', () => {
			if (playingTimeline) {
				gsap.set([nextButton, headphones], { pointerEvents: 'none' });
				gsap.to([nextButton, headphones], { autoAlpha: 0 });
			} else {
				gsap.set([nextButton, headphones], { pointerEvents: 'visible' });
				gsap.to([nextButton, headphones], { autoAlpha: 1 });
			}
		});
		pinda.addEventListener('ended', () => {
			gsap.set([nextButton, headphones], { pointerEvents: 'visible' });
			gsap.to([nextButton, headphones], { autoAlpha: 1 });
			gsap.to(pinda, { autoAlpha: 0 });
		});

		// start pinda video
		pinda.src = url;
		pinda.play();
		// only start timeline when media can play through
		const communityDelay = {
			headphones: {
				'german': 16,
				'english': 16,

			},
			nextButton: {
				'german': 5,
				'english': 4,
			},
		};
		gsap
			.timeline()
			.to(headphones, {
				autoAlpha: 0.5,
				delay: communityDelay.headphones[data.community],
				duration: 0.5,
			})
			.to(headphones, {
				filter: 'drop-shadow(0px 0px 14px #000)',
				delay: 1,
				repeat: 4,
				yoyo: true,
				reversed: true,
			})
			.to(nextButton, {
				autoAlpha: 0.5,
				delay: communityDelay.nextButton[data.community],
				onComplete: () => {
					playingTimeline = false;
				},
			})
			.to(nextButton, {
				filter: 'drop-shadow(0px 0px 14px #a90707)',
				delay: 1,
				repeat: -1,
				yoyo: true,
				reversed: true,
			});
	});

	await getResponse(nextButton.id);
};
