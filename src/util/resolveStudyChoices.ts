const STUDY_CHOICE_KEYS = [
	'id',
	'community',
	'webcam',
	'datatransfer',
] as const;

type StudyChoiceKey = (typeof STUDY_CHOICE_KEYS)[number];

export type StudyChoices = Record<StudyChoiceKey, string>;

// Default values for study choices if not provided via URL or localStorage.
export const DEFAULT_STUDY_CHOICES: StudyChoices = {
	id: 'testID',
	community: 'german',
	datatransfer: 'server',
	webcam: 'true',
};

// Convert unknown input into a usable choice value: trimmed string or undefined.
// e.g., null, undefined, non-string, or empty string all become undefined.
const normalizeChoiceValue = (value: unknown): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const trimmed = value.trim();
	if (trimmed === '') {
		return undefined;
	}

	return trimmed;
};

// Read current URL params once and flag whether any relevant study key exists.
const getStudyChoiceParamState = () => {
	const params = new URLSearchParams(window.location.search);
	const hasAnyStudyChoiceParam = STUDY_CHOICE_KEYS.some((key) =>
		params.has(key)
	);

	return { params, hasAnyStudyChoiceParam };
};

// Extract relevant study choices from the URL and normalize each value.
export const getUrlStudyChoices = (): Partial<StudyChoices> => {
	const { params } = getStudyChoiceParamState();
	const urlChoices: Partial<StudyChoices> = {};

	STUDY_CHOICE_KEYS.forEach((key) => {
		const normalized = normalizeChoiceValue(params.get(key));
		if (normalized) {
			urlChoices[key] = normalized;
		}
	});

	return urlChoices;
};

// Remove only study-choice params from the URL while preserving other query params/hash.
export const cleanStudyChoiceParamsFromUrl = () => {
	const { params, hasAnyStudyChoiceParam } = getStudyChoiceParamState();

	if (!hasAnyStudyChoiceParam) {
		return;
	}

	STUDY_CHOICE_KEYS.forEach((key) => {
		params.delete(key);
	});

	const cleanedQuery = params.toString();
	const cleanedUrl = `${window.location.pathname}${
		cleanedQuery ? `?${cleanedQuery}` : ''
	}${window.location.hash}`;

	window.history.replaceState({}, document.title, cleanedUrl);
};

// Read stored study choices from localStorage and normalize known keys.
export const getStoredStudyChoices = (): Partial<StudyChoices> => {
	const rawStoredChoices = localStorage.getItem('storedChoices');

	if (!rawStoredChoices) {
		return {};
	}

	try {
		const parsed = JSON.parse(rawStoredChoices) as Record<string, unknown>;
		const storedChoices: Partial<StudyChoices> = {};

		STUDY_CHOICE_KEYS.forEach((key) => {
			const normalized = normalizeChoiceValue(parsed[key]);
			if (normalized) {
				storedChoices[key] = normalized;
			}
		});

		return storedChoices;
	} catch (error) {
		console.warn('Failed to parse storedChoices from localStorage:', error);
		return {};
	}
};

// Build final study choices with precedence: defaults < localStorage < URL.
// Persist the resolved result and clean study-choice params from the address bar.
export const resolveStudyChoices = () => {
	const urlChoices = getUrlStudyChoices();
	const storedChoices = getStoredStudyChoices();

	const studyChoices: StudyChoices = {
		...DEFAULT_STUDY_CHOICES,
		...storedChoices,
		...urlChoices,
	};

	localStorage.setItem('storedChoices', JSON.stringify(studyChoices));
	cleanStudyChoiceParamsFromUrl();

	console.log('studyChoices', studyChoices);
	console.log('urlChoices', urlChoices);

	return {
		studyChoices,
		urlChoices,
	};
};
