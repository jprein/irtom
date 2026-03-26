import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import Toastify from 'toastify-js';
import config from '../config.yaml';
import {
	downloadLastRecording,
	uploadLastRecordingInChunks,
} from './mediaRecorderServices';
import _ from 'lodash';

// promised based timeout
export const sleep = (ms = 2000) =>
	new Promise<number>((r) => setTimeout(r, ms));

export const isTouchDevice = () =>
	'ontouchstart' in window || navigator.maxTouchPoints > 0;

export const millisToMinutesAndSeconds = (millis: number) => {
	const minutes = Math.floor(millis / 60000);
	const seconds = Number(((millis % 60000) / 1000).toFixed(0));
	// return { minutes: minutes, seconds: (seconds < 10 ? '0' : '') + seconds };
	return { minutes, seconds };
};

export const moveToCenterAnchor = (svg: SvgInHtml, x?: number, y?: number) => {
	// Get the bounding box of the svg
	const bbox = svg.getBBox();

	// Calculate the center coordinates
	let cx = 0;
	if (x) {
		cx = bbox.x + bbox.width / 2;
	}
	let cy = 0;
	if (y) {
		cy = bbox.y + bbox.height / 2;
	}

	// Translate the SVG to the new position
	if (x && y) {
		gsap.set(svg, { x: x - cx, y: y - cy });
	}
	if (x && !y) {
		gsap.set(svg, { x: x - cx });
	}
	if (!x && y) {
		gsap.set(svg, { y: y - cy });
	}
};

export const startFullscreen = (isIOS: boolean) => {
	if (isIOS) return;
	const elem = document.documentElement as HTMLElement & {
		mozRequestFullScreen(): Promise<void>;
		webkitRequestFullscreen(): Promise<void>;
		msRequestFullscreen(): Promise<void>;
	};
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE11 */
		elem.msRequestFullscreen();
	}
};

export const exitFullscreen = (isIOS: boolean) => {
	if (isIOS) return;
	const elem = document as Document & {
		mozCancelFullScreen(): Promise<void>;
		webkitExitFullscreen(): Promise<void>;
		msExitFullscreen(): Promise<void>;
	};
	if (elem.exitFullscreen) {
		elem.exitFullscreen();
	} else if (elem.mozCancelFullScreen) {
		/* Firefox */
		elem.mozCancelFullScreen();
	} else if (elem.webkitExitFullscreen) {
		/* Chrome, Safari and Opera */
		elem.webkitExitFullscreen();
	} else if (elem.msExitFullscreen) {
		/* IE/Edge */
		elem.msExitFullscreen();
	}
};

export const generateUserIdFilename = (
	prefix = 'irtom',
	postfix = 'data',
	extension = 'json'
) => {
	const day = new Date().toISOString().slice(0, 10);
	const time = new Date().toISOString().slice(11, 19).replaceAll(':', '-');
	return `${prefix}-${data.id}-${day}-${time}-${postfix}.${extension}`;
};

// define overall study variables that will be included in the CSV export and their order
const STATIC_CSV_FIELD_ORDER = [
	'id',
	'community',
	'osName',
	'browserName',
	'touchscreen',
	'webcam',
	'startTime',
	'completionTimeMin',
	'breaks',
] as const;

// dedicated column name for the procedure step identifier in the CSV
const CSV_TRIAL_COLUMN = 'trial' as const;

// define trial-specific variables that will be included in the CSV export and their order
const PROCEDURE_CSV_FIELD_ORDER = [
	'trialNr',
	'dimension',
	'response',
	'correct',
	'score',
	'repeatOnClick',
	'repeatIncorrect',
	'trialDurationSec',
	'responseTimeSec',
	'analyse',
] as const;

// define variables that should be excluded from the CSV export
const CSV_TRANSIENT_KEYS = [
	'currentProcedure',
	'currentSlide',
	'datatransfer',
	'nextSlide',
	'previousSlide',
	'slideCounter',
	'simpleSlideCounter',
	't0',
	't1',
	'endTime',
	'totalSlides',
	'videoExtension',
	'hasWebcam',
	'safari',
	'isIOS',
	'iOSSafari',
	'clickedRepeat',
	'incorrectResponse',
	'emoji',
	'webcamRecordingReady',
] as const;

