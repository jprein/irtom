import config from '../config.yaml';
import Toastify from 'toastify-js';
import { buttonTranslations } from '../translations';
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
	showUploadFallbackBanner?: boolean;
}

export const persistStudyData = async ({
	csvId,
	videoId = data.id,
	hasRecordedVideo = false,
	saveCsv = true,
	saveVideo = true,
	showUploadFallbackBanner = false,
}: PersistStudyDataOptions = {}) => {
	const datatransfer = data.datatransfer;
	let didDownloadCsvFallback = false;
	let didDownloadWebcamFallback = false;
	let didShowUploadFallbackBanner = false;
	const shouldPersistCsv = saveCsv;
	const shouldPersistVideo = saveVideo && hasRecordedVideo;
	const csvSnapshot = buildCsvSnapshot(data);
	const communityKey =
		data.community as keyof typeof buttonTranslations.uploadFallbackDownload;
	const uploadFallbackBannerText =
		buttonTranslations.uploadFallbackDownload[communityKey] ??
		buttonTranslations.uploadFallbackDownload.english;

	const showUploadFallbackBannerOnce = () => {
		if (!showUploadFallbackBanner || didShowUploadFallbackBanner) {
			return;
		}

		Toastify({
			text: uploadFallbackBannerText,
			duration: 5000,
			gravity: 'top',
			position: 'center',
			close: true,
			stopOnFocus: true,
			className: 'toast-error',
		}).showToast();

		didShowUploadFallbackBanner = true;
	};

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
			showUploadFallbackBannerOnce();
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
			showUploadFallbackBannerOnce();
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
