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
	preFetchedVideoBlobs: (Record<string, string> | { keep: boolean })[];
	pindaNeutralBlob: string;
	textIntroBlob: string;
	textIntroBlob2: string;
	textIntroBlob3: string;
	audioIntroBlob: string;
	audioIntroBlob2: string;
	audioIntroBlob3: string;
	react1Blob: string;
	react2Blob: string;
	react3Blob: string;
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
	// animalOrder: string[];
	companionOrder: string[];
	foodOrder: string[];
	controlOrder: string[];
	animalSlideCounter: number;
	procedure: {
		sIntroduction: {
			duration: number;
		};
		sCow: {
			duration: number;
			response: string;
		};
		sPig: {
			duration: number;
			response: string;
		};
		sSheep: {
			duration: number;
			response: string;
		};
	};
};
