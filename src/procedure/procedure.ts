import _ from 'lodash';
import { gsap } from 'gsap';
import config from '../config.yaml';
import { stop } from '../util/audio';
import {
	downloadData,
	millisToMinutesAndSeconds,
	sleep,
	uploadData,
} from '../util/helpers';

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
				(e: string) => _.isPlainObject(e)
			);

			// if nested object is nested again, get nested key(s)
			if (isNestedAgain) {
				// shuffle nested keys in procedure
				currentProcedure[ni][nkey] = _.shuffle(currentProcedure[ni][nkey]);

				// get new nested key order
				const nnkeys = currentProcedure[ni][nkey].map(
					(e: string[]) => Object.keys(e)[0]
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

	data.animalSlideCounter = 0;

	currentProcedure = currentProcedure.map((e: string) => _.camelCase(e));
	data.currentProcedure = currentProcedure;
	console.log("Procedure for this community:");
	console.table(currentProcedure);

	data.totalSlides = currentProcedure.length;

	// pinda video wrapper
	const pinda = document.getElementById('pinda') as HTMLVideoElement;
	const pindaNeutral = document.getElementById(
		'pinda-neutral'
	) as HTMLVideoElement;

	// ================================================
	// PROCEDURE LOOP
	// ================================================
	for (const [index, slide] of currentProcedure.entries()) {
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
			duration: 0,
			response: '',
		};

		// get possible response buttons (next buttons, yes/no buttons)
		const responseButtons = document.querySelectorAll(
			`#${currentSlideKc} [id^=link][id$=next], #${currentSlideKc} [id^=link][id$=yes], #${currentSlideKc} [id^=link][id$=no]`
		);

		// start time tracking
		const startTime = new Date().getTime();

		// ----------------------------------------------------------------------------
		// ACTUAL LOOP
		// camelCased in procedure directory (e.g., sIntroduction.ts)
		// kebab-cased arguments, as required by Illustrator slide IDs
		await (
			await import(`./${currentSlide}`)
		).default({ currentSlide: currentSlideKc, previousSlide: previousSlideKc });
		// ----------------------------------------------------------------------------

		// POST LOOP Actions (i.e., either an await button was clicked or video ended)
		// save duration of each slide
		data.procedure[currentSlide].duration = new Date().getTime() - startTime;

		if (slide !== 'sEnd') {
			// always hide all pinda video videos
			gsap.to([pinda, pindaNeutral], { autoAlpha: 0 });

			// always hide response buttons (next, yes, no) for nicer UX
			if (responseButtons.length > 0) {
				await gsap.timeline().to(responseButtons, {
					autoAlpha: 0,
					onComplete: () => {
						// remove nodes from DOM since GSAP could have been used to animate them forever
						responseButtons.forEach((e) => e.remove());
					},
				});
			}

			// apply default gap duration
			await sleep(config.globals.slideGapDuration);

			// always hide div wrapper of text/audio feedback
			const responseWrapper = document.querySelectorAll(
				'div [id^=wrapper-s]'
			) as NodeListOf<HTMLDivElement>;
			responseWrapper.forEach((e) => {
				e.style.display = 'none';
			});

			// stop any audio/video playback if it is still playing anything
			stop();
		}
	}
	data.endingTimestamp = new Date();
	data.completionTimeMS =
		data.endingTimestamp.getTime() - data.initialTimestamp.getTime();
	const minutes = millisToMinutesAndSeconds(data.completionTimeMS).minutes;
	const seconds = millisToMinutesAndSeconds(data.completionTimeMS).seconds;
	data.completionTimeM = `${minutes}-${seconds}`;

	const datatransfer = data.datatransfer;
	// get rid of unnecessary variables for researchers' response log
	['animalOrder', 'animalSlideCounter', 'currentProcedure', 'currentSlide', 'datatransfer', 'nextSlide', 'previousSlide', 'slideCounter', 'totalSlides', 'videoExtension'].forEach((key) => {
		if (key in data) {
			delete data[key];
		}
	});

	// upload data to server
	if (datatransfer === 'both') {
		uploadData();
		downloadData();
	}
	if (datatransfer === 'server') {
		uploadData();
	}

	// users can leave page now
	window.onbeforeunload = null;

	console.group(
		'%cStudy Summary',
		'background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;'
	);
	console.log(`The study took ${minutes} minutes and ${seconds} seconds.`);
	console.log('Here is what we stored:');
	console.log(data);
	console.groupEnd();

	console.log('Procedure loop done');
};
