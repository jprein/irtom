import { sRunnerTwoOptionsA } from './sRunnerTwoOptionsA';

export default async ({ currentSlide, previousSlide }) => {
	// Store correct response 
	data.procedure[data.currentSlide].correct = 'right';

	// Run trial
	await sRunnerTwoOptionsA(currentSlide, previousSlide, 's-sofalsebelief-a');
};
