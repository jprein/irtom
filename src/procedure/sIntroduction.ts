import { gsap } from 'gsap';
import { swapSlides } from '../../src/util/slideVisibility';
import { getResponse } from '../../src/util/getResponse';
import { startFullscreen } from '../../src/util/helpers';
import config from '../config.yaml';
import type { SvgInHtml } from '../../src/types';

export default async ({ currentSlide, previousSlide }) => {
	// show slide
	swapSlides(currentSlide, previousSlide);

	const audio = document.getElementById('audio') as HTMLMediaElement;
	// const pinda = document.getElementById('pinda') as HTMLVideoElement;
	const speaker = document.getElementById(
		'link-s-introduction-speaker',
	) as SvgInHtml;
	const repeat = document.getElementById(
		'link-s-introduction-repeat',
	) as SvgInHtml;
	const nextButton = document.getElementById(
		'link-s-introduction-next',
	) as SvgInHtml;
	const childQuestion = document.getElementById('text-introChild') as SvgInHtml;
	const adultQuestion = document.getElementById('text-introAdult') as SvgInHtml;
	gsap.set([repeat, nextButton], { autoAlpha: 0, pointerEvents: 'none' });

	// let preloadVideo: Response;
	// const preloadVideo = await fetch(
	// 	`./communities/${data.community}/video/s-introduction.${data.videoExtension}`,
	// );

	// const blob = await preloadVideo.blob();
	// const url = URL.createObjectURL(blob);

	if (data.agegroup === 'adult') {
		gsap.set(childQuestion, { autoAlpha: 0 });
	} else {
		// default to child version
		gsap.set(adultQuestion, { autoAlpha: 0 });
	}

	const playingTimeline = true;

	speaker.addEventListener('click', async () => {
		if (!config.devmode.on) startFullscreen(data.isIOS);
		//startFullscreen(data.isIOS);

		await data.sprite.playPromise('s-introduction');
		gsap.to([nextButton, repeat], {
			autoAlpha: 1,
			pointerEvents: 'visible',
		});
		gsap.to(speaker, { autoAlpha: 0 });

		// when audio plays, next button and repeat cannot be clicked
		audio.addEventListener('play', () => {
			gsap.to([nextButton, repeat], {
				autoAlpha: 0.25,
				pointerEvents: 'none',
			});
		});

		// when pinda plays, next buttons and repeat are hidden and cannot be clicked
		// pinda.addEventListener('play', () => {
		// 	gsap.to([nextButton, repeat], {
		// 		autoAlpha: 0,
		// 		pointerEvents: 'none',
		// 	});
		// });

		// once audio ended, show next button and repeat again
		audio.addEventListener('ended', () => {
			if (playingTimeline) {
				gsap.to([nextButton, repeat], {
					autoAlpha: 0,
					pointerEvents: 'none',
				});
			} else {
				gsap.to([nextButton, repeat], {
					autoAlpha: 1,
					pointerEvents: 'visible',
				});
			}
		});

		// once pinda ended, show next button and repeat again, hide pinda
		// pinda.addEventListener('ended', () => {
		// 	gsap.to([nextButton, repeat], {
		// 		autoAlpha: 1,
		// 		pointerEvents: 'visible',
		// 	});
		// 	gsap.to(pinda, { autoAlpha: 0 });
		// });

		// start pinda video
		// pinda.src = url;
		// pinda.play();

		// gsap
		// 	.timeline()
		// 	.to(repeat, {
		// 		autoAlpha: 0.5,
		// 		delay: 2,
		// 		duration: 0.5,
		// 	})
		// 	.to(repeat, {
		// 		filter: 'drop-shadow(0px 0px 14px #000)',
		// 		delay: 1,
		// 		repeat: 4,
		// 		yoyo: true,
		// 		reversed: true,
		// 	})
		// 	.to(nextButton, {
		// 		autoAlpha: 0.5,
		// 		delay: 2,
		// 		onComplete: () => {
		// 			playingTimeline = false;
		// 		},
		// 	})
		// 	.to(nextButton, {
		// 		filter: 'drop-shadow(0px 0px 14px #781633)',
		// 		delay: 1,
		// 		repeat: -1,
		// 		yoyo: true,
		// 		reversed: true,
		// 	});
	});

	await getResponse(nextButton.id);

	// introduction slide determines the header of our response log
	data.procedure[data.currentSlide].response = '';
	data.procedure[data.currentSlide].correct = '';
	data.procedure[data.currentSlide].score = '';
};
