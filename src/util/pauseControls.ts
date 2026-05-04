import { gsap } from 'gsap';
import Toastify from 'toastify-js';
import type { SvgInHtml } from '../types';
import { pauseStatusTranslations, translations } from '../translations';
import {
	getLastRecordingBlob,
	isRecordingActive,
	stopRecording,
} from './mediaRecorderServices';
import { persistStudyData } from './persistStudyData';
import { resumeStudyRecordingIfEnabled } from './studyRecording';

let pauseFlowPromise: Promise<void> | null = null;
const activeSlidePrefix: string | null = null;

const getSvgPauseButton = () =>
	document.getElementById(`link-pause`) as SvgInHtml | null;

const getSvgNextButton = () =>
	document.getElementById(`link-next`) as SvgInHtml | null;

const getPauseTextNodes = () =>
	document.querySelectorAll(`[id^="text-pause"]`
			) as NodeListOf<SVGForeignObjectElement>

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

export const hideNextButton = () => {
	setSvgButtonVisibility(getSvgNextButton(), false);
};

export const showNextButton = () => {
	setSvgButtonVisibility(getSvgNextButton(), true);
};

const getPauseMessage = (key: 'pause' | 'pauseSaving') => {
	const communityKey = data.community as keyof typeof translations.pause;
	const translationGroup =
		key === 'pause' ? translations.pause : pauseStatusTranslations.pauseSaving;

	return translationGroup[communityKey] ?? translationGroup.english;
};

const setPauseTextVisibility = (
	isVisible: boolean
) => {
	const pauseTextNodes = getPauseTextNodes();
	if (!pauseTextNodes) return;

	gsap.set(pauseTextNodes, {
		autoAlpha: isVisible ? 1 : 0,
	});
};

const setPausePlaceholderText = (translationKey: 'pause' | 'pauseSaving') => {
	if (!activeSlidePrefix) return;

	const pauseTextNodes = getPauseTextNodes();
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

export const setPauseControlContext = () => {
	// const previousSlidePrefix = activeSlidePrefix;
	// if (previousSlidePrefix) {
	// 	setSvgButtonVisibility(getSvgPauseButton(), false);
	// 	setPauseTextVisibility(false);
	// 	const previousResumeButton = document.getElementById(
	// 		`link-${previousSlidePrefix}-resume`
	// 	) as SvgInHtml | null;
	// 	setSvgButtonVisibility(previousResumeButton, false);
	// }

	// activeSlidePrefix = slidePrefix;
	//if () {
		setSvgButtonVisibility(getSvgPauseButton(), false);
		setPauseTextVisibility(false);
		// const resumeButton = document.getElementById(
		// 	`link-resume`
		// ) as SvgInHtml | null;
		// setSvgButtonVisibility(resumeButton, false);
	//}
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
		data.sprite?.stop();
		setPausePlaceholderText('pauseSaving');
		setPauseTextVisibility(true);

		data.breaks = (data.breaks ?? 0) + 1;

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
