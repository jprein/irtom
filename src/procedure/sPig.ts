import { sAnimalCodeRunner } from './sAnimalCodeRunner';

export default async ({ currentSlide, previousSlide }) => {
	await sAnimalCodeRunner(currentSlide, previousSlide, 's-pig');
};
