import Toastify from 'toastify-js';
import {
	initMedia,
	isMediaRecorderSupported,
	startRecording,
} from './mediaRecorderServices';

export const STUDY_RECORDING_CONSTRAINTS: MediaStreamConstraints = {
	// Video-only recording keeps CPU usage lower on iPad and avoids
	// microphone-related audio-session side effects in mobile browsers.
	audio: false,
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
		Toastify({
			text: 'Webcam recording could not be restarted. The study will continue without video.',
			duration: 4500,
			className: 'toast-error',
		}).showToast();
	}

	return didResume;
};
