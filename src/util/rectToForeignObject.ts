/**
 * Iterates over DOM for elements that start with an id of "text-".
 * Those elements get replace replaced with a foreignObject element while
 * keeping their original properties.
 *
 * @param parentId - The parent element id as string (defaults to 'svg')
 * @returns All direct children of the parent element
 */
export const rectToForeignObject = () => {
	// get all rect nodes that start with id "text-"
	const rectNodes = Array.from(
		document.querySelectorAll('[id^="text-"], #s-pv, #s-pv-neutral, #s-bs'),
	);
	rectNodes.forEach((rect) => {
		const fo = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'foreignObject',
		);
		// copy all attributes from rect to new foreignObject
		[...rect.attributes].map(({ name, value }) => fo.setAttribute(name, value));

		// remove attributes that are not needed for foreignObject
		fo.removeAttribute('fill');
		fo.removeAttribute('opacity');
		fo.removeAttribute('stroke');
		fo.removeAttribute('stroke-width');
		fo.removeAttribute('stroke-miterlimit');

		// replace rect with foreignObject
		rect.replaceWith(fo);
	});
};
