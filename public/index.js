// check if URL Params already exist and store them
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

let id = '';
let community = '';
let birthday = '';
let gender = '';
let datatransfer = '';
let webcam = false;

if (params.has('id')) {
	id = params.get('id');
}
if (params.has('community')) {
	community = params.get('community');
}
if (params.has('birthday')) {
	birthday = params.get('birthday');
}
if (params.has('gender')) {
	gender = params.get('gender');
}
if (params.has('datatransfer')) {
	datatransfer = params.get('datatransfer');
}
if (params.has('webcam')) {
	webcam = params.get('webcam');
}

// WEBCAM YES OR NO?
const webcamOptions = document.getElementsByName('input-webcam');
console.log('webcamOptions');
console.log(webcamOptions);
for (const option of webcamOptions) {
	option.onclick = () => {
		if (option.checked) {
			webcam = option.value;
			console.log('webcam: ', webcam);
		}
	};
}

// remove all params from URL
window.history.pushState({}, document.title, window.location.pathname);

// show consent if adult
const handleDate = (e) => {
	let age = 0;
	if (typeof e.target === 'undefined') {
		age = calculateAge(Date.parse(e));
	} else {
		age = calculateAge(Date.parse(e.target.value));
	}
	const consentText = document.getElementById('consent');
	const consentCheckbox = document.getElementById('input-consent');
	if (age < 12) {
		consentText.style.display = 'none';
		consentCheckbox.required = false;
	} else {
		consentText.style.display = 'block';
		consentCheckbox.required = true;
		consentCheckbox.onclick = handleCheckbox;
	}
};

const handleCheckbox = (e) => {
	console.log(e.target.value);
	// handle checkbox for consent
};

const calculateAge = (birthday) => {
	const ageDiffMs = Date.now() - birthday;
	const ageDate = new Date(ageDiffMs);
	return ageDate.getUTCFullYear() - 1970;
};

// hide form fields for form data where URL params already existed
if (id) {
	const idElement = document.getElementById('input-id');
	idElement.required = false;
	idElement.parentNode.style.display = 'none';
}
if (community) {
	const communityElement = document.getElementById('input-community');
	communityElement.required = false;
	communityElement.parentNode.style.display = 'none';
	// hide video if community is not german
	if (community !== 'german' && community !== 'prolific-de-u') {
		document.querySelector('video').style.display = 'none';
	}
}
if (birthday) {
	const birthdayElement = document.getElementById('input-birthday');
	birthdayElement.required = false;
	birthdayElement.parentNode.style.display = 'none';
	handleDate(birthday);
}
if (gender) {
	const genderElement = document.getElementById('input-gender');
	genderElement.required = false;
	genderElement.parentNode.style.display = 'none';
}
if (datatransfer) {
	const datatransferElement = document.getElementById('input-datatransfer');
	datatransferElement.required = false;
	datatransferElement.parentElement.style.display = 'none';
}

// handle submit button
document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault();

	// use existing data if available, else use form data
	id = id ? id : document.getElementById('input-id').value;
	community = community
		? community
		: document.getElementById('input-community').value;
	birthday = birthday
		? birthday
		: document.getElementById('input-birthday').value;

	// use mappings since otherwise you may run intro translation issues when localizing landing page
	let genderIndex = '';
	if (!gender) {
		genderIndex = document.getElementById('input-gender').selectedIndex;
	}
	let datatransferIndex = '';
	if (!datatransfer) {
		datatransferIndex =
			document.getElementById('input-datatransfer').selectedIndex;
	}

	// mapping (key value lookup) for gender, input and datatransfer
	const genderMapping = new Map()
		.set(1, 'female')
		.set(2, 'male')
		.set(3, 'diverse');
	const datatransferMapping = new Map()
		.set(1, 'local')
		.set(2, 'server')
		.set(3, 'both');

	gender = gender ? gender : genderMapping.get(genderIndex);
	datatransfer = datatransfer
		? datatransfer
		: datatransferMapping.get(datatransferIndex);

	let href = window.location.href;
	if (href.includes('index.html')) {
		href = href.replace('index.html', '');
	}
	window.location.href = `${href}app.html?id=${id}&community=${community}&birthday=${birthday}&gender=${gender}&datatransfer=${datatransfer}&webcam=${webcam}`;
});
