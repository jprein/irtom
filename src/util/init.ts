import { gsap, selector } from 'gsap';
import _ from 'lodash';
import type { SvgInHtml } from '../types';
import svgPath from '../assets/experiment-voxified.svg';
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
import { getUrlParameters } from './getUrlParameters';
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
import * as mrec from '@ccp-eva/media-recorder';
import { createSprite } from './createSprite';

export const init = async () => {
	const urlParameters = getUrlParameters();

	// calculate agegroup based on birthday
	const birthdayMs = Date.parse(urlParameters.birthday);
	const ageDiffMs = Date.now() - birthdayMs;
	const ageInYears = new Date(ageDiffMs).getUTCFullYear() - 1970;
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
		id: urlParameters.id,
		community: urlParameters.community,
		birthday: urlParameters.birthday,
		age: ageInYears,
		agegroup: ageInYears < config.globals.adultThresholdAge ? 'child' : 'adult',
		gender: urlParameters.gender,
		datatransfer: urlParameters.datatransfer,
		webcam: urlParameters.webcam === 'true', // convert to boolean
		touchscreen: isTouchDevice(),
		t0: new Date(),
		slideCounter: 0,
		quitBeforeEnd: false,
		procedure: {},
		hasWebcam: DetectRTC.hasWebcam,
		browserName: DetectRTC.browser.name,
		clickedRepeat: false,
		incorrectResponse: false,
		emoji: 'yellow',
	};
	//log user testing setup
	DetectRTC.load(() => {
		global.data.hasWebcam = DetectRTC.hasWebcam;
		global.data.browserName = DetectRTC.browser.name;
		global.data.safari = DetectRTC.browser.isSafari == undefined ? false : true;
		global.data.iOSSafari = global.data.safari && global.data.touchscreen;
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
			global.data.quitBeforeEnd = true;
			uploadCsv();
			return '';
		};
	}

	// const pinda = document.getElementById('pinda') as HTMLVideoElement;
	// const audio = document.getElementById('audio') as HTMLAudioElement;

	// // set pinda global styles
	// pinda.style.position = 'absolute';
	// pinda.style.height = config.css.pinda.height;
	// pinda.style.left = config.css.pinda.left;
	// pinda.style.bottom = config.css.pinda.bottom;

	// if (config.devmode.on) {
	// 	audio.addEventListener('play', () => {
	// 		audio.playbackRate = config.devmode.playbackRate;
	// 	});
	// }
	// pinda.addEventListener('play', (e: Event) => {
	// 	// if (config.devmode.on) {
	// 	// 	console.log((e.target as HTMLVideoElement).src);
	// 	// }
	// 	gsap.set(pinda, { autoAlpha: 0 });
	// 	gsap.to(pinda, { autoAlpha: 1 });
	// 	if (config.devmode.on) {
	// 		pinda.playbackRate = config.devmode.playbackRate;
	// 	}
	// });

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

	// Enable webcam recording if selected in URL parameters
	if (data.webcam) {
		mrec.startRecorder({
			audio: true,
			video: {
				frameRate: {
					min: 3,
					ideal: 5,
					max: 30,
				},
				width: {
					min: 160,
					ideal: 320,
					max: 640,
				},
				height: {
					min: 120,
					ideal: 240,
					max: 480,
				},
				facingMode: 'user',
			},
		});
	}

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
