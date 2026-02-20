export const createSprite = async (settingsObj) => {
	const { src, sprite } = settingsObj;
	let audioBuffer;
	let ctx;

	// Initialize the audio context and load the audio file
	async function init() {
		try {
			const AudioCtx = window.AudioContext;
			ctx = new AudioCtx();

			if (ctx.state === 'suspended') {
				await ctx.resume();
				console.log('AudioContext resumed');
			}

			audioBuffer = await getFile();
		} catch (error) {
			console.error('Initialization error for audio sprites:', error);
		}
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

	// Synchronous play function
	function play(sampleName: string) {
		if (!audioBuffer || !ctx) {
			console.error('Audio sprite not initialized yet.');
			return;
		}
		const sampleData = sprite[sampleName];
		if (!sampleData) {
			console.error('Invalid audio sprite sample name: ', sampleName);
			return;
		}
		const startTime = sampleData[0] / 1000;
		const duration = sampleData[1] / 1000;
		const sampleSource = ctx.createBufferSource();
		sampleSource.buffer = audioBuffer;
		sampleSource.connect(ctx.destination);
		sampleSource.start(ctx.currentTime, startTime, duration);
	}

	// Asynchronous play function that returns a promise
	async function playPromise(sampleName: string): Promise<void> {
		if (!audioBuffer || !ctx) {
			throw new Error('Audio sprite not initialized yet.');
		}

		const sampleData = sprite[sampleName];
		if (!sampleData) {
			throw new Error('Invalid audio sprite sample name: ' + sampleName);
		}

		const startTime = sampleData[0] / 1000;
		const duration = sampleData[1] / 1000;
		console.log(ctx.state);
		const sampleSource = ctx.createBufferSource();
		sampleSource.buffer = audioBuffer;
		sampleSource.connect(ctx.destination);
		console.log(ctx.state);
		// Wait until the audio ends
		await new Promise<void>((resolve, reject) => {
			sampleSource.onended = () => resolve();
			console.log(ctx.state);
			try {
				sampleSource.start(ctx.currentTime, startTime, duration);
			} catch (err) {
				reject(err);
			}
		});
	}

	await init();

	return { play, playPromise };
};
