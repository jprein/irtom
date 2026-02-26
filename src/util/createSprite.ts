export const createSprite = async (settingsObj) => {
	const { src, sprite } = settingsObj;
	let audioBuffer;
	let ctx;
	let unlockInFlight: Promise<boolean> | null = null;

	// Initialize the audio context and load the audio file
	async function init() {
		try {
			const AudioCtx =
				window.AudioContext ||
				(window as Window & { webkitAudioContext?: typeof AudioContext })
					.webkitAudioContext;
			if (!AudioCtx) {
				throw new Error('Web Audio API is not supported in this browser.');
			}
			ctx = new AudioCtx();

			await ensureAudioIsUnlocked();

			audioBuffer = await getFile();
		} catch (error) {
			console.error('Initialization error for audio sprites:', error);
		}
	}

	function waitForGesture() {
		return new Promise<void>((resolve) => {
			const onGesture = () => {
				window.removeEventListener('touchend', onGesture, true);
				window.removeEventListener('click', onGesture, true);
				window.removeEventListener('keydown', onGesture, true);
				resolve();
			};

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
		});
	}

	async function ensureAudioIsUnlocked(): Promise<boolean> {
		if (!ctx) return false;
		if (ctx.state === 'running') return true;
		if (unlockInFlight) return unlockInFlight;

		unlockInFlight = (async () => {
			try {
				await ctx!.resume();
			} catch (error) {
				console.warn('AudioContext resume failed before gesture:', error);
			}

			if (ctx!.state === 'running') return true;

			alert(
				'Audio is blocked on this device. Tap OK, then tap anywhere on the page to enable sound.',
			);
			await waitForGesture();

			try {
				await ctx!.resume();
			} catch (error) {
				console.error('AudioContext resume failed after gesture:', error);
			}

			if (ctx!.state !== 'running') {
				alert(
					'Sound is still blocked. Please unmute your device and tap again.',
				);
				return false;
			}
			return true;
		})().finally(() => {
			unlockInFlight = null;
		});

		return unlockInFlight;
	}

	// Fetch the audio file and decode it
	async function getFile() {
		const response = await fetch(src[0]);
		if (!response.ok) {
			throw new Error(`${response.url} ${response.statusText}`);
		}
		const arrayBuffer = await response.arrayBuffer();
		return await ctx.decodeAudioData(arrayBuffer);
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

	return { play, playPromise };
};
