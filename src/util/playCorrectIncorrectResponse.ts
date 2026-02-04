export async function playCorrectIncorrectResponse(currentSlide: string) {
	// If correct response, play correct audio and move on to next trial
	if (data.procedure[data.currentSlide].score === 1) {
		await data.sprite.playPromise(`${currentSlide}-correct`);
	}
	// If incorrect response, reset score, play incorrect audio and repeat trial
	else if (data.procedure[data.currentSlide].score === 0) {
		await data.sprite.playPromise(`${currentSlide}-incorrect`);
	}
}
