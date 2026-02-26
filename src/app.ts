import './css/app.css';
import './css/style.css';
import { procedure } from './procedure/procedure';
import { init } from './util/init';
import { createSprite } from './util/createSprite';
import config from './config.yaml';
import { startFullscreen } from './util/helpers';

(async () => {
	await init();

	const waitForAudioStart = async () => {
		const overlay = document.getElementById(
			'audio-start-overlay',
		) as HTMLDivElement | null;
		const button = document.getElementById(
			'audio-start-button',
		) as HTMLButtonElement | null;

		if (!button) {
			throw new Error('Audio start button not found in app.html');
		}

		await new Promise<void>((resolve) => {
			const onStart = async () => {
				const originalLabel = button.textContent ?? 'Start Audio';
				button.disabled = true;
				button.textContent = 'Preparing audio...';

				try {
					if (!config.devmode.on && !data.isIOS) {
						startFullscreen(data.isIOS);
					}

					if (!data.spriteJSON && data.community) {
						const spriteLookup = await fetch(
							`./communities/${data.community}/combined.json`,
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

					overlay?.classList.add('hidden');
					button.removeEventListener('click', onStart);
					resolve();
				} catch (error) {
					console.error('Failed to start audio:', error);
					alert(
						'Audio initialization failed. Please unmute your device and tap "Start Audio" again.',
					);
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
