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
	const speaker = document.getElementById(
		'link-s-introduction-speaker',
	) as SvgInHtml;
	const repeat = document.getElementById(
		'link-s-introduction-repeat',
	) as SvgInHtml;
	const nextButton = document.getElementById(
		'link-s-introduction-next',
	) as SvgInHtml;
	gsap.set([repeat, nextButton], { autoAlpha: 0, pointerEvents: 'none' });

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
	});

	await getResponse(nextButton.id);

	// introduction slide determines the header of our response log
	data.procedure[data.currentSlide].dimension = 'training';
	data.procedure[data.currentSlide].analyse = false;
};
