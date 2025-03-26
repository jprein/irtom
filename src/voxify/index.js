import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { parse } from 'svgson';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// original svg file from Illustrator
const svgPath = path.resolve(__dirname, '../assets/experiment.svg');

// load svg file
const svgPlainText = await fs.readFile(svgPath, 'utf8');

let voxSvg = svgPlainText
	.replace(/png/g, 'svg') // replace png with svg
	.replace(/xlink:href="(?=.*\.svg")/g, 'xlink:href="assets/') // prepend path to svg files
	.replace(/<use/g, '<image') // replace <use with <image
	.replace('<svg', '<svg voxified="true"'); // add postprocess flag

const svgDom = await parse(voxSvg);

// delete first child
// svgDom.children.shift();

// get child element with tag def
const defs = svgDom.children.find((child) => child.name === 'defs');

// get all image elements
const images = defs.children.filter((child) => child.name === 'image');

// Create a lookup mapping of image id to url
// { image: 'assets/sheep.svg', image1: 'assets/human.svg', ... }
const imageIdUrlMapping = images.reduce((acc, curr) => {
	const id = curr.attributes.id;
	const url = curr.attributes['xlink:href'];
	acc[id] = url;
	return acc;
}, {});

// console.log(imageIdUrlMapping);

// replace all instances of the voxSVG #image number with the actual url
voxSvg = voxSvg.replace(/#image\d*/g, (match) => {
	const id = match.slice(1);
	console.log(id, '=>', imageIdUrlMapping[id]);
	return imageIdUrlMapping[id];
});

// fs.writeFile(path.resolve(__dirname, '../assets/experiment-voxified.svg'), stringify(svgDom));
fs.writeFile(
	path.resolve(__dirname, '../assets/experiment-voxified.svg'),
	voxSvg
);

console.log('------------------------------------------------------------');
console.log('🦊 Voxified SVG file saved to assets/experiment-voxified.svg');
console.log('------------------------------------------------------------\n');
