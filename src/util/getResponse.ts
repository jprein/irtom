import {
	getActivePauseButton,
	hidePauseButton,
	isPauseResponse,
	runPauseFlow,
} from './pauseControls';

export const getResponse = (id?: string | string[]) => {
	return new Promise<Element>((resolve) => {
		const targets: Element[] = [];

		if (typeof id === 'string') {
			const target = document.getElementById(id);
			if (target) targets.push(target);
		}

		if (Array.isArray(id)) {
			id.forEach((id) => {
				const target = document.getElementById(id);
				if (target) targets.push(target);
			});
		}

		if (id === undefined) {
			const wrapper = document.getElementById('wrapper');
			if (wrapper) targets.push(wrapper);
		}

		const pauseButton = getActivePauseButton();
		if (
			pauseButton &&
			data.currentSlide !== 'sEnd' &&
			(!('classList' in pauseButton) || !pauseButton.classList.contains('hidden'))
		) {
			targets.push(pauseButton);
		}

		let settled = false;

		const cleanup = () => {
			hidePauseButton();
			targets.forEach((target) => {
				target.removeEventListener('pointerup', handleResponse);
				target.removeEventListener('click', handleResponse);
			});
		};

		const handleResponse = async (event: Event) => {
			if (settled) return;
			settled = true;
			cleanup();
			const target = event.currentTarget as Element;
			if (isPauseResponse(target)) {
				await runPauseFlow();
			}
			// Use currentTarget to resolve the element where the listener was attached.
			resolve(target);
		};

		targets.forEach((target) => {
			target.addEventListener('pointerup', handleResponse);
			target.addEventListener('click', handleResponse);
		});
	});
};
