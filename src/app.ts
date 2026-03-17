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

(async () => {
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

					data.sprite = await createSprite(data.spriteJSON);

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
