import _ from 'lodash';
import { translations } from '../translations';
import Toastify from 'toastify-js';

export const widowedKeyChecker = () => {
	// get all foreignObjects whose ids starts with 'text-'
	const foreignObjectNodeList = document.querySelectorAll(
		'foreignObject[id^="text-"]',
	) as NodeListOf<SVGForeignObjectElement>;

	// remove text- prefix and Illustrator hash
	// In newer versions, Illustrotor adds an incremental counter for duplicated ids (myId, myId1, myId2, ...)
	// this we will replace everything after the variable name
	let foreignObjectKeys = [...foreignObjectNodeList].map((e) => {
		return (
			e.id
				// replace 'text-' with ''
				.replace('text-', '')
				// remove all digits
				.replace(/\d/g, '')
		);
	});

	// make them unique
	foreignObjectKeys = _.uniq(foreignObjectKeys);

	const translationKeys = Object.keys(translations);
	console.log({ translationKeys, foreignObjectKeys });

	const widowedTranslationKeys = _.difference(
		translationKeys,
		foreignObjectKeys,
	);
	const widowedForeignObjectKeys = _.difference(
		foreignObjectKeys,
		translationKeys,
	);
	const widowedKeys = [...widowedTranslationKeys, ...widowedForeignObjectKeys];

	if (widowedKeys.length > 0) {
		Toastify({
			text: `⚮ Found widowed translation/fo keys: ${widowedKeys.length}. Check console!`,
			duration: 5000,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			className: 'toast-info',
		}).showToast();
	}

	if (widowedTranslationKeys.length > 0) {
		console.warn(
			"You are using translation ids (keys) that don't have a matching counterpart in the SVG!",
			'Present translation ids without matching SVG ids:',
			widowedTranslationKeys,
		);
	}

	if (widowedForeignObjectKeys.length > 0) {
		console.warn(
			"You are using SVG ids that don't have a matching translation id!",
			'Present SVG ids without matching translation ids:',
			widowedForeignObjectKeys,
		);
	}

	// const textKeys = _.intersection(translationKeys, foreignObjectKeys);
	// console.log(
	// 	'Following keys are present in both translation file and SVG composition and can be used for text elements:',
	// 	textKeys
	// );

	// note that _.intersection() will remove duplicates in foreignObjectKeys due to the hash removal
	return _.intersection(translationKeys, foreignObjectKeys);
};
