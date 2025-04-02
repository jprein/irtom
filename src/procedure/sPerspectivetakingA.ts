import { sRunnerYesNoResponse } from './sRunnerYesNoResponse';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'yes';

	// Run trial
	await sRunnerYesNoResponse(currentSlide, previousSlide, 's-perspectivetaking-a');
};
