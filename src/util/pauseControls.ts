import { gsap } from 'gsap';
import Toastify from 'toastify-js';
import type { SvgInHtml } from '../types';
import { pauseStatusTranslations, translations } from '../translations';
import { stop } from './audio';
import {
	getLastRecordingBlob,
	isRecordingActive,
	stopRecording,
} from './mediaRecorderServices';
import { persistStudyData } from './persistStudyData';
import { resumeStudyRecordingIfEnabled } from './studyRecording';

let pauseFlowPromise: Promise<void> | null = null;
let activeSlidePrefix: string | null = null;

const getSvgPauseButton = (slidePrefix = activeSlidePrefix) =>
	(slidePrefix
		? document.getElementById(`link-${slidePrefix}-pause`)
		: null) as SvgInHtml | null;

const getSvgNextButton = (slidePrefix = activeSlidePrefix) =>
	(slidePrefix
		? document.getElementById(`link-${slidePrefix}-next`)
		: null) as SvgInHtml | null;

const getPauseTextNodes = (slidePrefix = activeSlidePrefix) =>
	slidePrefix
		? (document.querySelectorAll(
				`#${slidePrefix} [id^="text-pause"]`
			) as NodeListOf<SVGForeignObjectElement>)
		: null;

const setSvgButtonVisibility = (
	element: SvgInHtml | null,
	isVisible: boolean
) => {
	if (!element) return;

	gsap.set(element, {
		autoAlpha: isVisible ? 1 : 0,
		pointerEvents: isVisible ? 'visible' : 'none',
		cursor: isVisible ? 'pointer' : 'default',
	});
};

const hideNextButton = (slidePrefix = activeSlidePrefix) => {
	setSvgButtonVisibility(getSvgNextButton(slidePrefix), false);
};

const showNextButton = (slidePrefix = activeSlidePrefix) => {
	setSvgButtonVisibility(getSvgNextButton(slidePrefix), true);
};

const getPauseMessage = (key: 'pause' | 'pauseSaving') => {
	const communityKey =
		data.community as keyof typeof translations.pause;
	const translationGroup =
		key === 'pause' ? translations.pause : pauseStatusTranslations.pauseSaving;

	return translationGroup[communityKey] ?? translationGroup.english;
};

const setPauseTextVisibility = (
	isVisible: boolean,
	slidePrefix = activeSlidePrefix
) => {
	const pauseTextNodes = getPauseTextNodes(slidePrefix);
	if (!pauseTextNodes) return;

	gsap.set(pauseTextNodes, {
		autoAlpha: isVisible ? 1 : 0,
	});
};

const setPausePlaceholderText = (translationKey: 'pause' | 'pauseSaving') => {
	if (!activeSlidePrefix) return;

	const pauseTextNodes = getPauseTextNodes(activeSlidePrefix);
	if (!pauseTextNodes) return;
	const message = getPauseMessage(translationKey);

	pauseTextNodes.forEach((node) => {
		node.innerHTML = message;
	});
};

const waitForNext = () =>
	new Promise<void>((resolve) => {
		const svgNextButton = getSvgNextButton();
		if (!svgNextButton) {
			resolve();
			return;
		}

		const handleNext = () => {
			svgNextButton.removeEventListener('pointerup', handleNext);
			svgNextButton.removeEventListener('click', handleNext);
			resolve();
		};

		svgNextButton.addEventListener('pointerup', handleNext);
		svgNextButton.addEventListener('click', handleNext);
	});

export const setPauseControlContext = (slidePrefix: string | null) => {
	const previousSlidePrefix = activeSlidePrefix;
	if (previousSlidePrefix) {
		setSvgButtonVisibility(getSvgPauseButton(previousSlidePrefix), false);
		setPauseTextVisibility(false, previousSlidePrefix);
		const previousResumeButton = document.getElementById(
			`link-${previousSlidePrefix}-resume`
		) as SvgInHtml | null;
		setSvgButtonVisibility(previousResumeButton, false);
	}

	activeSlidePrefix = slidePrefix;
	if (slidePrefix) {
		setSvgButtonVisibility(getSvgPauseButton(slidePrefix), false);
		setPauseTextVisibility(false, slidePrefix);
		const resumeButton = document.getElementById(
			`link-${slidePrefix}-resume`
		) as SvgInHtml | null;
		setSvgButtonVisibility(resumeButton, false);
	}
};

export const showPauseButton = () => {
	if (data.currentSlide === 'sEnd' || pauseFlowPromise) return;
	setSvgButtonVisibility(getSvgPauseButton(), true);
};

export const getActivePauseButton = () => getSvgPauseButton();

export const hidePauseButton = () => {
	setSvgButtonVisibility(getSvgPauseButton(), false);
};

export const isPauseResponse = (element: Element | null) =>
	element?.id.endsWith('-pause') === true;

export const runPauseFlow = async () => {
	if (pauseFlowPromise) return pauseFlowPromise;

	pauseFlowPromise = (async () => {
		hidePauseButton();
		hideNextButton();
		stop();
		setPausePlaceholderText('pauseSaving');
		setPauseTextVisibility(true);

		const pauseIndex = (data.pauseCount ?? 0) + 1;
		data.pauseCount = pauseIndex;

		const hadActiveRecording = isRecordingActive();
		let hasRecordedVideo = false;

		if (hadActiveRecording) {
			try {
				const recordedBlob = await stopRecording({ stopStream: true });
				hasRecordedVideo = Boolean(recordedBlob ?? getLastRecordingBlob());
				data.webcamRecordingReady = false;
			} catch (error) {
				console.warn('Failed to stop recording during pause:', error);
			}
		}

		try {
			await persistStudyData({
				videoId: `${data.id}`,
				hasRecordedVideo,
				saveCsv: false,
				saveVideo: true,
			});
		} catch (error) {
			console.warn('Pause save failed, continuing to resume state.', error);
			Toastify({
				text: 'Saving during pause failed. You can still resume the study.',
				duration: 4500,
				className: 'toast-error',
			}).showToast();
		}

		setPausePlaceholderText('pause');
		showNextButton();
		await waitForNext();
		hideNextButton();
		setPauseTextVisibility(false);
		await resumeStudyRecordingIfEnabled();
	})().finally(() => {
		pauseFlowPromise = null;
	});

	return pauseFlowPromise;
};
