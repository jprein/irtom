import { play, playPromise } from '../util/audio';
import { getResponse } from '../util/getResponse';
import { swapSlides } from '../util/slideVisibility';

export default async ({ currentSlide, previousSlide }) => {
	// swap slides automatically (don’t touch this)
	swapSlides(currentSlide, previousSlide);

	// your expirimental logic goes here
	await playPromise(`./communities/${data.community}/audio/s-cow.mp3`);
	play(`./communities/${data.community}/audio/s-cow.mp3`, 'link-s-cow-headphones');

	// save responses and store to response object
	const response = await getResponse(['link-s-cow-yes', 'link-s-cow-no']);
	console.log(response.id);
	data.procedure[data.currentSlide] = {
		response: response.id,
	};
};
