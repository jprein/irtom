import Toastify from 'toastify-js';
import { buttonTranslations } from '../translations';
import {
	initMedia,
	isMediaRecorderSupported,
	startRecording,
} from './mediaRecorderServices';

export const STUDY_RECORDING_CONSTRAINTS: MediaStreamConstraints = {
	// Audio is on so the recording captures trial sound and the
	// child/participant's speech alongside the video. Keep the mic
	// constraints minimal (no AGC/echo-cancel/noise-suppress DSP, mono,
	// low sample rate) to limit the extra CPU/battery load on iPad; if a
	// device has no mic access, initMedia() already falls back to
	// video-only recording.
	audio: {
		echoCancellation: false,
		noiseSuppression: false,
		autoGainControl: false,
		channelCount: 1,
		sampleRate: 16000,
	},
	video: {
		frameRate: { min: 1, ideal: 3, max: 5 },
		width: { min: 320, ideal: 320, max: 320 },
		height: { min: 240, ideal: 240, max: 240 },
		facingMode: 'user',
	},
};

export const startStudyRecordingIfEnabled = async () => {
	if (!data.hasWebcam || !data.webcam) {
		data.webcamRecordingReady = false;
		return false;
	}

	if (!isMediaRecorderSupported()) {
		console.log('MediaRecorder is not supported in this browser.');
		data.webcamRecordingReady = false;
		return false;
	}

	try {
		console.log('Requesting camera/microphone...');
		await initMedia(STUDY_RECORDING_CONSTRAINTS);
		console.log('Camera ready. You can start recording.');
		startRecording();
		console.log('Recording started.');
		data.webcamRecordingReady = true;
		return true;
	} catch (error) {
		data.webcamRecordingReady = false;
		console.error('Failed to access camera/microphone:', error);
		return false;
	}
};

export const resumeStudyRecordingIfEnabled = async () => {
	if (!data.webcam || !data.hasWebcam) return false;

	const didResume = await startStudyRecordingIfEnabled();
	if (!didResume) {
		const communityKey =
			data.community as keyof typeof buttonTranslations.webcamRecordingResumeFailed;
		Toastify({
			text:
				buttonTranslations.webcamRecordingResumeFailed[communityKey] ??
				buttonTranslations.webcamRecordingResumeFailed.english,
			duration: 4500,
			className: 'toast-error',
		}).showToast();
	}

	return didResume;
};
