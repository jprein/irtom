import { gsap } from 'gsap';
import { swapSlides } from '../../src/util/slideVisibility';
import { getResponse } from '../../src/util/getResponse';
import { startFullscreen } from '../../src/util/helpers';
import config from '../config.yaml';
import type { SvgInHtml } from '../../src/types';
import { createSprite } from '../util/createSprite';

export default async ({ currentSlide, previousSlide }) => {
	const introStartMs = performance.now();
	const logTiming = (label: string, fromMs?: number) => {
		const nowMs = performance.now();
		const sinceIntroMs = (nowMs - introStartMs).toFixed(1);
		const sinceMarker = fromMs
			? ` | +${(nowMs - fromMs).toFixed(1)}ms since marker`
			: '';
		console.log(
			`[sIntroduction][${new Date().toISOString()}] +${sinceIntroMs}ms ${label}${sinceMarker}`,
		);
	};

	logTiming('entered slide');

	// show slide
	swapSlides(currentSlide, previousSlide);
	logTiming('swapSlides done');

	//const audio = document.getElementById('audio') as HTMLMediaElement;
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
	logTiming(`agegroup UI applied (${data.agegroup})`);

	//const playingTimeline = true;
	logTiming(`device info os=${data.osName} isIOS=${data.isIOS}`);
	speaker.addEventListener(
		'click',
		async () => {
			const clickStartMs = performance.now();
			logTiming('speaker clicked', clickStartMs);

			if (!config.devmode.on && !data.isIOS) {
				startFullscreen(data.isIOS);
				logTiming('startFullscreen triggered', clickStartMs);
			}
			//startFullscreen(data.isIOS);

			// const audioStartMss = performance.now();
			// logTiming('playPromise start', clickStartMs);
			// await data.sprite.ensureReady();
			// logTiming('playPromise resolved', audioStartMss);

			// then,create the sprite instance
			const audioStartMss = performance.now();
			logTiming('createSprite start', clickStartMs);
			data.sprite = await createSprite(data.spriteJSON);
			logTiming('createSprite resolved', audioStartMss);

			const audioStartMs = performance.now();
			logTiming('playPromise start', audioStartMss);
			await data.sprite.playPromise('s-introduction');
			logTiming('playPromise resolved', audioStartMs);

			const tl = gsap.timeline();
			// tl.to(speaker, {
			// 	onStart: () => {
			// 		data.sprite.play('s-introduction');
			// 	},
			// });
			tl.to(speaker, {
				duration: 0.1,
				autoAlpha: 0,
				//delay: data.spriteJSON.sprite['s-introduction'][1] / 1000,
			}).to(
				[nextButton, repeat],
				{
					duration: 0.1,
					autoAlpha: 1,
					pointerEvents: 'auto',
				},
				'<',
			);

			const timelineStartMs = performance.now();
			logTiming('timeline start', clickStartMs);
			await tl.then();
			logTiming('timeline resolved', timelineStartMs);

			tl.kill();
			logTiming('timeline killed / speaker flow done', clickStartMs);
		},
		{ once: true },
	);

	// when audio plays, next button and repeat cannot be clicked
	// audio.addEventListener('play', () => {
	// 	gsap.to([nextButton, repeat], {
	// 		autoAlpha: 0.25,
	// 		pointerEvents: 'none',
	// 	});
	// });

	// when pinda plays, next buttons and repeat are hidden and cannot be clicked
	// pinda.addEventListener('play', () => {
	// 	gsap.to([nextButton, repeat], {
	// 		autoAlpha: 0,
	// 		pointerEvents: 'none',
	// 	});
	// });

	// once audio ended, show next button and repeat again
	// audio.addEventListener('ended', () => {
	// 	if (playingTimeline) {
	// 		gsap.to([nextButton, repeat], {
	// 			autoAlpha: 0,
	// 			pointerEvents: 'none',
	// 		});
	// 	} else {
	// 		gsap.to([nextButton, repeat], {
	// 			autoAlpha: 1,
	// 			pointerEvents: 'visible',
	// 		});
	// 	}
	// });

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
	//});

	const responseWaitStartMs = performance.now();
	logTiming('waiting for getResponse', responseWaitStartMs);
	await getResponse(nextButton.id);
	logTiming('getResponse resolved', responseWaitStartMs);

	// introduction slide determines the header of our response log
	data.procedure[data.currentSlide].response = '';
	data.procedure[data.currentSlide].correct = '';
	data.procedure[data.currentSlide].score = '';
	logTiming('response fields written');
};