// format date as YYYY-MM-DD_HH-MM-SS for CSV export
const formatCsvTimestamp = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
		date.getDate()
	).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}:${String(
		date.getMinutes()
	).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

// Build a snapshot of the data object for CSV export, excluding transient keys and formatting dates
export const buildCsvSnapshot = (sourceData: any = data) => {
	const csvSnapshot = _.cloneDeep(sourceData);

	const start =
		csvSnapshot.t0 instanceof Date ? csvSnapshot.t0 : new Date(csvSnapshot.t0);
	const end = new Date();

	if (!Number.isNaN(start.getTime())) {
		csvSnapshot.startTime = formatCsvTimestamp(start);
		csvSnapshot.completionTimeMin = (
			(end.getTime() - start.getTime()) /
			60000
		).toFixed(2);
	}

	csvSnapshot.endTime = formatCsvTimestamp(end);

	CSV_TRANSIENT_KEYS.forEach((key) => {
		if (key in csvSnapshot) {
			delete csvSnapshot[key];
		}
	});

	return csvSnapshot;
};

// Helper function to generate CSV content
// takes only the relevant fields defined in STATIC_CSV_FIELD_ORDER and PROCEDURE_CSV_FIELD_ORDER,
// and formats them in the correct order for CSV export
const generateCsvContent = (jsonData: any): string => {
	const csvSnapshot = buildCsvSnapshot(jsonData);
	const procedureData = csvSnapshot?.procedure ?? {};
	const procedureKeys = Object.keys(procedureData);

	const staticFields = STATIC_CSV_FIELD_ORDER.filter(
		(field) => field in csvSnapshot
	);

	const knownProcedureFields = PROCEDURE_CSV_FIELD_ORDER.filter((field) =>
		procedureKeys.some((step) => field in (procedureData[step] ?? {}))
	);
	const procedureFields = knownProcedureFields;

	const header = [...staticFields, CSV_TRIAL_COLUMN, ...procedureFields];

	// Prepare the CSV rows
	const rows = procedureKeys.map((step) => {
		const trialData = procedureData[step] ?? {};
		return [
			...staticFields.map((field) => csvSnapshot[field]), // Add static field values
			step, // Add the procedure step name for CSV_TRIAL_COLUMN
			...procedureFields.map((field) => trialData[field]), // Add procedure-specific values
		];
	});

	// Combine header and rows into a CSV string
	return [
		header.join(','), // Header row
		...rows.map((row) => row.map((value) => `"${value}"`).join(',')), // Data rows
	].join('\n');
};

// Helper function to trigger browser download of a Blob with a given filename
const triggerBrowserDownload = async (blob: Blob, filename: string) => {
	const url = window.URL.createObjectURL(blob);
	const hiddenElement = document.createElement('a');
	hiddenElement.style.display = 'none';
	hiddenElement.href = url;
	hiddenElement.download = filename;
	document.body.appendChild(hiddenElement);
	hiddenElement.click();
	document.body.removeChild(hiddenElement);

	// Let browser register the click/download before revoking the blob URL.
	await sleep(0);
	window.URL.revokeObjectURL(url);
};

// Function to download the CSV
export const downloadCsv = async (
	jsonData: any = data,
	id: string = generateUserIdFilename('irtom', undefined, 'csv')
) => {
	const csvContent = generateCsvContent(jsonData);

	// Create a Blob and trigger the download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	await triggerBrowserDownload(blob, id);
};

// Function to upload the CSV
export async function uploadCsv(
	jsonData: any = data,
	id: string = generateUserIdFilename('irtom', undefined, 'csv')
) {
	const csvContent = generateCsvContent(jsonData);

	try {
		// Send the CSV content to the server, including the `id` as part of the request
		const response = await fetch('./data/data.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'text/csv',
				'X-File-Name': id, // Include the file name in the headers
			},
			body: csvContent, // Send the CSV content as the body
		});

		const responseText = await response.text();
		let responseData: { success?: boolean; message?: string } = {};
		try {
			responseData = responseText ? JSON.parse(responseText) : {};
		} catch {
			const responsePreview = responseText.slice(0, 120).replace(/\s+/g, ' ');
			throw new Error(
				`Upload endpoint did not return JSON. Response starts with: ${responsePreview}`
			);
		}

		console.log('Success:', responseData);
		if (!response.ok || !responseData.success) {
			throw new Error(
				responseData.message ??
					`CSV upload failed with status ${response.status}.`
			);
		}

		if (config.devmode.on) {
			Toastify({
				text: '💾 CSV uploaded successfully!',
				duration: 2000,
				className: 'toast-info',
			}).showToast();
		}
	} catch (error) {
		if (config.devmode.on) {
			console.warn('CSV upload failed in uploadCsv().', error);
			Toastify({
				text: '🤔 CSV upload failed!',
				duration: 2000,
				className: 'toast-error',
			}).showToast();
		}
		throw error;
	}
}

// Function to download the webcam video
export async function downloadWebcamVideo(webcam: boolean, id: string) {
	try {
		if (webcam === true) {
			const day = new Date().toISOString().substring(0, 10);
			const time = new Date()
				.toISOString()
				.substring(11, 19)
				.replaceAll(':', '-');
			downloadLastRecording(`irtom-${id}-${day}-${time}.webm`);
			await sleep(0);
		}
	} catch (error) {
		console.error('Error downloading video:', error);
	}
}

// Function to upload the webcam video
export async function uploadWebcamVideo(webcam: boolean, id: string) {
	// await sleep(2000);
	if (webcam === true) {
		// give some time to create Video Blob

		const day = new Date().toISOString().substring(0, 10);
		const time = new Date()
			.toISOString()
			.substring(11, 19)
			.replaceAll(':', '-');
		try {
			await uploadLastRecordingInChunks('./data/upload_video.php', {
				filename: `irtom-${id}-${day}-${time}.webm`,
				chunkSize: 1024 * 1024,
			});

			if (config.devmode.on) {
				Toastify({
					text: '💾 Video uploaded successfully!',
					duration: 2000,
					className: 'toast-info',
				}).showToast();
			}
		} catch (err) {
			console.error('Error uploading video:', err);
			Toastify({
				text: '🤔 Video upload failed!',
				duration: 2000,
				className: 'toast-error',
			}).showToast();
			throw err;
		}
	}
	await sleep(2000);
}
