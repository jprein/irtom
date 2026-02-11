import { swapSlides } from '../../src/util/slideVisibility';
import { exitFullscreen } from '../../src/util/helpers';
import config from '../config.yaml';
import { sleep } from '../../src/util/helpers';

export default async ({ currentSlide, previousSlide }) => {
	// swap slides automatically (don’t touch this)
	swapSlides(currentSlide, previousSlide);

	if (!config.devmode.on) {
		exitFullscreen(data.isIOS);
	}

	await sleep(2000);

	// window.location.href = `./goodbye.html`;

	// const pinda = document.getElementById('pinda') as HTMLVideoElement;
	// pinda.src = `./communities/${data.community}/video/s-end.${data.videoExtension}`;
};
