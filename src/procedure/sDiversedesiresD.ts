import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { play, playPromise } from '../util/audio';
import { sleep } from '../util/helpers';
import { hideLeftRightChoice } from '../util/hideLeftRightChoice';
import { showLeftRightChoice } from '../util/showLeftRightChoice';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversedesires-d';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get response from previous slide with interactive choice
	// response stores what participant likes (left or right), boy agent always likes the opposite
	const naySide = data.procedure[data.previousSlide].response;
	const yaySide = naySide === 'left' ? 'right' : 'left';

	// Store correct response
	data.procedure[data.currentSlide].correct = yaySide;

	// In beginning, hide response options
	await hideLeftRightChoice(slidePrefix);

	// Trial-specific animation
	gsap.defaults({ ease: 'none' });

	// Get all relevant elements
	const boy = document.getElementById(`${slidePrefix}-boy`) as SvgInHtml;
	const boyNay = document.getElementById(
		`${slidePrefix}-boy-nay-${naySide}`,
	) as SvgInHtml;
	const boyYay = document.getElementById(
		`${slidePrefix}-boy-yay-${yaySide}`,
	) as SvgInHtml;

	// also get the other (irrelevant) yay/nay agent sides to hide them
	const boyNayHide = document.getElementById(
		`${slidePrefix}-boy-nay-${yaySide}`,
	) as SvgInHtml;
	const boyYayHide = document.getElementById(
		`${slidePrefix}-boy-yay-${naySide}`,
	) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set(boy, { x: 1200 });
	gsap.set([boyNay, boyYay, boyNayHide, boyYayHide], { opacity: 0 });

	// Play initial audio
	await playPromise(
		`./communities/${data.community}/audio/${slidePrefix}-1.mp3`,
	);

	// Animation sequence
	await gsap.timeline().to(boy, {
		x: 0,
		duration: 3,
		onComplete: () => {
			play(`./communities/${data.community}/audio/${slidePrefix}-2.mp3`);
		},
	});

	// For the case that Max doesn't like the cracker but the cucumber
	if (naySide === 'left') {
		// Max first tries the cracker on the left
		await gsap
			.timeline()
			.to(boy, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					play(
						`./communities/${data.community}/audio/${slidePrefix}-3-nay.mp3`,
					);
				},
			})
			.to(
				boyNay,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boyNay, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
				},
			})
			// Max then tries the cracker on the right
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					play(
						`./communities/${data.community}/audio/${slidePrefix}-5-yay.mp3`,
					);
				},
			})
			.to(boyYay, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyYay, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-6.mp3`);
				},
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, { delay: 2, x: 1200, duration: 3 });
		// For the case that Max likes the cracker but not the cucumber
	} else {
		await gsap
			.timeline()
			.to(boy, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					play(
						`./communities/${data.community}/audio/${slidePrefix}-3-yay.mp3`,
					);
				},
			})
			.to(
				boyYay,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boyYay, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-4.mp3`);
				},
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					play(
						`./communities/${data.community}/audio/${slidePrefix}-5-nay.mp3`,
					);
				},
			})
			.to(boyNay, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyNay, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					play(`./communities/${data.community}/audio/${slidePrefix}-6.mp3`);
				},
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, { delay: 2, x: 1200, duration: 3 });
	}

	await sleep(1000);

	// Show left/right response options and store participant response
	await showLeftRightChoice(slidePrefix);
};
