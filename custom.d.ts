declare module '*.yaml' {
	const content: any;
	export default content;
}

declare module '*.svg' {
	const content: any;
	export default content;
}

declare module '*.png' {
	const content: any;
	export default content;
}

declare module '*.gif' {
	const content: any;
	export default content;
}

declare module '*.mp3' {
	const content: any;
	export default content;
}

declare module '*.webm' {
	const content: any;
	export default content;
}

declare let data: {
	id: string;
	community: string;
	datatransfer: 'server' | 'local' | 'both';
	webcam: boolean;
	hasWebcam: boolean;
	browserName: string;
	osName: string;
	safari: boolean;
	isIOS: boolean;
	t0: Date;
	t1: Date;
	startTime: string;
	endTime: string;
	completionTimeMin: string;
	totalSlides: number;
	previousSlide: string;
	currentSlide: string;
	nextSlide: string;
	currentProcedure: string[];
	slideCounter: number;
	simpleSlideCounter: number;
	emoji: 'yellow' | 'blue' | 'purple';
	sprite;
	spriteJSON;
	clickedRepeat: boolean;
	incorrectResponse: boolean;
	procedure: {
		sIntroduction: {
			trialNr: number;
			trialDurationSec: number;
			responseTimeSec: number;
			correct: string;
			response: string;
			score: number;
		};
		sPerspectivetaking: {
			trialNr: number;
			trialDurationSec: number;
			responseTimeSec: number;
			correct: string;
			response: string;
			score: number;
		};
		sEnd: {
			trialNr: number;
			trialDurationSec: number;
			responseTimeSec: number;
			correct: string;
			response: string;
			score: number;
		};
	};
};
