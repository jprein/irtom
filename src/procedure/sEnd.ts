import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { exitFullscreen } from '../util/helpers';
import config from '../config.yaml';
import { sleep } from '../util/helpers';

export default async ({ currentSlide, previousSlide }) => {
	// swap slides automatically (don’t touch this)
	swapSlides(currentSlide, previousSlide);

	if (!config.devmode.on) {
		exitFullscreen();
	}

	await sleep(2000);

	// window.location.href = `./goodbye.html`;

	// const pinda = document.getElementById('pinda') as HTMLVideoElement;
	// pinda.src = `./communities/${data.community}/video/s-end.${data.videoExtension}`;

	// pinda.addEventListener('ended', () => {
	// 	if (data.community === 'german') {
	// 		gsap.to(pinda, { autoAlpha: 0, duration: 2 });
	// 		window.location.href = `./goodbye.html`;
	// 	}
	// 	gsap.to(pinda, { autoAlpha: 0, duration: 3 });
	// });
};
