import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import Toastify from 'toastify-js';
import {
	downloadLastRecording,
	uploadLastRecordingInChunks,
} from './mediaRecorderServices';

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
	extension = 'json',
) => {
	const day = new Date().toISOString().slice(0, 10);
	const time = new Date().toISOString().slice(11, 19).replaceAll(':', '-');
	return `${prefix}-${data.id}-${day}-${time}-${postfix}.${extension}`;
};

// Helper function to generate CSV content
const generateCsvContent = (jsonData: any): string => {
	// Extract the static fields (non-procedure fields)
	const staticFields = Object.keys(jsonData).filter(
		(key) => key !== 'procedure',
	);

	// Extract the procedure keys (dynamic rows)
	const procedureKeys = Object.keys(jsonData.procedure);
	Object.values(jsonData.procedure).forEach((trial: any) => {
		delete (trial as any).trainingTrial;
	});

	// Prepare the CSV header
	const header = [
		...staticFields,
		'trial',
		...Object.keys(jsonData.procedure[procedureKeys[0]]),
	];

	// Prepare the CSV rows
	const rows = procedureKeys.map((step) => {
		const procedureData = jsonData.procedure[step];
		return [
			...staticFields.map((field) => jsonData[field]), // Add static field values
			step, // Add the procedure step name
			...Object.values(procedureData), // Add procedure-specific values
		];
	});

	// Combine header and rows into a CSV string
	return [
		header.join(','), // Header row
		...rows.map((row) => row.map((value) => `"${value}"`).join(',')), // Data rows
	].join('\n');
};

// Function to download the CSV
export const downloadCsv = (
	jsonData: any = data,
	id: string = generateUserIdFilename('irtom', undefined, 'csv'),
) => {
	const csvContent = generateCsvContent(jsonData);

	// Create a Blob and trigger the download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const hiddenElement = document.createElement('a');
	hiddenElement.href = window.URL.createObjectURL(blob);
	hiddenElement.download = id;
	hiddenElement.click();
};

// Function to upload the CSV
export const uploadCsv = (
	jsonData: any = data,
	id: string = generateUserIdFilename('irtom', undefined, 'csv'),
) => {
	const csvContent = generateCsvContent(jsonData);

	// Send the CSV content to the server, including the `id` as part of the request
	fetch('./data/data.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/csv',
			'X-File-Name': id, // Include the file name in the headers
		},
		body: csvContent, // Send the CSV content as the body
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
			if (data.success) {
				Toastify({
					text: '💾 CSV uploaded successfully!',
					duration: 2000,
					className: 'toast-info',
				}).showToast();
			} else {
				Toastify({
					text: '🤔 CSV upload failed!',
					duration: 2000,
					className: 'toast-error',
				}).showToast();
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};

// Function to download the webcam video
export async function downloadWebcamVideo(webcam: boolean, id: string) {
	// mrec.stopRecorder();
	// // give some time to create Video Blob
	// const day = new Date().toISOString().substring(0, 10);
	// const time = new Date().toISOString().slice(11, 19).replaceAll(':', '-');
	// await sleep(2000);
	// mrec.downloadVideo(`irtom-${id}-${day}-${time}`);
	try {
		if (webcam === true) {
			// give some time to create Video Blob

			const day = new Date().toISOString().substring(0, 10);
			const time = new Date().toISOString().substring(11, 19);
			// save video on server

			// save video locally
			setTimeout(() => {
				downloadLastRecording(`irtom-${id}-${day}-${time}`);
			}, 2000);
		}
	} catch (error) {
		console.error('Error downloading video:', error);
	}
}

// Function to upload the webcam video
export async function uploadWebcamVideo(webcam: boolean, id: string) {
	// // stop recorder and upload video
	// mrec.stopRecorder();
	// // show upload spinner
	// mrec.modalContent(
	// 	'<img src=\'assets/spinner-upload-de.svg\' style="width: 75vw">',
	// 	'#E1B4B4',
	// );
	// await sleep(2000);
	// const day = new Date().toISOString().substring(0, 10);
	// const time = new Date().toISOString().slice(11, 19).replaceAll(':', '-');
	// try {
	// 	mrec.uploadVideo(
	// 		{
	// 			fname: `irtom-${id}-${day}-${time}`,
	// 			uploadContent:
	// 				'<img src=\'assets/spinner-upload-de.svg\' style="width: 75vw">',
	// 			uploadColor: '#E1B4B4',
	// 			successContent:
	// 				'<img src=\'assets/spinner-done-de.svg\' style="width: 75vw">',
	// 			successColor: '#D3F9D3',
	// 		},
	// 		'./data/upload_video.php',
	// 	);
	// } catch (error) {
	// 	console.error('Error uploading video:', error);
	// }
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
				filename: `irtom-${id}-${day}-${time}`,
			});

			Toastify({
				text: '💾 Video uploaded successfully!',
				duration: 2000,
				className: 'toast-info',
			}).showToast();
		} catch (err) {
			console.log('Error uploading video:', err);
			Toastify({
				text: '🤔 Video upload failed!',
				duration: 2000,
				className: 'toast-error',
			}).showToast();
		}
	}
	await sleep(2000);
}
