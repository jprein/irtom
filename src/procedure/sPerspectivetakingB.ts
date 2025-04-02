import { sRunnerYesNoResponse } from './sRunnerYesNoResponse';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'no';

	// Run trial
	await sRunnerYesNoResponse(currentSlide, previousSlide, 's-perspectivetaking-b');
};
