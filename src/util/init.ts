import { gsap } from 'gsap';
import _ from 'lodash';
import type { SvgInHtml } from '../types';
//import svgPath from '../../public/assets/experiment-voxified.svg?raw';
import svgPath from '../../public/assets/experiment-voxified.svg?raw';
import config from '../config.yaml';
import { rectToForeignObject } from './rectToForeignObject';
import { recycleObjects } from './recycleObjects';
import { copyAttributes } from './copyAttributes';
import {
	downloadCsv,
	downloadWebcamVideo,
	isTouchDevice,
	uploadCsv,
	uploadWebcamVideo,
} from './helpers';
import { widowedKeyChecker } from './widowedKeyChecker';
import {
	showSingleSlide,
	swapSlides,
	hideFirstChildSlides,
	hideAllChildSlides,
	getChildrenFromParent,
	removeDisplayNone,
} from './slideVisibility';
import { translations } from '../translations';
import { setMousePointer, setScaleOnHover } from './styleDefaults';
import Toastify from 'toastify-js';
import DetectRTC from 'detectrtc';
import 'toastify-js/src/toastify.css';
import { createSprite } from './createSprite';
import {
	initMedia,
	isMediaRecorderSupported,
	startRecording,
} from './mediaRecorderServices';

export const init = async () => {
	// get study choices from local storage
	const storedChoices = localStorage.getItem('storedChoices');
	let studyChoices;

	// If we find data in local storage, set studyChoices to that data
	if (storedChoices) {
		studyChoices = JSON.parse(storedChoices);
	} else {
		console.log(
			'No data found in local storage. Creating a studyChoices object.',
		);
	}

	// Define default values for all required keys
	const defaultValues = {
		id: 'testID',
		community: 'german',
		webcam: 'false',
		datatransfer: 'local',
	};

	// Check if studyChoices contains all required keys.
	// If not, set defaults for missing keys
	if (studyChoices) {
		Object.keys(defaultValues).forEach((key) => {
			if (!Object.prototype.hasOwnProperty.call(studyChoices, key)) {
				studyChoices[key] = defaultValues[key];
				console.log(
					`Key "${key}" was missing. Set default value: "${defaultValues[key]}"`,
				);
			}
		});
	} else {
		console.log(
			'Setting the studyChoices object to default values:',
			JSON.stringify(defaultValues),
		);
		// Create a new object with default values
		studyChoices = { ...defaultValues };
	}

	const wrapper = document.getElementById('wrapper')! as HTMLDivElement;
	// load initial SVG file
	wrapper.innerHTML = svgPath;
	// get main svg element
	const svg = document.querySelector('svg')! as SvgInHtml;

	// check if svg is voxified
	if (!svg.hasAttribute('voxified')) {
		Toastify({
			escapeMarkup: false,
			text:
				'⚠️ <strong><code>voxified</code> attribute not found!</strong><br>' +
				'<small>You shoud run <code>npm run voxify</code></small>',
			duration: 0,
			// destination: 'https://github.com/apvarun/toastify-js',
			// newWindow: true,
			// close: true,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			className: 'toast-error',
			// style: {
			// 	background:
			// 		'linear-gradient(to bottom, hsl(335deg 86% 46%) 0%, hsl(347deg 90% 42%) 50%, hsl(347deg 90% 42%) 50%)',
			// },
			// onClick: function () {}, // Callback after click
		}).showToast();
	}

	// parse SVG DOM for all child nodes from #svg group
	const svgChilds: Record<string, SVGImageElement | SVGGElement | Element> = {};
	document.querySelectorAll('svg [id]').forEach((e) => {
		svgChilds[e.id] = e;
	});

	// check if display="none" elements exist in DOM)
	if (document.querySelectorAll('[display="none"]').length > 0) {
		console.warn(
			'Found elements with \'display="none"\' attribute. Make sure all objects are visible when exporting the SVG.',
			'Use removeDisplayNone(); to bypass this temporarily. Details:',
		);
		console.warn(document.querySelectorAll('[display="none"]'));
		removeDisplayNone();
	}

	// transform all rect nodes to foreignObject nodes
	rectToForeignObject();

	// transform all rect nodes to foreignObject nodes
	recycleObjects();
	// initialzie global data object (see custom.d.ts)
	const global = globalThis as any;
	global.data = {
		id: studyChoices.id,
		community: studyChoices.community,
		datatransfer: studyChoices.datatransfer,
		webcam: studyChoices.webcam == 'true' ? true : false,
		touchscreen: isTouchDevice(),
		t0: new Date(),
		slideCounter: 0,
		procedure: {},
		hasWebcam: DetectRTC.hasWebcam,
		browserName: DetectRTC.browser.name,
		clickedRepeat: false,
		incorrectResponse: false,
		emoji: 'yellow',
	};
	//log user testing setup
	DetectRTC.load(async () => {
		global.data.hasWebcam = DetectRTC.hasWebcam;
		global.data.browserName = DetectRTC.browser.name;
		global.data.safari = DetectRTC.browser.isSafari == undefined ? false : true;
		global.data.iOSSafari = global.data.safari && global.data.touchscreen;

		// Enable webcam recording if selected in URL parameters
		if (global.data.hasWebcam && global.data.webcam && !global.data.iOSSafari) {
			// !responseLog.meta.iOSSafari &&
			if (!isMediaRecorderSupported()) {
				console.log('MediaRecorder is not supported in this browser.');
			} else {
				try {
					console.log('Requesting camera/microphone...');
					await initMedia({
						audio: true,
						video: {
							frameRate: { min: 1, ideal: 5, max: 10 },
							width: { min: 640, ideal: 640, max: 640 }, // keep it small
							height: { min: 480, ideal: 480, max: 480 },
							facingMode: 'user',
						},
					});
					console.log('Camera ready. You can start recording.');

					startRecording();
					console.log('Recording started.');
				} catch (error) {
					console.error('Failed to access camera/microphone:', error);
				}
			}
		}
	});

	// check if all translation keys have a matching foreignObject and vice versa
	const textKeys = widowedKeyChecker();

	const translation = _.zipObject(
		Object.keys(translations),
		Object.values(translations).map((e) => e[data.community]),
	);

	// iterate over all text keys and add text into foreign objects
	textKeys.forEach((e) => {
		const foNodes = document.querySelectorAll(`[id^="text-${e}"]`);
		foNodes.forEach((foNode) => {
			foNode.innerHTML = translation[e as keyof typeof translation];
		});
	});

	// hide all group slides
	hideFirstChildSlides();

	// apply initial SVG settings and style
	svg.style.backgroundColor = config.svgBg;
	document.body.style.backgroundColor = config.htmlBg;

	// set cursor pointer for all elements defined in config
	setMousePointer();
	setScaleOnHover();

	if (config.devmode.on) {
		Toastify({
			escapeMarkup: false,
			text: `⚙️ <strong>DEVMODE ON</strong>`,
			duration: 0,
			// destination: 'https://github.com/apvarun/toastify-js',
			// newWindow: true,
			// close: true,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			className: 'toast-error',
			// style: {
			// 	background:
			// 		'linear-gradient(to bottom, hsl(335deg 86% 46%) 0%, hsl(347deg 90% 42%) 50%, hsl(347deg 90% 42%) 50%)',
			// },
			// onClick: function () {}, // Callback after click
		}).showToast();
	}

	// show warning when user tries to leave the page
	if (!config.devmode.on) {
		window.onbeforeunload = function (evt: BeforeUnloadEvent) {
			evt.preventDefault();
			uploadCsv();
			return '';
		};
	}

	// blocking state slide
	const parentBlock = document.getElementById('s-blocking-state') as SvgInHtml;
	parentBlock.removeAttribute('visibility');

	gsap.set('#link-leuphana-cube', {
		transformOrigin: '50% 50%',
	});
	gsap.to('#link-leuphana-cube', {
		id: 'blocking-state-animation',
		duration: 3,
		rotation: 360,
		repeat: -1,
		ease: 'none',
	});

	// initialize audio sprite instance
	// first, get the audio sprite JSON file
	const spriteLookup = await fetch(
		`./communities/${data.community}/combined.json`,
	);

	data.spriteJSON = await spriteLookup.json();

	// then,create the sprite instance
	data.sprite = await createSprite(data.spriteJSON);

	if (config.devmode.on) {
		global.translations = translations;
		global.showSingleSlide = showSingleSlide;
		global.swapSlides = swapSlides;
		global.hideFirstChildSlides = hideFirstChildSlides;
		global.hideAllChildSlides = hideAllChildSlides;
		global.getChildrenFromParent = getChildrenFromParent;
		global.removeDisplayNone = removeDisplayNone;
		global.svgChilds = svgChilds;
		global.recycleObjects = recycleObjects;
		global.copyAttributes = copyAttributes;
	}
	// always expose download/upload functions
	global.downloadCsv = downloadCsv;
	global.downloadWebcamVideo = downloadWebcamVideo;
	global.uploadCsv = uploadCsv;
	global.uploadWebcamVideo = uploadWebcamVideo;
	global.config = config;

	if (config.devmode.on) {
		console.group(
			'%cData object',
			'background-color: #1798AE ; color: #ffffff ; font-weight: bold ; padding: 4px ; border-radius: 5px;',
		);
		console.log(data);
		console.groupEnd();
	}

	// in config.procedure, all communities are listed
	// we filter all communities that are not our current community
	const otherCommunities = Object.keys(config.procedure).filter(
		(community) => community !== data.community,
	);

	// for all other communities, we hide the community-specific SVG elements
	const selectors = otherCommunities
		.map((community) => `[id*="${community}"]`)
		.join(', ');

	document.querySelectorAll(selectors).forEach((element) => {
		element.setAttribute('visibility', 'hidden');
	});

	// set default GSAP easing to 'none' for all animations
	gsap.defaults({ ease: 'none' });
};
