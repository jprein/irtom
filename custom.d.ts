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
	coupon: string;
	PROLIFIC_PID: string;
	agegroup: 'child' | 'adult';
	input: 'audio' | 'text' | 'userchoice-audio' | 'userchoice-text';
	datatransfer: 'server' | 'both';
	gender: 'female' | 'male' | 'other';
	birthday: string;
	age: number;
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
	experimentPaceRawMs: number;
	experimentPaceHr: string;
	quitBeforeEnd: boolean;
	totalSlides: number;
	slideCounter: number;
	previousSlide: string;
	currentSlide: string;
	nextSlide: string;
	currentProcedure: string[];
	animalOrder: string[];
	dilemmaOrder: string[];
	dilemmaMotivationOnePlayed: boolean;
	dilemmaMotivationTwoPlayed: boolean;
	companionOrder: string[];
	foodOrder: string[];
	controlOrder: string[];
	animalSlideCounter: number;
	rankingSlideCounter: number;
	reasoningSlideCounter: number;
	meta: Record<string, string | boolean | number>;
	procedure: {
		sIntroduction: {
			duration: number;
		};
		sHuman: {
			duration: number;
			response: string;
		};
		sHumanNam: {
			duration: number;
			response: string;
		};
		sHumanPe: {
			duration: number;
			response: string;
		};
		sHumanIdj: {
			duration: number;
			response: string;
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
		sGiraffe: {
			duration: number;
			response: string;
		};
		sChicken: {
			duration: number;
			response: string;
		};
		sCat: {
			duration: number;
			response: string;
		};
		sCats: {
			duration: number;
			response: string;
		};
		sDog: {
			duration: number;
			response: string;
		};
		sDogs: {
			duration: number;
			response: string;
		};
		sRabbit: {
			duration: number;
			response: string;
		};
		sGoldfish: {
			duration: number;
			response: string;
		};
		sGoat: {
			duration: number;
			response: string;
		};
		sDuiker: {
			duration: number;
			response: string;
		};
		sHare: {
			duration: number;
			response: string;
		};
		sKudu: {
			duration: number;
			response: string;
		};
		sJackal: {
			duration: number;
			response: string;
		};
		sParrot: {
			duration: number;
			response: string;
		};
		sTurkey: {
			duration: number;
			response: string;
		};
		sCatfish: {
			duration: number;
			response: string;
		};
		sMcIntro: {
			completed: boolean;
		};
		sBallAnimation: {
			order: string[];
			completed: boolean;
		};
		sBallPractice: {
			duration: number;
			addExplanationCount: number;
			order: string[];
			inner: string;
			middle: string;
			outer: string;
			completed: boolean;
		};
		sTask: {
			duration: number;
			knownAnimals: string[];
			unknownAnimals: string[];
			human: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			chicken?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			pig?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			dog?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			sheep?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			goldfish?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cow?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			rabbit?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			knownAnimalOrder: string[];
			comprehension: {
				completed: boolean;
				order: string[];
				inner: boolean;
				middle: boolean;
				outer: boolean;
			};
		};
		sTaskPe: {
			duration: number;
			knownAnimals: string[];
			unknownAnimals: string[];
			humanpe: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			chicken?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			pig?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			dog?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			turkey?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			parrot?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cow?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			rabbit?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			knownAnimalOrder: string[];
			comprehension: {
				completed: boolean;
				order: string[];
				inner: boolean;
				middle: boolean;
				outer: boolean;
			};
		};
		sTaskIdj: {
			duration: number;
			knownAnimals: string[];
			unknownAnimals: string[];
			humanidj: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			chicken?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			catfish?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			dog?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			goat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			parrot?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cow?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			goldfish?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			knownAnimalOrder: string[];
			comprehension: {
				completed: boolean;
				order: string[];
				inner: boolean;
				middle: boolean;
				outer: boolean;
			};
		};
		sTaskNam: {
			duration: number;
			knownAnimals: string[];
			unknownAnimals: string[];
			humannam: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			chicken?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			duiker?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			dog?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			goat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			kudu?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			jackal?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			giraffe?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			knownAnimalOrder: string[];
			comprehension: {
				completed: boolean;
				order: string[];
				inner: boolean;
				middle: boolean;
				outer: boolean;
			};
		};
		sTaskZm: {
			duration: number;
			knownAnimals: string[];
			unknownAnimals: string[];
			humanzm: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			chicken?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cow?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			dog?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			goat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cats?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			dogs?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			hare?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			cat?: {
				circle: 'inner' | 'middle' | 'outer' | undefined;
				coords: { x: number; y: number };
			};
			knownAnimalOrder: string[];
			comprehension: {
				completed: boolean;
				order: string[];
				inner: boolean;
				middle: boolean;
				outer: boolean;
			};
		};
		sMeaning: {
			duration: number;
			input: 'text' | 'audio' | 'userchoice-audio' | 'userchoice-text';
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
			textExplanation: boolean;
		};
		sPracticeDilemma: {
			duration: number;
			response: string;
			completed: boolean;
		};
		sPracticeDilemmaNzm: {
			duration: number;
			response: string;
			completed: boolean;
		};
		s1Hu1Co: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Pe1Ch: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Zm1Ch: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Nm1Du: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Ij1Ch: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Hu1Ca: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Ij1Ca: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Nm1Do: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Pe1Do: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Zm1Do: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Ca1Co: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Ca1Ch: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Do1Ch: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Zd1Zc: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		s1Do1Du: {
			duration: number;
			response: string;
			swapLeftRight: boolean;
		};
		sQuThoughtsComp: {
			response: string;
		};
		sQuFeelingsComp: {
			response: string;
		};
		sQuRankingIntelligence: {
			response: string;
			duration: number;
			order: string[];
			cow: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			human: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingIntelligenceIdj: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanIdj: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingIntelligencePe: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanPe: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingIntelligenceNam: {
			response: string;
			duration: number;
			order: string[];
			duiker: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanNam: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingIntelligenceZm: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanZm: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingPain: {
			response: string;
			duration: number;
			order: string[];
			cow: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			human: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingPainIdj: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanIdj: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingPainPe: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanPe: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingPainNam: {
			response: string;
			duration: number;
			order: string[];
			duiker: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanNam: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingPainZm: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanZm: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingFeelings: {
			response: string;
			duration: number;
			order: string[];
			cow: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			human: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingFeelingsPe: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanPe: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingFeelingsNam: {
			response: string;
			duration: number;
			order: string[];
			duiker: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanNam: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingFeelingsIdj: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanIdj: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingFeelingsZm: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			humanZm: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingSimilarity: {
			response: string;
			duration: number;
			order: string[];
			cow: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingSimilarityPe: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingSimilarityIdj: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingSimilarityNam: {
			response: string;
			duration: number;
			order: string[];
			duiker: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingSimilarityZm: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingExposure: {
			response: string;
			duration: number;
			order: string[];
			cow: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingExposureIdj: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			cat: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingExposurePe: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingExposureNam: {
			response: string;
			duration: number;
			order: string[];
			duiker: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sQuRankingExposureZm: {
			response: string;
			duration: number;
			order: string[];
			chicken: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
			dog: {
				position: 0 | 1 | 2 | 3 | 4;
				coords: { x: number; y: number };
			};
		};
		sReasoning1Hu1Co: {
			duration: number;
			input: 'text' | 'audio' | 'userchoice-audio' | 'userchoice-text';
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
			textExplanation: boolean;
		};
		sReasoning1Nm1Du: {
			duration: number;
			input: 'text' | 'audio' | 'userchoice-audio' | 'userchoice-text';
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
			textExplanation: boolean;
		};
		sReasoning1Pe1Ch: {
			duration: number;
			input: 'text' | 'audio' | 'userchoice-audio' | 'userchoice-text';
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
			textExplanation: boolean;
		};
		sReasoning1Zm1Ch: {
			duration: number;
			input: 'text' | 'audio' | 'userchoice-audio' | 'userchoice-text';
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
			textExplanation: boolean;
		};
		sReasoning1Ij1Ch: {
			duration: number;
			input: 'text' | 'audio' | 'userchoice-audio' | 'userchoice-text';
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
			textExplanation: boolean;
		};
		sReasoning1Hu1Ca: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Ij1Ca: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Pe1Do: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Zm1Do: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Nm1Do: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Ca1Co: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Ca1Ch: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Do1Ch: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Zd1Zc: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
		sReasoning1Do1Du: {
			response: string;
			duration: number;
			textInput: string;
			isText: boolean;
			isVoice: boolean;
			voiceExplanation: boolean;
		};
	};
};
