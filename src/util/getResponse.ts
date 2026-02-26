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

		let settled = false;

		const cleanup = () => {
			targets.forEach((target) => {
				target.removeEventListener('pointerup', handleResponse);
				target.removeEventListener('click', handleResponse);
			});
		};

		const handleResponse = (event: Event) => {
			if (settled) return;
			settled = true;
			cleanup();
			// Use currentTarget to resolve the element where the listener was attached.
			resolve(event.currentTarget as Element);
		};

		targets.forEach((target) => {
			target.addEventListener('pointerup', handleResponse);
			target.addEventListener('click', handleResponse);
		});
	});
};
