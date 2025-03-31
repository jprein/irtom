import { sRunner } from './sRunner';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'yes';

	// Run trial
	await sRunner(currentSlide, previousSlide, 's-perspectivetaking');
};
