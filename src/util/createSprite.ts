export const createSprite = async (settingsObj) => {
	const { src, sprite } = settingsObj;
	let audioBuffer;
	let ctx;

	// Initialize the audio context and load the audio file
	async function init() {
		try {
			const AudioCtx = window.AudioContext;
			ctx = new AudioCtx();
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
	function playPromise(sampleName: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!audioBuffer || !ctx) {
				return reject(new Error('Audio sprite not initialized yet.'));
			}
			const sampleData = sprite[sampleName];
			if (!sampleData) {
				return reject(
					new Error('Invalid audio sprite sample name: ' + sampleName),
				);
			}
			const startTime = sampleData[0] / 1000;
			const duration = sampleData[1] / 1000;
			const sampleSource = ctx.createBufferSource();
			sampleSource.buffer = audioBuffer;
			sampleSource.connect(ctx.destination);
			sampleSource.onended = resolve;
			sampleSource.start(ctx.currentTime, startTime, duration);
		});
	}

	await init();

	return { play, playPromise };
};
