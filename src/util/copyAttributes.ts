import _ from 'lodash';
import Toastify from 'toastify-js';

/**
 * Copies all attributes from one HTML/SVG DOM element to another.
 *
 * @param source - The HTML/SVG DOM element you want to copy the attributes from
 * @param target - The HTML/SVG DOM element you want to copy the attributes to
 * @param skip - A string array of attributes you want to skip from the source, which should not be copied to the target
 * @param drop - A string array of attributes you want to drop/delete from the target
 *
 * @remarks
 * This is a TypeScript version of this: https://bobbyhadz.com/blog/javascript-copy-all-attributes-from-one-element-to-another
 *
 *
 * @example **Copy all attributes from one element to another**
 * ```js
 * const box1 = document.getElementById('box1');
 * const box2 = document.getElementById('box1');
 * copyAttributes(box1, box2);
 * ```
 *
 * @example **Copy all attributes from one element to another, but skip height**
 * ```js
 * const box1 = document.getElementById('box1');
 * const box2 = document.getElementById('box1');
 * copyAttributes(box1, box2, ['height']);
 * ```
 *
 * @example **Copy all attributes from one element to another, but skip height, and remove fill from target**
 * ```js
 * const box1 = document.getElementById('box1');
 * const box2 = document.getElementById('box1');
 * copyAttributes(box1, box2, ['height'], ['fill']]);
 * ```
 */
export const copyAttributes = (
	source: Element,
	target: Element,
	skip?: string[],
	drop?: string[],
) => {
	// get source attributes
	const sourceAttributes = Array.from(source.attributes);

	// get target attributes (for dropping only)
	const targetAttributes = Array.from(target.attributes);

	// check if there are intersecting elements for drop and skip, becuase they should be XOR
	if (_.intersection(skip, drop).length > 0) {
		Toastify({
			text: `You have defined elements in both skip and drop. This is not allowed!`,
			duration: 5000,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			className: 'toast-info',
		}).showToast();
		throw Error(
			'You have defined elements in both skip and drop. This is not allowed!',
		);
	}

	sourceAttributes.forEach((attribute: Attr) => {
		// always assign source id to data-source-id in target to avoid multiple elements with same id
		if (attribute.nodeName === 'id') {
			target.setAttribute('data-source-id', attribute.nodeValue!);
			return;
		}

		// optionally, skip values from source which are not needed in target
		if (skip && skip.includes(attribute.nodeName)) {
			return;
		}

		// set current attribute to target
		target.setAttribute(attribute.nodeName, attribute.nodeValue!);
	});

	// optionally, drop values from target which are not needed
	targetAttributes.forEach((attribute: Attr) => {
		if (drop && drop.includes(attribute.nodeName)) {
			target.removeAttribute(attribute.nodeName);
		}
	});
};
