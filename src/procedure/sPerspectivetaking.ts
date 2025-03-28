import { sRunner } from './sRunner';

export default async ({ currentSlide, previousSlide }) => {
	await sRunner(currentSlide, previousSlide, 's-perspectivetaking');
};
