// import { SvgInHtml } from '../types';
// type PrefetchVideoObject = Array<{ [index: string]: string } | { global: boolean }>;

// // Usage:
// const myObject: PrefetchVideoObject = [
// 	{ intro: 'intro.web' },
// 	{ outro: 'outro.webm', global: false },
// 	{ middle: 'middle.webm', global: true },
// ];

// export const prefetchAssets = async (videoObj: PrefetchVideoObject) => {
// 	// get blocking slide and remove visibility
// 	const parentBlock = document.getElementById('s-blocking-state') as SvgInHtml;
// 	parentBlock.removeAttribute('visibility');

// 	console.log(Object.entries(videoObj));

// 	// iterate over videoObj and fetch each video
// 	for (const [i, video] of Object.entries(videoObj)) {
// 		console.log(Object.keys(video));
// 		console.log(Object.values(video));
// 	}

// 	const preloadVideo = await fetch(
// 		`./communities/${data.community}/video/s-introduction.${data.videoExtension}`
// 	);
// 	const blob = await preloadVideo.blob();
// 	const url = URL.createObjectURL(blob);
// 	parentBlock.setAttribute('visibility', 'hidden');
// };
