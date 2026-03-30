import config from '../config.yaml';
import { gsap } from 'gsap';

export const setMousePointer = () => {
	config.css.mousePointerObjects.forEach((query: string) => {
		const elements = document.querySelectorAll<HTMLElement>(query);
		if (elements) {
			elements.forEach((e) => (e.style.cursor = 'pointer'));
		}
	});
};

export const setScaleOnHover = () => {
	config.css.scaleOnHoverObjects.forEach((query: string) => {
		const elements = document.querySelectorAll<HTMLElement>(query);
		if (elements) {
			elements.forEach((e) => {
				// Keep centered scaling behavior for all later GSAP scale animations,
				// even when hover listeners are disabled on touch devices.
				gsap.set(e, { transformOrigin: '50% 50%' });
			});
		}
	});

	// Hover animations are meaningless on touch-only devices (iPad, phone).
	// Skip creating dozens of idle GSAP tweens + event listeners.
	if (
		'ontouchstart' in window &&
		navigator.maxTouchPoints > 0 &&
		!window.matchMedia('(hover: hover)').matches
	) {
		return;
	}

	config.css.scaleOnHoverObjects.forEach((query: string) => {
		const elements = document.querySelectorAll<HTMLElement>(query);
		if (elements) {
			elements.forEach((e) => {
				const tween = gsap.to(e, {
					scale: 1.2,
					ease: 'none',
					paused: true,
				});

				e.addEventListener('mouseenter', () => {
					gsap.to(tween, {
						duration: 1.3,
						time: tween.duration(),
						ease: 'elastic.out(0.8, 0.3)',
					});
				});
				e.addEventListener('mouseleave', () => {
					gsap.to(tween, {
						duration: 0.1,
						time: 0,
						ease: 'none',
						overwrite: true,
					});
				});
			});
		}
	});
};
