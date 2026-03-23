import Toastify from 'toastify-js';

const INIT_TIMEOUT_MS = 20_000;
const AUDIO_RESUME_TIMEOUT_MS = 5_000;
const AUDIO_FETCH_TIMEOUT_MS = 15_000;
const AUDIO_DECODE_TIMEOUT_MS = 15_000;

const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs: number,
	label: string
) => {
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

export const createSprite = async (settingsObj) => {
	const { src, sprite } = settingsObj;
	let audioBuffer;
	let ctx;
	let unlockInFlight: Promise<boolean> | null = null;

	// Initialize the audio context and load the audio file
	async function init() {
		const AudioCtx =
			window.AudioContext ||
			(window as Window & { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext;
		if (!AudioCtx) {
			throw new Error('Web Audio API is not supported in this browser.');
		}
		ctx = new AudioCtx();
		audioBuffer = await withTimeout(
			getFile(),
			INIT_TIMEOUT_MS,
			'Audio sprite initialization'
		);
	}

	function waitForGesture() {
		return new Promise<void>((resolve) => {
			const onGesture = () => {
				window.removeEventListener('touchstart', onGesture, true);
				window.removeEventListener('touchend', onGesture, true);
				window.removeEventListener('click', onGesture, true);
				window.removeEventListener('keydown', onGesture, true);
				window.removeEventListener('mousedown', onGesture, true);
				window.removeEventListener('pointerup', onGesture, true);
				resolve();
			};

			window.addEventListener('touchstart', onGesture, {
				once: true,
				passive: true,
				capture: true,
			});
			window.addEventListener('touchend', onGesture, {
				once: true,
				passive: true,
				capture: true,
			});
			window.addEventListener('click', onGesture, {
				once: true,
				capture: true,
			});
			window.addEventListener('keydown', onGesture, {
				once: true,
				capture: true,
			});
			window.addEventListener('mousedown', onGesture, {
				once: true,
				capture: true,
			});
			window.addEventListener('pointerup', onGesture, {
				once: true,
				capture: true,
			});
		});
	}

	async function ensureAudioIsUnlocked(): Promise<boolean> {
		if (!ctx) return false;
		if (ctx.state === 'running') return true;
		if (unlockInFlight) return unlockInFlight;

		unlockInFlight = (async () => {
			try {
				await withTimeout(ctx!.resume(), AUDIO_RESUME_TIMEOUT_MS, 'AudioContext resume');
			} catch (error) {
				console.warn('AudioContext resume failed before gesture:', error);
			}

			if (ctx!.state === 'running') return true;

			Toastify({
				text: 'Audio is blocked on this device. Tap anywhere on the page to enable sound.',
				duration: 4500,
				className: 'toast-info',
			}).showToast();
			await waitForGesture();

			try {
				await withTimeout(ctx!.resume(), AUDIO_RESUME_TIMEOUT_MS, 'AudioContext resume');
			} catch (error) {
				console.error('AudioContext resume failed after gesture:', error);
			}

			if (ctx!.state !== 'running') {
				Toastify({
					text: 'Sound is still blocked. Please unmute your device and tap again.',
					duration: 4500,
					className: 'toast-error',
				}).showToast();
				return false;
			}
			return true;
		})().finally(() => {
			unlockInFlight = null;
		});

		return unlockInFlight;
	}

	// Fetch the audio file and decode it
	async function decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
		if (!ctx) {
			throw new Error('Audio context is not initialized.');
		}

		return await new Promise<AudioBuffer>((resolve, reject) => {
			let settled = false;
			const finish = (callback: () => void) => {
				if (settled) return;
				settled = true;
				callback();
			};

			try {
				const maybePromise = ctx.decodeAudioData(
					arrayBuffer,
					(decoded) => finish(() => resolve(decoded)),
					(error) => {
						const err =
							error instanceof Error
								? error
								: new Error('Failed to decode audio data.');
						finish(() => reject(err));
					}
				);

				if (maybePromise && typeof maybePromise.then === 'function') {
					maybePromise
						.then((decoded) => finish(() => resolve(decoded)))
						.catch((error) => {
							const err =
								error instanceof Error
									? error
									: new Error('Failed to decode audio data.');
							finish(() => reject(err));
						});
				}
			} catch (error) {
				const err =
					error instanceof Error
						? error
						: new Error('decodeAudioData threw unexpectedly.');
				finish(() => reject(err));
			}
		});
	}

	async function getFile() {
		const srcUrl = src?.[0];
		if (!srcUrl) {
			throw new Error('Audio sprite source URL is missing.');
		}

		const response = await withTimeout(
			fetch(srcUrl),
			AUDIO_FETCH_TIMEOUT_MS,
			'Audio sprite fetch'
		);
		if (!response.ok) {
			throw new Error(`${response.url} ${response.statusText}`);
		}
		const arrayBuffer = await response.arrayBuffer();
		return await withTimeout(
			decodeAudioData(arrayBuffer),
			AUDIO_DECODE_TIMEOUT_MS,
			'Audio sprite decode'
		);
	}

	function getSpriteTiming(sampleName: string) {
		const sampleData = sprite[sampleName];
		if (!sampleData) {
			throw new Error('Invalid audio sprite sample name: ' + sampleName);
		}

		return {
			startTime: sampleData[0] / 1000,
			duration: sampleData[1] / 1000,
		};
	}

	async function createStartedSource(sampleName: string) {
		if (!audioBuffer || !ctx) {
			throw new Error('Audio sprite not initialized yet.');
		}

		const isUnlocked = await ensureAudioIsUnlocked();
		if (!isUnlocked) {
			throw new Error('Audio context is not running after user gesture.');
		}

		const { startTime, duration } = getSpriteTiming(sampleName);
		const sampleSource = ctx.createBufferSource();
		sampleSource.buffer = audioBuffer;
		sampleSource.connect(ctx.destination);

		try {
			sampleSource.start(ctx.currentTime, startTime, duration);
		} catch (error) {
			console.warn('Audio start failed, retrying after unlock:', error);
			const unlockedAfterFailure = await ensureAudioIsUnlocked();
			if (!unlockedAfterFailure) {
				throw new Error('Audio start failed and audio is still locked.');
			}
			const retrySource = ctx.createBufferSource();
			retrySource.buffer = audioBuffer;
			retrySource.connect(ctx.destination);
			retrySource.start(ctx.currentTime, startTime, duration);
			return retrySource;
		}

		return sampleSource;
	}

	// Synchronous play function
	function play(sampleName: string) {
		void createStartedSource(sampleName).catch((error) => {
			console.error('Audio sprite play failed:', error);
		});
	}

	// Asynchronous play function that returns a promise
	async function playPromise(sampleName: string): Promise<void> {
		const sampleSource = await createStartedSource(sampleName);
		// Wait until the audio ends
		await new Promise<void>((resolve, reject) => {
			sampleSource.onended = () => resolve();
			sampleSource.onerror = (event) => reject(event);
		});
	}

	await init();
	if (!audioBuffer || !ctx) {
		throw new Error('Audio sprite initialization failed.');
	}

	return { play, playPromise };
};
