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
	gender: 'female' | 'male' | 'other';
	community: string;
	birthday: string;
	age: number;
	agegroup: 'child' | 'adult';
	datatransfer: 'server' | 'both';
	videoExtension: 'mov' | 'webm';
	// PROLIFIC_PID: string;
	// coupon: string;
	initialTimestamp: Date;
	endingTimestamp: Date;
	completionTimeMS: number;
	completionTimeM: string;
	quitBeforeEnd: boolean;
	totalSlides: number;
	slideCounter: number;
	previousSlide: string;
	currentSlide: string;
	nextSlide: string;
	currentProcedure: string[];
	animalSlideCounter: number;
	procedure: {
		sIntroduction: {
			duration: number;
		};
		sCow: {
			duration: number;
			response: string;
			slideNr: number;
		};
		sPig: {
			duration: number;
			response: string;
			slideNr: number;
		};
		sSheep: {
			duration: number;
			response: string;
			slideNr: number;
		};
	};
};
