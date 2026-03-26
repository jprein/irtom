import config from '../config.yaml';
import {
	buildCsvSnapshot,
	downloadCsv,
	downloadWebcamVideo,
	sleep,
	uploadCsv,
	uploadWebcamVideo,
} from './helpers';

interface PersistStudyDataOptions {
	csvId?: string;
	videoId?: string;
	hasRecordedVideo?: boolean;
	saveCsv?: boolean;
	saveVideo?: boolean;
}

export const persistStudyData = async ({
	csvId,
	videoId = data.id,
	hasRecordedVideo = false,
	saveCsv = true,
	saveVideo = true,
}: PersistStudyDataOptions = {}) => {
	const datatransfer = data.datatransfer;
	let didDownloadCsvFallback = false;
	let didDownloadWebcamFallback = false;
	const shouldPersistCsv = saveCsv;
	const shouldPersistVideo = saveVideo && hasRecordedVideo;
	const csvSnapshot = buildCsvSnapshot(data);

	const ensureCsvUploaded = async () => {
		if (!shouldPersistCsv || datatransfer === 'local') return;
		try {
			await uploadCsv(csvSnapshot, csvId);
		} catch (error) {
			if (config.devmode.on) {
				console.warn(
					'CSV upload failed. Downloading CSV locally as fallback.',
					error
				);
			}
			await downloadCsv(csvSnapshot, csvId);
			didDownloadCsvFallback = true;
		}
	};

	const ensureWebcamUploaded = async () => {
		if (datatransfer === 'local' || !shouldPersistVideo) return;
		try {
			await uploadWebcamVideo(hasRecordedVideo, videoId);
		} catch (error) {
			if (config.devmode.on) {
				console.warn(
					'Video upload failed. Downloading video locally as fallback.',
					error
				);
			}
			await downloadWebcamVideo(hasRecordedVideo, videoId);
			didDownloadWebcamFallback = true;
		}
	};

	if (datatransfer === 'local') {
		if (shouldPersistCsv) {
			await downloadCsv(csvSnapshot, csvId);
			await sleep(2000);
		}
		if (shouldPersistVideo) {
			await downloadWebcamVideo(hasRecordedVideo, videoId);
			await sleep(1000);
		}
	} else if (datatransfer === 'server') {
		await ensureCsvUploaded();
		if (shouldPersistVideo) {
			await sleep(1000);
			await ensureWebcamUploaded();
			await sleep(2000);
		}
	} else {
		await ensureCsvUploaded();
		if (shouldPersistVideo) {
			await sleep(1000);
			await ensureWebcamUploaded();
			await sleep(1000);
		}
		if (shouldPersistCsv && !didDownloadCsvFallback) {
			await downloadCsv(csvSnapshot, csvId);
		}
		if (shouldPersistVideo) {
			await sleep(1000);
			if (!didDownloadWebcamFallback) {
				await downloadWebcamVideo(hasRecordedVideo, videoId);
			}
			await sleep(1000);
		}
	}
};
