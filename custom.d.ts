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
	gender: 'female' | 'male' | 'diverse';
	community: string;
	birthday: string;
	age: number;
	agegroup: 'child' | 'adult';
	datatransfer: 'server' | 'local' |'both';
	videoExtension: 'mov' | 'webm';
	// PROLIFIC_PID: string;
	// coupon: string;
	t0: Date;
	t1: Date;
	startTime: string;
	endTime: string;
	completionTime: string;
	quitBeforeEnd: boolean;
	totalSlides: number;
	slideCounter: number;
	previousSlide: string;
	currentSlide: string;
	nextSlide: string;
	currentProcedure: string[];
	simpleSlideCounter: number;
	procedure: {
		sIntroduction: {
			slideNr: number;
			slideDuration: number;
			correct: string;
			response: string;
			score: number;
		};
		sPerspectivetaking: {
			slideNr: number;
			slideDuration: number;
			correct: string;
			response: string;
			score: number;
		};
		sEnd: {
			slideNr: number;
			slideDuration: number;
			correct: string;
			response: string;
			score: number;
		};
	};
};
