export const playPromise = (url: string) => {
	const audio = document.getElementById('audio') as HTMLAudioElement;
	return new Promise(function (resolve, reject) {
		audio.autoplay = true;
		audio.src = url;
		audio.play();
		audio.onerror = reject;
		audio.onended = resolve;
	});
};

export const play = (
	url: string | string[],
	elementId?: string,
	once = false,
) => {
	const audio = document.getElementById('audio') as HTMLAudioElement;

	// play audio sequentially
	if (Array.isArray(url)) {
		const playNext = () => {
			if (url.length > 0) {
				const nextUrl = url.shift();
				if (!nextUrl) return;
				audio.setAttribute('src', nextUrl);
				audio.play();
			}
		};

		audio.addEventListener('ended', playNext);

		playNext();
		return;
	}

	if (elementId) {
		document.getElementById(elementId)!.addEventListener(
			'click',
			() => {
				audio.autoplay = true;
				// Restart the audio by setting the current time to 0
				audio.currentTime = 0;
				audio.setAttribute('src', url);
				audio.play();
			},
			{ once },
		);
	} else {
		audio.setAttribute('src', url);
		audio.play();
	}
};

export const stop = () => {
	const audio = document.getElementById('audio') as HTMLAudioElement;
	const pinda = document.getElementById('pinda') as HTMLVideoElement;

	// stop audio
	audio.pause();
	audio.currentTime = 0;

	// stop pinda
	pinda.pause();
	pinda.currentTime = 0;
};

// get duration of audio file
export const getDuration = (url: string): Promise<number> =>
	new Promise((resolve) => {
		const audio = document.createElement('audio');
		audio.setAttribute('src', url);
		audio.addEventListener('loadedmetadata', function () {
			resolve(audio.duration);
		});
	});

export const isPlaying = (media: HTMLMediaElement) => {
	return !!(
		media.currentTime > 0 &&
		!media.paused &&
		!media.ended &&
		media.readyState > 2
	);
};
