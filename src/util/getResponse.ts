export const getResponse = (id?: string | string[]) => {
	return new Promise<Element>((resolve) => {
		const handleResponse = (event: Event) => {
			// take currentTarget instead of target
			// so that we get the parent node where the eventlistener was attached to
			const target = event.currentTarget as Element;
			return resolve(target);
		};

		if (typeof id === 'string') {
			document
				.getElementById(id)!
				.addEventListener('click', handleResponse, { once: true });
		}

		if (Array.isArray(id)) {
			id.forEach((id) => {
				document
					.getElementById(id)!
					.addEventListener('click', handleResponse, { once: true });
			});
		}

		if (id === undefined) {
			document
				.getElementById('wrapper')!
				.addEventListener('click', handleResponse, { once: true });
		}
	});
};
