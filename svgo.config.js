export default {
	// don't load preset-default as this is to aggressive
	// full list: https://github.com/svg/svgo#built-in-plugins
	plugins: [
		'cleanupAttrs',
		'mergeStyles',
		'inlineStyles',
		'removeDoctype',
		'removeXMLProcInst',
		'removeComments',
		'removeMetadata',
		'removeTitle',
		'removeDesc',
		'removeUselessDefs',
		'removeXMLNS',
		'removeEditorsNSData',
		'removeEmptyAttrs',
		// 'removeHiddenElems', // can be dangerous,
		'removeEmptyText',
		// 'removeEmptyContainers', // required for transition slides which are empty groups
		// 'removeViewBox', // can be dangerous
		'cleanupEnableBackground',
		'minifyStyles',
		'convertStyleToAttrs',
		'convertColors',
		'convertPathData',
		'convertTransform',
		// 'removeUnknownsAndDefaults', // may interfere with gsap!
		'removeNonInheritableGroupAttrs',
		'removeUselessStrokeAndFill',
		'removeUnusedNS',
		// 'prefixIds', // this will kill ids as defined in illustrator. not good.
		// 'cleanupIDs', // this will kill ids as defined in illustrator. not good.
		'cleanupNumericValues',
		'cleanupListOfValues',
		'moveElemsAttrsToGroup', // observe if this is dangerous
		'moveGroupAttrsToElems',
		// 'collapseGroups', // probably good, collapses groups without an id
		// 'removeRasterImages'
		'mergePaths',
		// 'convertShapeToPath', // this kills 'rect' elements and thus foreignObject. not good.
		'convertEllipseToCircle',
		// 'sortAttrs' // not needed, as we don't need to read the svg nicely
		'sortDefsChildren',
		// 'removeDimensions', can be dangerous
		// 'removeAttrs', // can be dangerous and needs to be configured
		// 'removeAttributesBySelector', // can be dangerous and needs to be configured
		// 'addClassesToSVGElement', // not needed
		// 'addAttributesToSVGElement', // not needed
		// 'removeOffCanvasPaths', // not needed and can be tricky if you rely on off-canvas paths
		// 'removeStyleElement', // maybe dangerous
		// 'removeScriptElement', // maybe dangerous
		// 'reusePaths', // not needed
	],
};
