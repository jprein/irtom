import { Howl, Howler } from 'howler';

const INIT_TIMEOUT_MS = 20_000;

// Detect any iOS device (iPad reports desktop "Macintosh" UA since iPadOS 13).
const isIOS =
	/iPad|iPhone|iPod/.test(navigator.userAgent) ||
	(navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));

/**
 * Audio sprite backed by Howler.js.
 *
 * On iOS we force HTML5 Audio mode. Howler's AudioContext is created at
 * module-load time (outside any gesture) and iOS keeps it suspended. HTML5
 * Audio doesn't have this restriction and works on both iPad Safari and
 * iPad Chrome (CriOS / WKWebView).
 *
 * On desktop browsers, Howler uses its default WebAudio path which works
 * fine without any special handling.
 */
export const createSprite = async (settingsObj: {
	src: string[];
	sprite: Record<string, [number, number]>;
}) => {
	const { src, sprite } = settingsObj;

	// On desktop, ensure Howler's AudioContext is resumed within this
	// user-gesture callback. Without this, Mac Chrome may time out on first load
	// because the context was suspended at import time.
	if (!isIOS && Howler.ctx?.state === 'suspended') {
		await Howler.ctx.resume();
	}

	// Add a short warmup entry to the sprite map. Playing this muted after
	// load forces the HTML5 Audio element to fully initialise, eliminating
	// the "seek-bleed" where offset-0 audio (dog) is briefly heard before
	// the real segment starts.
	const spriteWithWarmup: Record<string, [number, number]> = {
		...sprite,
		__warmup: [0, 250],
	};

	// Prefer MP3 for sprite-timing consistency.
	const orderedSrc = [...(src ?? [])].sort((a, b) => {
		const aIsMp3 = a.toLowerCase().endsWith('.mp3') ? 0 : 1;
		const bIsMp3 = b.toLowerCase().endsWith('.mp3') ? 0 : 1;
		return aIsMp3 - bIsMp3;
	});

	const howl = await new Promise<Howl>((resolve, reject) => {
		const timeoutId = setTimeout(
			() => reject(new Error('Audio sprite initialization timed out')),
			INIT_TIMEOUT_MS
		);

		const sound = new Howl({
			src: orderedSrc,
			sprite: spriteWithWarmup as unknown as Record<
				string,
				[number, number] | [number, number, boolean]
			>,
			preload: true,
			html5: isIOS,
			onload: () => {
				clearTimeout(timeoutId);
				resolve(sound);
			},
			onloaderror: (_id, err) => {
				clearTimeout(timeoutId);
				reject(
					new Error(
						`Audio sprite load failed: ${typeof err === 'string' ? err : String(err)}`
					)
				);
			},
		});
	});

	// Warm up the HTML5 Audio element on iOS so the first real play
	// doesn't suffer from seek-bleed (offset 0 audible before seek settles).
	if (isIOS) {
		await new Promise<void>((resolve) => {
			const wId = howl.play('__warmup');
			howl.mute(true, wId);
			const cleanup = () => {
				howl.stop(wId);
				resolve();
			};
			// Wait for the element to actually start playing, then stop.
			howl.once('play', cleanup, wId);
			// Safety fallback if 'play' never fires.
			setTimeout(cleanup, 1000);
		});
	}

	function play(sampleName: string) {
		howl.play(sampleName);
	}

	async function playPromise(sampleName: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const id = howl.play(sampleName);
			if (typeof id !== 'number') {
				reject(new Error(`Failed to play sprite segment: ${sampleName}`));
				return;
			}
			howl.once(
				'end',
				() => {
					resolve();
				},
				id
			);
			howl.once(
				'playerror',
				(_soundId, err) => {
					reject(
						new Error(
							`Audio playback error for "${sampleName}": ${String(err)}`
						)
					);
				},
				id
			);
		});
	}

	return { play, playPromise };
};
