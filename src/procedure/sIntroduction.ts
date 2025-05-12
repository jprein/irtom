import { gsap } from 'gsap';
import { play, playPromise } from '../util/audio';
import { swapSlides } from '../util/slideVisibility';
import { getResponse } from '../util/getResponse';
import { startFullscreen } from '../util/helpers';
import config from '../config.yaml';
import type { SvgInHtml } from '../types';

export default async ({ currentSlide, previousSlide }) => {
	// show slide
	swapSlides(currentSlide, previousSlide);

	const audio = document.getElementById('audio') as HTMLMediaElement;
	const pinda = document.getElementById('pinda') as HTMLVideoElement;
	const speaker = document.getElementById(
		'link-s-introduction-speaker',
	) as SvgInHtml;
	const headphones = document.getElementById(
		'link-s-introduction-headphones',
	) as SvgInHtml;
	const nextButton = document.getElementById(
		'link-s-introduction-next',
	) as SvgInHtml;
	const childQuestion = document.getElementById('text-introChild') as SvgInHtml;
	const adultQuestion = document.getElementById('text-introAdult') as SvgInHtml;
	gsap.set([headphones, nextButton], { autoAlpha: 0, pointerEvents: 'none' });

	const parentBlock = document.getElementById('s-blocking-state') as SvgInHtml;
	parentBlock.removeAttribute('visibility');

	// let preloadVideo: Response;
	const preloadVideo = await fetch(
		`./communities/${data.community}/video/s-introduction.${data.videoExtension}`,
	);

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

	speaker.addEventListener('click', async () => {
		if (!config.devmode.on) startFullscreen();

		await playPromise(`./communities/${data.community}/audio/pop.mp3`);
		gsap.to(speaker, { autoAlpha: 0 });
		play(
			`./communities/${data.community}/audio/s-introduction-next.mp3`,
			headphones.id,
		);

		// when audio plays, next button and headphones cannot be clicked
		audio.addEventListener('play', () => {
			gsap.to([nextButton, headphones], {
				autoAlpha: 0.25,
				pointerEvents: 'none',
			});
		});

		// when pinda plays, next buttons and headphones are hidden and cannot be clicked
		pinda.addEventListener('play', () => {
			gsap.to([nextButton, headphones], {
				autoAlpha: 0,
				pointerEvents: 'none',
			});
		});

		// once audio ended, show next button and headphones again
		audio.addEventListener('ended', () => {
			if (playingTimeline) {
				gsap.to([nextButton, headphones], {
					autoAlpha: 0,
					pointerEvents: 'none',
				});
			} else {
				gsap.to([nextButton, headphones], {
					autoAlpha: 1,
					pointerEvents: 'visible',
				});
			}
		});

		// once pinda ended, show next button and headphones again, hide pinda
		pinda.addEventListener('ended', () => {
			gsap.to([nextButton, headphones], {
				autoAlpha: 1,
				pointerEvents: 'visible',
			});
			gsap.to(pinda, { autoAlpha: 0 });
		});

		// start pinda video
		pinda.src = url;
		pinda.play();

		// only start timeline when media can play through
		const communityDelay = {
			headphones: {
				german: 16,
				english: 16,
			},
			nextButton: {
				german: 5,
				english: 4,
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
				filter: 'drop-shadow(0px 0px 14px #781633)',
				delay: 1,
				repeat: -1,
				yoyo: true,
				reversed: true,
			});
	});

	await getResponse(nextButton.id);

	// introduction slide determines the header of our response log
	data.procedure[data.currentSlide].response = '';
	data.procedure[data.currentSlide].correct = '';
	data.procedure[data.currentSlide].score = '';
};
