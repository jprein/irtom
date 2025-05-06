import { sRunnerTwoOptions } from './sRunnerTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'right';

	// Run trial
	await sRunnerTwoOptions(currentSlide, previousSlide, 's-perspectivetaking-g');
};
