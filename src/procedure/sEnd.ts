import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { exitFullscreen } from '../util/helpers';
import config from '../config.yaml';

export default async ({ currentSlide, previousSlide }) => {
	// swap slides automatically (don’t touch this)
	swapSlides(currentSlide, previousSlide);
	
	if (!config.devmode.on) {
		exitFullscreen();
	}

	const pinda = document.getElementById('pinda') as HTMLVideoElement;
	pinda.src = `./communities/${data.community}/video/s-end.${data.meta.videoExtension}`;

	pinda.addEventListener('ended', () => {
		// For prolific users
		if (data.PROLIFIC_PID !== 'none') {
			// TODO: adjust prolific completion code
			window.location.href = `https://app.prolific.com/submissions/complete?cc=PROLIFICCOMPLETIONCODE`;
		}
		// for german setting, forward to goodbye.html with coupon
		else if (data.community === 'german') {
			gsap.to(pinda, { autoAlpha: 0, duration: 2 });
			window.location.href = `./goodbye.html?coupon=${data.coupon}`;
		}
		gsap.to(pinda, { autoAlpha: 0, duration: 3 });
	});
};
