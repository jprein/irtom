let mediaStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: BlobPart[] = [];
let lastRecordedBlob: Blob | null = null;
let stopPromiseResolve: ((blob: Blob | null) => void) | null = null;

/**
 * Initialize camera + (optionally) microphone and return the MediaStream.
 *
 * @param constraints Optional getUserMedia constraints.
 * @returns Promise<MediaStream>
 */
export async function initMedia(
	constraints?: MediaStreamConstraints,
): Promise<MediaStream> {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		throw new Error('getUserMedia is not supported in this browser.');
	}

	// Stop any existing stream tracks
	if (mediaStream) {
		mediaStream.getTracks().forEach((track) => track.stop());
		mediaStream = null;
	}

	const defaultConstraints: MediaStreamConstraints = {
		audio: true,
		video: {
			width: { ideal: 640, max: 640 },
			height: { ideal: 480, max: 480 },
			frameRate: { ideal: 10, max: 15 },
			facingMode: 'user',
		},
	};

	const finalConstraints = constraints ?? defaultConstraints;

	try {
		mediaStream = await navigator.mediaDevices.getUserMedia(finalConstraints);
	} catch (err) {
		// iOS-ish microphone edge case
		if (String(err).includes('No AVAudioSessionCaptureDevice')) {
			console.warn('iOS cannot access microphone. Retrying without audio...');

			mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640, max: 640 },
					height: { ideal: 480, max: 480 },
					frameRate: { ideal: 10, max: 15 },
					facingMode: 'user',
				},
				audio: false,
			});
		} else {
			throw err;
		}
	}

	return mediaStream;
}

/**
 * Start recording the existing mediaStream.
 */
export function startRecording(): void {
	if (!mediaStream) {
		throw new Error('Media stream is not initialized. Call initMedia() first.');
	}

	recordedChunks = [];
	lastRecordedBlob = null;

	// Prefer Safari-friendly MP4 first, then WebM for Chromium/Firefox.
	const mimeType = pickSupportedMimeType([
		// Chromium/Firefox options
		'video/webm',
		// Safari/iOS commonly supports mp4 recording via MediaRecorder (when available)
		//'video/mp4',
	]);

	const options: MediaRecorderOptions = {
		videoBitsPerSecond: 150_000,
		...(mimeType ? { mimeType } : {}),
	};

	try {
		mediaRecorder = new MediaRecorder(mediaStream, options);
	} catch (err) {
		console.error('Failed to create MediaRecorder:', err);
		// Last fallback: create without options (some Safari versions are picky)
		mediaRecorder = new MediaRecorder(mediaStream);
	}

	mediaRecorder.ondataavailable = (event: BlobEvent) => {
		if (event.data && event.data.size > 0) recordedChunks.push(event.data);
	};

	mediaRecorder.onerror = (event: Event) => {
		const error = (event as any).error;
		console.error('MediaRecorder error:', error);
	};

	mediaRecorder.onstop = () => {
		const finalType =
			mediaRecorder?.mimeType || mimeType || 'application/octet-stream';
		lastRecordedBlob = new Blob(recordedChunks, { type: finalType });

		if (stopPromiseResolve) {
			stopPromiseResolve(lastRecordedBlob);
			stopPromiseResolve = null;
		}
	};

	mediaRecorder.start();
}

export function pickSupportedMimeType(
	candidates: string[],
): string | undefined {
	if (typeof MediaRecorder === 'undefined') return undefined;
	if (typeof MediaRecorder.isTypeSupported !== 'function') return undefined;

	return candidates.find((t) => MediaRecorder.isTypeSupported(t));
}

/**
 * Stop recording and resolve to the recorded Blob (or null if no active recording).
 */
export function stopRecording({
	stopStream = false,
} = {}): Promise<Blob | null> {
	if (!mediaRecorder || mediaRecorder.state !== 'recording') {
		console.warn('stopRecording called but there is no active recording.');
		if (stopStream) stopMediaStream();
		return Promise.resolve(null);
	}

	return new Promise<Blob | null>((resolve) => {
		stopPromiseResolve = (blob) => {
			resolve(blob);

			// IMPORTANT: stop the camera/mic after recorder finishes finalizing the blob
			if (stopStream) stopMediaStream();
		};

		mediaRecorder?.stop();
	});
}

