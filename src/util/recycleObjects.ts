import Toastify from 'toastify-js';
import { copyAttributes } from './copyAttributes';
import _ from 'lodash';

export const recycleObjects = () => {
	// get all placeholder elements that start with "ph-"
	const placeholderObjects = document.querySelectorAll('[id^="ph-"]');
	// get ids as string and remove ph- prefix and sort array
	const placeholderObjectIds = Array.from(placeholderObjects)
		.map((e) => e.id.replace('ph-', ''))
		.sort();
	// get all link elements that start with "link-"
	const linkedObjects = document.querySelectorAll('[id^="link-"]');
	// get ids as string and remove link- prefix and sort array
	const linkedObjectIds = Array.from(linkedObjects)
		.map((e) => e.id.replace('link-', ''))
		.sort();

	// check for missmatching/widowed placeholder and link ids
	const widowedPlaceholderIds = _.difference(
		placeholderObjectIds,
		linkedObjectIds,
	);
	const widowedlinkedObjectIds = _.difference(
		linkedObjectIds,
		placeholderObjectIds,
	);

	const widowedIds = [...widowedPlaceholderIds, ...widowedlinkedObjectIds];

	if (widowedIds.length > 0) {
		Toastify({
			text: `⚮ Found widowed object recycling ids: ${widowedIds.length}. Check console!`,
			duration: 5000,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			className: 'toast-info',
		}).showToast();
	}

	if (widowedPlaceholderIds.length > 0) {
		console.warn(
			"You are using placeholder ids that don't have a matching link counterpart in the SVG!",
			'Placeholder ids without matching link id:',
			widowedPlaceholderIds,
		);
	}

	if (widowedlinkedObjectIds.length > 0) {
		console.warn(
			"You are using link ids that don't have a matching placeholder counterpart in the SVG!",
			'Link ids without matching link id:',
			widowedlinkedObjectIds,
		);
	}

	// this should never fire, because of the previous checks, if it fires, I don't know ...
	if (!_.isEqual([...placeholderObjectIds], [...linkedObjectIds])) {
		console.warn('Placeholder and link ids do not match! 🤷');
	}

	// copy attributes from placeholder to link
	placeholderObjectIds.forEach((id) => {
		copyAttributes(
			document.getElementById(`ph-${id}`)!,
			document.getElementById(`link-${id}`)!,
			['fill', 'opacity'],
			['overflow', 'transform'],
		);
	});

	// remove placeholder SVG DOM elements
	placeholderObjectIds.forEach((id) => {
		document.getElementById(`ph-${id}`)!.remove();
	});
};
