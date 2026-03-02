const preloadCache = new Map<string, Promise<void>>();
const REQUIRED_PRELOAD_ENTRIES = ['assets/experiment-voxified.svg'];

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const toImageUrl = (entry: string): string => {
	const trimmed = entry.trim();
	if (!trimmed) {
		throw new Error('Image list contains an empty path.');
	}

	if (isAbsoluteUrl(trimmed)) {
		return trimmed;
	}

	const normalized = trimmed.replace(/^\.?\//, '').replace(/^\/+/, '');
	const relativePath =
		normalized.startsWith('assets/') || normalized.startsWith('communities/')
			? normalized
			: `assets/${normalized}`;

	return new URL(relativePath, document.baseURI).toString();
};

const preloadSingleImage = (src: string): Promise<void> =>
	new Promise<void>((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve();
		image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
		image.src = src;
	});

async function preloadCommunityImagesInternal(
	community: string,
): Promise<void> {
	const manifestUrl = new URL(
		`communities/${community}/images-${community}.json`,
		document.baseURI,
	).toString();

	let imageEntries: string[] = [];
	try {
		const response = await fetch(manifestUrl);
		if (!response.ok) {
			console.error(
				`Image preload list request returned ${response.status} for ${manifestUrl}`,
			);
		} else {
			const payload = (await response.json()) as unknown;
			if (!Array.isArray(payload)) {
				console.error(`Invalid image list format in ${manifestUrl}`);
			} else {
				imageEntries = payload.filter(
					(item): item is string => typeof item === 'string',
				);
				if (imageEntries.length !== payload.length) {
					console.warn(
						`Image list contains non-string entries in ${manifestUrl}`,
					);
				}
			}
		}
	} catch (error) {
		console.error(
			`Image preload list request failed for ${manifestUrl}:`,
			error,
		);
	}

	const combinedEntries = [
		...new Set([...imageEntries, ...REQUIRED_PRELOAD_ENTRIES]),
	];

	if (combinedEntries.length === 0) {
		return;
	}

	const failedEntries: string[] = [];
	await Promise.all(
		combinedEntries.map(async (entry) => {
			let url: string;
			try {
				url = toImageUrl(entry);
			} catch {
				failedEntries.push(entry);
				return;
			}

			try {
				await preloadSingleImage(url);
			} catch {
				failedEntries.push(entry);
			}
		}),
	);

	if (failedEntries.length > 0) {
		console.warn(
			`Image preload: ${failedEntries.length}/${combinedEntries.length} failed. Continuing anyway.`,
		);
		console.warn('Failed image names:', failedEntries);
	}
}

export async function preloadCommunityImages(community: string): Promise<void> {
	if (!community) {
		console.warn('Community is missing for image preload. Skipping preload.');
		return;
	}

	const cacheKey = community.toLowerCase();
	const existing = preloadCache.get(cacheKey);
	if (existing) {
		return existing;
	}

	const preloadPromise = preloadCommunityImagesInternal(cacheKey).catch(
		(error) => {
			preloadCache.delete(cacheKey);
			console.error('Unexpected image preload error:', error);
		},
	);

	preloadCache.set(cacheKey, preloadPromise);
	return preloadPromise;
}
