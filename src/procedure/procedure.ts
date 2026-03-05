import _ from 'lodash';
import { gsap } from 'gsap';
import config from '../config.yaml';
import { stop } from '../../src/util/audio';
import {
	uploadCsv,
	downloadCsv,
	millisToMinutesAndSeconds,
	sleep,
	downloadWebcamVideo,
	uploadWebcamVideo,
} from '../../src/util/helpers';
import type { SvgInHtml } from '../../src/types';
import { stopRecording } from '../util/mediaRecorderServices';
import { addSpinner, hideSpinner } from '../util/leuphanaSpinner';

// register all slide modules in this folder
const slideModules = import.meta.glob('./s*.ts');

export const procedure = async () => {
	let currentProcedure = _.cloneDeep(config.procedure[data.community]);

	// check if nested objects exist
	let isNested = currentProcedure.some((e) => _.isPlainObject(e));

	if (isNested) {
		while (isNested) {
			// get index of first nested occurrence (ni)
			const ni = currentProcedure.findIndex((e) => _.isPlainObject(e));

			// get the first nested object key
			const nkey = Object.keys(currentProcedure[ni])[0];

			// check if nested object is nested again
			const isNestedAgain: boolean = currentProcedure[ni][nkey].some(
				(e: string) => _.isPlainObject(e),
			);

			// if nested object is nested again, get nested key(s)
			if (isNestedAgain) {
				// shuffle nested keys in procedure
				currentProcedure[ni][nkey] = _.shuffle(currentProcedure[ni][nkey]);

				// get new nested key order
				const nnkeys = currentProcedure[ni][nkey].map(
					(e: string[]) => Object.keys(e)[0],
				) as string[];

				// save shuffled order in data object
				data[nkey] = nnkeys;

				// shuffle inside our double nested array
				nnkeys.forEach((nnkey, i) => {
					let nnArray = currentProcedure[ni][nkey][i][nnkey] as string[];
					nnArray = _.shuffle(nnArray);

					// save shuffled order in data object
					data[nnkey] = nnArray;

					// save shuffled order in procedure
					currentProcedure[ni][nkey][i][nnkey] = nnArray;
				});

				// flatten nested array
				let subArrays: string[] = [];
				currentProcedure[ni][nkey].forEach((e: string) => {
					subArrays.push(...Object.values(e));
				});
				subArrays = _.flattenDeep(subArrays);
				// overwrite procedure with flattened array
				currentProcedure.splice(ni, 1, ...subArrays);
			}
			// if nested object is not nested again, shuffle nested keys in procedure
			else {
				currentProcedure[ni][nkey] = _.shuffle(currentProcedure[ni][nkey]);
				data[nkey] = currentProcedure[ni][nkey];
				const subArr = Object.values(currentProcedure[ni][nkey]) as string[];
				currentProcedure.splice(ni, 1, ...subArr);
			}

			// check if procedure still contains nested objects
			isNested = currentProcedure.some((e) => _.isPlainObject(e));
		}
	}

	data.simpleSlideCounter = 0;

	currentProcedure = currentProcedure.map((e: string) => _.camelCase(e));
	data.currentProcedure = currentProcedure;

	if (config.devmode.on) {
		console.group(
			'%cProcedure for this community',
			'background-color: #1798AE ; color: #ffffff ; font-weight: bold ; padding: 4px ; border-radius: 5px;',
		);
		console.table(currentProcedure);
		console.groupEnd();
	}
	// const procedureStartMs = performance.now();
	// const logTiming = (label: string, fromMs?: number) => {
	// 	const nowMs = performance.now();
	// 	const sinceIntroMs = (nowMs - procedureStartMs).toFixed(1);
	// 	const sinceMarker = fromMs
	// 		? ` | +${(nowMs - fromMs).toFixed(1)}ms since marker`
	// 		: '';
	// 	console.log(
	// 		`[sProcedure][${new Date().toISOString()}] +${sinceIntroMs}ms ${label}${sinceMarker}`,
	// 	);
	// };

	data.totalSlides = currentProcedure.length;
	// const audioStartMs = performance.now();
	// logTiming('playPromise start', procedureStartMs);
	// //await data.sprite.playPromise('s-introduction');
	// await data.sprite.ensureReady();
	// logTiming('playPromise resolved', audioStartMs);

	// hide loading spinner
	const parentBlock = document.getElementById('s-blocking-state') as SvgInHtml;
	// parentBlock.removeAttribute('visibility');
	const blockingStateAnimation = gsap.getById('blocking-state-animation');
	if (blockingStateAnimation) blockingStateAnimation.kill();
	parentBlock.setAttribute('visibility', 'hidden');

	// ================================================
	// PROCEDURE LOOP
	// ================================================
	for (const [index, slide] of currentProcedure.entries()) {
		// if (index > 0) {
		// 	await sleep(1000);
		// 	await hideSpinner();
		// }
		// get previous, current and next slide
		const previousSlide = currentProcedure[index - 1];
		const currentSlide = slide;
		const nextSlide = currentProcedure[index + 1];
		// kebab-cased version
		const previousSlideKc = _.kebabCase(previousSlide);
		const currentSlideKc = _.kebabCase(currentSlide);
		// const nextSlideKc = _.kebabCase(nextSlide);

		// store into data object
		data.previousSlide = previousSlide;
		data.currentSlide = currentSlide;
		data.nextSlide = nextSlide;
		data.slideCounter++;

		// init default procedure response
		data.procedure[currentSlide] = {
			dimension: undefined,
			trialNr: data.slideCounter,
			trialDuration: undefined,
			response: undefined,
			correct: undefined,
			score: undefined,
			repeatOnClick: 0,
			repeatIncorrect: 0,
			analyse: undefined,
		};

		// get possible response buttons (next buttons, yes/no buttons)
		const responseButtons = document.querySelectorAll(
			`#${currentSlideKc} [id^=link][id$=next], #${currentSlideKc} [id^=link][id$=yes], #${currentSlideKc} [id^=link][id$=no]`,
		);

		// start time tracking
		const startTime = new Date().getTime();

		// ----------------------------------------------------------------------------
		// ACTUAL LOOP
		// camelCased in procedure directory (e.g., sIntroduction.ts)
		// kebab-cased arguments, as required by Illustrator slide IDs

		// Import the slide behavior dynamically
		// const runSlideBehavior = async () => {
		// 	await (
		// 		await import(`./${currentSlide}`)
		// 	).default({
		// 		currentSlide: currentSlideKc,
		// 		previousSlide: previousSlideKc,
		// 	});
		// };

		const runSlideBehavior = async () => {
			const modulePath = `./${currentSlide}.ts`;
			const loader = slideModules[modulePath];
			if (!loader) {
				throw new Error(`Slide not found: ${modulePath}`);
			}
			const slideModule = await loader();
			await slideModule.default({
				currentSlide: _.kebabCase(currentSlide),
				previousSlide: _.kebabCase(previousSlide),
			});
		};

		// Prefetch next slide module to reduce transition latency on slower devices.
		if (nextSlide) {
			const nextModulePath = `./${nextSlide}.ts`;
			const nextLoader = slideModules[nextModulePath];
			if (nextLoader) void nextLoader();
		}

		// ENABLE REPEAT BUTTON
		// If a repeat element exists on the slide, attach a listener to re-run the behavior when clicked
		let repeatSvg = document.querySelector(
			`#${currentSlideKc} [id$="-repeat"]`,
		)! as SvgInHtml;

		// If the repeat element is not found, try to get it from yes/no slide
		if (!repeatSvg) {
			repeatSvg = document.getElementById('s-yesnochoice-repeat') as SvgInHtml;
			repeatSvg = document.querySelector(
				`#s-yesnochoice [id$="-repeat"]`,
			)! as SvgInHtml;
		}

		// Check whether it is a training trial where participants get feedback
		// regex to check if the current slide contains training (case insensitive)
		const trainingRegex = /training/i;
		data.procedure[data.currentSlide].trainingTrial =
			trainingRegex.test(currentSlide);

		// Put in function so that we can remove the event listener again
		const handleRepeatClick = async (arg?: boolean | MouseEvent) => {
			const isIncorrectReplay = typeof arg === 'boolean' ? arg : false;
			// If invoked as an event listener, arg will be a MouseEvent.
			// In that case, we consider incorrectTraining to be false.
			data.incorrectResponse = isIncorrectReplay;

			if (data.incorrectResponse) {
				data.procedure[currentSlide].repeatIncorrect += 1;
				console.log(
					`%cRepeat ${currentSlide}. Reason: Incorrect response with feedback for the ${data.procedure[currentSlide].repeatIncorrect}x time.`,
					'background-color: #1798AE ; color: #ffffff ; font-weight: bold ; padding: 4px ; border-radius: 5px;',
				);
			} else {
				data.procedure[currentSlide].repeatOnClick += 1;
				data.clickedRepeat = true;
				console.log(
					`%cRepeat ${currentSlide}. Reason: Clicked repeat for the ${data.procedure[currentSlide].repeatOnClick}x time.`,
					'background-color: #1798AE ; color: #ffffff ; font-weight: bold ; padding: 4px ; border-radius: 5px;',
				);
			}

			// Hide previous slide to avoid short flickering of old slide
			const slideElement = document.getElementById(previousSlideKc);
			if (slideElement) {
				slideElement.style.display = 'none';
			}

			// Run the slide behavior again
			// data.clickedRepeat = true;
			await runSlideBehavior();
			if (
				isIncorrectReplay &&
				data.procedure[data.currentSlide].trainingTrial
			) {
				// If correct response, play correct audio and move on to next trial
				if (data.procedure[data.currentSlide].score === 1) {
					//await data.sprite.playPromise(`${currentSlideKc}-correct`);
				}
				// If incorrect response, reset score, play incorrect audio and repeat trial
				else if (data.procedure[data.currentSlide].score === 0) {
					//data.procedure[data.currentSlide].score = null;
					//data.procedure[data.currentSlide].response = null;
					//await data.sprite.playPromise(`${currentSlideKc}-incorrect`);
					await handleRepeatClick(true);
				}
			}

			// Reset flags for next use
			if (data.incorrectResponse) {
				data.incorrectResponse = false;
			} else {
				data.clickedRepeat = false;
			}
		};

		// Add event listener to repeat element
		if (repeatSvg) {
			repeatSvg.addEventListener('click', handleRepeatClick);
		}

		// Run the slide behavior for the first time
		// only after this first run, the repeat button will be clickable
		await runSlideBehavior();

		// For training trials, we need to check the response. Repeat trial if incorrect.
		if (data.procedure[data.currentSlide].trainingTrial) {
			// If correct response, play correct audio and move on to next trial
			if (data.procedure[data.currentSlide].score === 1) {
				//await data.sprite.playPromise(`${currentSlideKc}-correct`);
			}
			// If incorrect response, reset score, play incorrect audio and repeat trial
			else if (data.procedure[data.currentSlide].score === 0) {
				//data.procedure[data.currentSlide].score = null;
				//data.procedure[data.currentSlide].response = null;
				//await data.sprite.playPromise(`${currentSlideKc}-incorrect`);
				await handleRepeatClick(true);
			}
		}

		// Remove the event listener
		repeatSvg.removeEventListener('click', handleRepeatClick);

		// ----------------------------------------------------------------------------

		// POST LOOP Actions (i.e., either an await button was clicked or video ended)
		// save duration of each slide
		data.procedure[currentSlide].trialDuration =
			new Date().getTime() - startTime;

		if (slide !== 'sEnd') {
			if (responseButtons.length > 0) {
				await gsap.timeline().to(responseButtons, {
					autoAlpha: 0,
					onComplete: () => {
						// remove nodes from DOM since GSAP could have been used to animate them forever
						responseButtons.forEach((e) => e.remove());
					},
				});
			}

			// Keep the intro->next transition snappy; use default gap for all other slides.
			const gapDuration =
				currentSlide === 'sIntroduction' ? 0 : config.globals.slideGapDuration;
			if (gapDuration > 0) {
				await sleep(gapDuration);
			}

			// always hide div wrapper of text/audio feedback
			const responseWrapper = document.querySelectorAll(
				'div [id^=wrapper-s]',
			) as NodeListOf<HTMLDivElement>;
			responseWrapper.forEach((e) => {
				e.style.display = 'none';
			});

			// stop any audio/video playback if it is still playing anything
			stop();
		}
	}

	// save general variables for response log
	data.t1 = new Date();
	data.startTime = `${data.t0.getFullYear()}-${String(data.t0.getMonth() + 1).padStart(2, '0')}-${String(data.t0.getDate()).padStart(2, '0')}_${String(data.t0.getHours()).padStart(2, '0')}:${String(data.t0.getMinutes()).padStart(2, '0')}:${String(data.t0.getSeconds()).padStart(2, '0')}`;
	data.endTime = `${data.t1.getFullYear()}-${String(data.t1.getMonth() + 1).padStart(2, '0')}-${String(data.t1.getDate()).padStart(2, '0')}_${String(data.t1.getHours()).padStart(2, '0')}:${String(data.t1.getMinutes()).padStart(2, '0')}:${String(data.t1.getSeconds()).padStart(2, '0')}`;

	const completionTimeMs = data.t1.getTime() - data.t0.getTime();
	const minutes = millisToMinutesAndSeconds(completionTimeMs).minutes;
	const seconds = millisToMinutesAndSeconds(completionTimeMs).seconds;
	data.completionTime = `${minutes}-${seconds}`;

	const datatransfer = data.datatransfer;
	// get rid of unnecessary variables for researchers' response log
	[
		'currentProcedure',
		'currentSlide',
		'datatransfer',
		'nextSlide',
		'previousSlide',
		'slideCounter',
		'simpleSlideCounter',
		't0',
		't1',
		'totalSlides',
		'videoExtension',
		'hasWebcam',
		'safari',
		'isIOS',
		'iOSSafari',
		'sprite',
		'spriteJSON',
		'clickedRepeat',
		'incorrectResponse',
		'emoji',
	].forEach((key) => {
		if (key in data) {
			delete data[key];
		}
	});
	// const parentBlockLast = document.getElementById(
	// 	's-blocking-state',
	// ) as SvgInHtml;
	// parentBlockLast.removeAttribute('visibility');

	// gsap.set('#link-leuphana-cube', {
	// 	transformOrigin: '50% 50%',
	// });
	// gsap.to('#link-leuphana-cube', {
	// 	id: 'blocking-state-animation-last',
	// 	duration: 3,
	// 	rotation: 360,
	// 	repeat: -1,
	// 	ease: 'none',
	// });

	if (data.webcam == true) {
		try {
			await stopRecording({ stopStream: true });
		} catch (e) {
			console.warn('Failed to stop recording, continuing anyway:', e);
		}
	}
	await addSpinner();
	try {
		// Save data depending on choice (local, server, both)
		if (datatransfer === 'local') {
			await downloadCsv();
			await downloadWebcamVideo(data.webcam, data.id);
		} else if (datatransfer === 'server') {
			await uploadCsv();
			await sleep(1000);
			await uploadWebcamVideo(data.webcam, data.id);
			await sleep(2000);
		} else {
			await uploadCsv();
			await sleep(1000);
			await uploadWebcamVideo(data.webcam, data.id);
			await sleep(1000);
			await downloadCsv();
			await sleep(1000);
			await downloadWebcamVideo(data.webcam, data.id);
			await sleep(1000);
		}
	} finally {
		await hideSpinner();
	}

	// users can leave page now
	window.onbeforeunload = null;

	// const blockingStateAnimationLast = gsap.getById(
	// 	'blocking-state-animation-last',
	// );
	// if (blockingStateAnimationLast) blockingStateAnimationLast.kill();
	// parentBlockLast.setAttribute('visibility', 'hidden');

	console.group(
		'%cStudy Summary',
		'background-color: #1798AE ; color: #ffffff ; font-weight: bold ; padding: 4px ; border-radius: 5px;',
	);
	console.log(`The study took ${minutes} minutes and ${seconds} seconds.`);
	console.log('Here is what we stored:');
	console.log(data);
	console.groupEnd();
	console.log('Procedure loop done');
};
