import type { SvgInHtml } from '../types';
import { gsap } from 'gsap';
import config from '../config.yaml';

/**
 * Removes display="none" from all DOM elements
 */
export const removeDisplayNone = () => {
	document.querySelectorAll('[display="none"]').forEach((e) => {
		e.removeAttribute('display');
	});
};

/**
 * Receives a parent id as string and returns all child ids as string[]
 *
 * @param parentId - The parent element id as string (defaults to 'svg')
 * @returns All direct children of the parent element
 */
export const getChildrenFromParent = (parentId = 'svg') => {
	const parent = document.getElementById(parentId) as SvgInHtml;
	// remove the defs element from the array, since this is not defined within Illustrator
	const childrenArray = [...parent.children].filter(
		(element) => !(element.tagName === 'defs')
	);
	let childIds = childrenArray.map((e) => e.id);
	if (childIds.filter((e) => e === '').length > 0) {
		console.warn(
			`IDs are missing in the first level of the SVG (see ${parentId}). Make sure those objects have an ID.`
		);
		childIds = childIds.filter(Boolean);
	}
	return childIds;
};

/**
 * Hides all direct children from a given parent id as string (defaults to 'svg').
 * Those are usually groups of you slides. Note that this function
 * only targets group elements `<g>`.
 *
 * @remarks
 * SVG’s `g` node can also be set to hidden (i.e., `visibility="hidden"`).
 *
 * @param parentId The parent element id as string
 * @returns void
 */
export const hideFirstChildSlides = (parentId = 'svg') => {
	const children = getChildrenFromParent(parentId);
	children.forEach((child) => {
		document.getElementById(child)!.setAttribute('visibility', 'hidden');
	});
};

/**
 * Hides all(!) subsequent children from a given parent id as string (defaults to 'svg').
 * Note that this function only targets group elements `<g>`.
 * The parent element itself is not hidden.
 *
 * @see {@link hideFirstChildSlides}
 *
 * @param parentId The parent element id as string
 * @returns void
 */
export const hideAllChildSlides = () => {
	const gNodes = document.querySelectorAll('g') as NodeListOf<SVGGElement>;
	// drop the first element, which is the parent 'svg' element
	const gChildNodes = [...gNodes].slice(1, gNodes.length);
	gChildNodes.forEach((child: SVGGElement) => {
		child.setAttribute('visibility', 'hidden');
	});
};

/**
 * Receives a single slide id as string, and hides all other sibling slides
 *
 * @param slideId - The slide you want to be displayed
 * @returns void
 */
export const showSingleSlide = (slideId: string) => {
	hideFirstChildSlides();
	document.getElementById(slideId)!.setAttribute('visibility', 'visible');
};

/**
 * Removes attribute and style propery `visibility` from a children of a given parent id
 *
 * @param parentSlide - The parent id
 * @returns void
 */
export const removeChildVisibiltyStyleAttribs = (parentSlide: string) => {
	const children = getChildrenFromParent(parentSlide);
	children.forEach((child) => {
		document.getElementById(child)!.removeAttribute('visibility');
		document.getElementById(child)!.removeAttribute('style');
	});
};

/**
 * Shows the all slideIds[] from first parameter and hides all slideIds[] from second
 *
 * @param visibleSlides - single slide id or an array of slides you want to display
 * @param hiddenSlides - single slide id or an array of slides you want to hide
 * @param fadeDurations - an array of two numbers, which define the fade out/in duration in seconds
 *
 * @remarks
 * If you use fadeDurations, provide a single parameter for visible/hiddenSlides. If you provide an array, only the first element will be used.
 *
 * @returns void
 */
export const swapSlides = (
	visibleSlides?: string | string[],
	hiddenSlides?: string | string[],
	fadeDurations?: [number, number]
) => {
	// if fadeDurations is missing and if in config slideTransition has override set to true
	// ... apply the fadeOut/fadeIn from config
	if (
		!fadeDurations &&
		config.slideTransition.override &&
		visibleSlides &&
		hiddenSlides
	) {
		fadeDurations = [
			config.slideTransition.fadeOut,
			config.slideTransition.fadeIn,
		];
	}

	// if fadeDurations is undefined, we use the visibility attribute to hide and show slides
	if (visibleSlides && !fadeDurations) {
		if (typeof visibleSlides === 'string') {
			visibleSlides = [visibleSlides];
		}
		visibleSlides.forEach((e) => {
			document.getElementById(e)!.setAttribute('visibility', 'visible');
		});
	}
	if (hiddenSlides && !fadeDurations) {
		if (typeof hiddenSlides === 'string') {
			hiddenSlides = [hiddenSlides];
		}
		hiddenSlides.forEach((e) => {
			document.getElementById(e)!.setAttribute('visibility', 'hidden');
		});

		const slideToHide =
			typeof hiddenSlides === 'string' ? hiddenSlides : hiddenSlides[0];
		removeChildVisibiltyStyleAttribs(slideToHide);
		document.getElementById(slideToHide)!.setAttribute('visibility', 'hidden');
		document.getElementById(slideToHide)!.removeAttribute('style');
	}
	// if fadeDurations is defined, we use GSAP to fade in and out between slides (using opacity)
	if (fadeDurations && visibleSlides) {
		// make sure to have a single string
		const slideToShow =
			typeof visibleSlides === 'string' ? visibleSlides : visibleSlides[0];
		let slideToHide = '';
		if (hiddenSlides) {
			slideToHide =
				typeof hiddenSlides === 'string' ? hiddenSlides : hiddenSlides[0];
		}

		// visibility hidden needs to be set always
		gsap.set(`#${slideToShow}`, { autoAlpha: 0 });

		const tl = gsap.timeline();

		if (slideToHide) {
			tl.to(`#${slideToHide}`, {
				autoAlpha: 0,
				duration: fadeDurations[0],
			});
		}

		tl.to(`#${slideToShow}`, {
			autoAlpha: 1,
			duration: fadeDurations[1],
			// clean-up DOM after animation
			onComplete: () => {
				// todo I may not need this anymore?
				if (slideToHide) {
					removeChildVisibiltyStyleAttribs(slideToHide);
					document
						.getElementById(slideToHide)!
						.setAttribute('visibility', 'hidden');
					document.getElementById(slideToHide)!.removeAttribute('style');
					document
						.getElementById(slideToShow)!
						.setAttribute('visibility', 'visible');
				}
			},
		});
	}
};
