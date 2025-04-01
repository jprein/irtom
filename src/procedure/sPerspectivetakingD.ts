import { sRunnerYesNo } from './sRunnerYesNo';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'yes';

	// Run trial
	await sRunnerYesNo(currentSlide, previousSlide, 's-perspectivetaking-d');
};
