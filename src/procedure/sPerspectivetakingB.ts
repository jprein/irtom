import { sRunnerYesNo } from './sRunnerYesNo';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'no';

	// Run trial
	await sRunnerYesNo(currentSlide, previousSlide, 's-perspectivetaking-b');
};
