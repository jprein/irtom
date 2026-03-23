import './css/app.css';
import './css/style.css';
import { procedure } from './procedure/procedure';
import { init } from './util/init';
import { createSprite } from './util/createSprite';
import { preloadCommunityImages } from './util/preloadImages';
import { buttonTranslations } from './translations';
import config from './config.yaml';
import Toastify from 'toastify-js';
import { startFullscreen } from './util/helpers';

const AUDIO_INIT_TIMEOUT_MS = 20_000;
const PREVIEW_STREAM_CONSTRAINTS: MediaStreamConstraints = {
	audio: false,
	video: {
		frameRate: {
			min: 1,
			ideal: 5,
			max: 10,
		},
		width: {
			min: 640,
			ideal: 640,
			max: 640,
		},
		height: {
			min: 480,
			ideal: 480,
			max: 480,
		},
		facingMode: 'user',
	},
};

const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs: number,
	label: string
): Promise<T> => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			promise,
			new Promise<T>((_, reject) => {
				timeoutId = setTimeout(
					() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
					timeoutMs
				);
			}),
		]);
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
};

(async () => {
	const syncStudyChoicesFromUrl = () => {
		const params = new URLSearchParams(window.location.search);
		const keys = ['id', 'community', 'webcam', 'datatransfer'] as const;
		const urlChoices: Partial<Record<(typeof keys)[number], string>> = {};

		const hasAnyStudyChoiceInUrl = keys.some((key) => {
			const value = params.get(key);
			return value !== null && value.trim() !== '';
		});

		if (!hasAnyStudyChoiceInUrl) {
			return urlChoices;
		}

		const storedChoices: Record<string, string> = {};
		const rawStoredChoices = localStorage.getItem('storedChoices');

		if (rawStoredChoices) {
			try {
				const parsed = JSON.parse(rawStoredChoices) as Record<string, unknown>;
				Object.entries(parsed).forEach(([key, value]) => {
					if (typeof value === 'string') {
						storedChoices[key] = value;
					}
				});
			} catch (error) {
				console.warn('Failed to parse storedChoices from localStorage:', error);
			}
		}

		keys.forEach((key) => {
			const value = params.get(key);
			if (value !== null && value.trim() !== '') {
				const trimmedValue = value.trim();
				storedChoices[key] = trimmedValue;
				urlChoices[key] = trimmedValue;
			}
		});

		localStorage.setItem('storedChoices', JSON.stringify(storedChoices));

		// Remove study-choice params from URL after persisting them.
		keys.forEach((key) => {
			params.delete(key);
		});
		const cleanedQuery = params.toString();
		const cleanedUrl = `${window.location.pathname}${
			cleanedQuery ? `?${cleanedQuery}` : ''
		}${window.location.hash}`;
		window.history.replaceState({}, document.title, cleanedUrl);

		return urlChoices;
	};

	// First action on app page: capture study choices from URL into localStorage.
	const urlStudyChoices = syncStudyChoicesFromUrl();

	const webcamModal = document.getElementById(
		'webcam-modal'
	) as HTMLDivElement | null;
	const webcamModalVideo = document.getElementById(
		'webcam-modal-video'
	) as HTMLVideoElement | null;
	const webcamModalClose = document.getElementById(
		'webcam-modal-close'
	) as HTMLButtonElement | null;

	let webcamPreviewStream: MediaStream | null = null;

	const hasWebcamPreviewUrlParam = () => {
		if (urlStudyChoices.webcam) {
			return urlStudyChoices.webcam.toLowerCase() === 'true';
		}

		const webcamParam = new URLSearchParams(window.location.search).get('webcam');
		return webcamParam?.trim().toLowerCase() === 'true';
	};

	const closeWebcamPreviewModal = () => {
		if (webcamModal) {
			webcamModal.classList.add('hidden');
		}

		if (webcamModalVideo) {
			webcamModalVideo.pause();
			webcamModalVideo.srcObject = null;
		}

		if (webcamPreviewStream) {
			webcamPreviewStream.getTracks().forEach((track) => track.stop());
			webcamPreviewStream = null;
		}
	};

	const openWebcamPreviewModal = async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			Toastify({
				text: 'Webcam preview is not supported in this browser.',
				duration: 4500,
				className: 'toast-error',
			}).showToast();
			return;
		}

		try {
			webcamPreviewStream = await navigator.mediaDevices.getUserMedia(
				PREVIEW_STREAM_CONSTRAINTS
			);

			if (webcamModalVideo) {
				webcamModalVideo.srcObject = webcamPreviewStream;
			}

			if (webcamModal) {
				webcamModal.classList.remove('hidden');
			}
		} catch (error) {
			console.error('Failed to open webcam preview:', error);
			Toastify({
				text: 'Webcam preview could not be opened. Please allow camera permission and try again.',
				duration: 4500,
				className: 'toast-error',
			}).showToast();
		}
	};

	webcamModalClose?.addEventListener('click', closeWebcamPreviewModal);
	webcamModal?.addEventListener('click', (event) => {
		if (event.target === webcamModal) {
			closeWebcamPreviewModal();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && webcamModal && !webcamModal.classList.contains('hidden')) {
			closeWebcamPreviewModal();
		}
	});

	window.addEventListener('beforeunload', closeWebcamPreviewModal);

	if (hasWebcamPreviewUrlParam()) {
		void openWebcamPreviewModal();
	}

	await init();

	const button = document.getElementById(
		'audio-start-button'
	) as HTMLButtonElement | null;

	if (
		button &&
		data.community &&
		buttonTranslations.startAudio[
			data.community as keyof typeof buttonTranslations.startAudio
		]
	) {
		button.textContent =
			buttonTranslations.startAudio[
				data.community as keyof typeof buttonTranslations.startAudio
			];
	}

	const waitForAudioStart = async () => {
		const overlay = document.getElementById(
			'audio-start-overlay'
		) as HTMLDivElement | null;
		const button = document.getElementById(
			'audio-start-button'
		) as HTMLButtonElement | null;

		if (!button) {
			throw new Error('Audio start button not found in app.html');
		}

		await new Promise<void>((resolve) => {
			const onStart = async () => {
				const originalLabel = button.textContent ?? 'Klicke hier, um mit der Studie zu beginnen';
				button.disabled = true;
				const preparingLabel =
					buttonTranslations.preparingAudio[
						data.community as keyof typeof buttonTranslations.preparingAudio
					] ?? 'Preparing audio...';
				button.textContent = preparingLabel;

				try {
					if (!config.devmode.on && !data.isIOS) {
						startFullscreen(data.isIOS);
					}

					if (!data.spriteJSON && data.community) {
						const spriteLookup = await fetch(
							`./communities/${data.community}/combined.json`
						);
						data.spriteJSON = await spriteLookup.json();
					}

					if (!data.spriteJSON) {
						throw new Error('Sprite JSON unavailable.');
					}

					data.sprite = await withTimeout(
						createSprite(data.spriteJSON),
						AUDIO_INIT_TIMEOUT_MS,
						'Audio sprite initialization'
					);

					if (!data.sprite || typeof data.sprite.playPromise !== 'function') {
						throw new Error('Sprite initialization failed.');
					}

					if (!data.community) {
						throw new Error('Community is required before image preloading.');
					}

					const loadingLabel =
						buttonTranslations.loadingImages[
							data.community as keyof typeof buttonTranslations.loadingImages
						] ?? 'Loading images...';
					button.textContent = loadingLabel;
					await preloadCommunityImages(data.community);

					overlay?.classList.add('hidden');
					button.removeEventListener('click', onStart);
					resolve();
				} catch (error) {
					console.error('Failed to start audio:', error);
					Toastify({
						text: 'Audio initialization failed. Please unmute your device and tap "Start Audio" again.',
						duration: 4500,
						className: 'toast-error',
					}).showToast();
					button.disabled = false;
					button.textContent = originalLabel;
				}
			};

			button.addEventListener('click', onStart);
		});
	};

	try {
		await waitForAudioStart();
	} catch (error) {
		console.error('Audio start gate failed:', error);
		return;
	}

	await procedure();
})();