/**
 * Get the last recorded Blob (if any).
 */
export function getLastRecordingBlob(): Blob | null {
	return lastRecordedBlob;
}

/**
 * Create an object URL from the last recorded Blob.
 */
export function getLastRecordingUrl(): string | null {
	if (!lastRecordedBlob) return null;
	return URL.createObjectURL(lastRecordedBlob);
}

/**
 * Download the last recorded video as a file.
 */
export function downloadLastRecording(filename = 'recording.webm'): void {
	if (!lastRecordedBlob) {
		throw new Error('No recording available to download.');
	}

	const url = URL.createObjectURL(lastRecordedBlob);
	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export interface UploadProgressInfo {
	uploadedBytes: number;
	totalBytes: number;
	chunkIndex: number;
	totalChunks: number;
	uploadId: string;
}

export interface UploadInChunksOptions {
	fieldName?: string;
	filename?: string;
	chunkSize?: number;
	additionalData?: Record<string, string | Blob>;
	fetchOptions?: RequestInit;
	onProgress?: (progress: number, info: UploadProgressInfo) => void;
}

/**
 * Upload the last recorded video in chunks to a server endpoint.
 * Returns the Response of the last chunk request.
 */
export async function uploadLastRecordingInChunks(
	endpointUrl: string,
	{
		fieldName = 'vidfile',
		filename = 'recording.webm',
		chunkSize = 1024 * 1024 * 5, // 5MB
		additionalData = {},
		fetchOptions = {},
		onProgress,
	}: UploadInChunksOptions = {},
): Promise<Response> {
	debugger;
	if (!lastRecordedBlob) {
		throw new Error('No recording available to upload.');
	}

	const totalSize = lastRecordedBlob.size;
	const totalChunks = Math.ceil(totalSize / chunkSize);

	// Unique ID for this upload (so the server can group chunks)
	const uploadId =
		Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);

	let uploadedBytes = 0;
	let lastResponse: Response | null = null;

	for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
		const start = chunkIndex * chunkSize;
		const end = Math.min(start + chunkSize, totalSize);
		const chunk = lastRecordedBlob.slice(start, end);

		const formData = new FormData();
		formData.append(fieldName, chunk, filename);

		// Chunk metadata
		formData.append('uploadId', uploadId);
		formData.append('chunkIndex', chunkIndex.toString());
		formData.append('totalChunks', totalChunks.toString());
		formData.append('originalFilename', filename);

		// Any extra fields you want (string or Blob)
		Object.entries(additionalData).forEach(([key, value]) => {
			if (typeof value === 'string') formData.append(key, value);
			else formData.append(key, value);
		});

		const response = await fetch(endpointUrl, {
			method: 'POST',
			body: formData,
			...fetchOptions,
		});

		if (!response.ok) {
			throw new Error(
				`Chunk upload failed at index ${chunkIndex} with status ${response.status}`,
			);
		}

		lastResponse = response;

		uploadedBytes = end;
		if (typeof onProgress === 'function') {
			const progress = uploadedBytes / totalSize;
			onProgress(progress, {
				uploadedBytes,
				totalBytes: totalSize,
				chunkIndex,
				totalChunks,
				uploadId,
			});
		}
	}

	// totalChunks is at least 1 when size>0, but keep a safe fallback
	if (!lastResponse) {
		throw new Error('Upload did not start (empty blob?).');
	}

	return lastResponse;
}

/**
 * Stop the current media stream (camera/mic).
 * Useful when leaving the page or after user is done.
 */
export function stopMediaStream(): void {
	if (mediaStream) {
		mediaStream.getTracks().forEach((track) => track.stop());
		mediaStream = null;
	}
}

/**
 * Check if the browser supports MediaRecorder.
 */
export function isMediaRecorderSupported(): boolean {
	return typeof MediaRecorder !== 'undefined';
}
