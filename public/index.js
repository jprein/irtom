// check if URL Params already exist and store them
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

let id = '';
let community = '';
let birthday = '';
let gender = '';
let input = '';
let datatransfer = '';
let coupon = '';
let PROLIFIC_PID = '';

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
if (params.has('input')) {
	input = params.get('input');
}
if (params.has('datatransfer')) {
	datatransfer = params.get('datatransfer');
}
if (params.has('coupon')) {
	coupon = params.get('coupon');
}
if (params.has('PROLIFIC_PID')) {
	PROLIFIC_PID = params.get('PROLIFIC_PID');
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
	}
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
if (input) {
	const inputElement = document.getElementById('input-response');
	inputElement.required = false;
	inputElement.parentNode.style.display = 'none';
}
if (datatransfer) {
	const datatransferElement = document.getElementById('input-datatransfer');
	datatransferElement.required = false;
	datatransferElement.parentElement.style.display = 'none';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleCheckbox = (e) => {
	if (e.target.checked) {
		// close modal going to #
		setTimeout(() => {
			window.location.href = '#consent';
			window.history.pushState({}, document.title, window.location.pathname);
		}, 1000);
	}
};

const startButton = document.getElementById('start-button');
startButton.style.pointerEvents = 'none';
const microphoneCheckbox = document.getElementById('input-checkbox-microphone');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleInputResponse = (e) => {
	if (e.target.selectedIndex === 3) {
		document.getElementById(
			'input-checkbox-microphone'
		).parentNode.style.display = 'none';
		startButton.style.pointerEvents = 'visible';
		startButton.style.opacity = '1';
	} else {
		document.getElementById(
			'input-checkbox-microphone'
		).parentNode.style.display = 'block';
		if (!microphoneCheckbox.checked) {
			startButton.style.pointerEvents = 'none';
			startButton.style.opacity = '0.5';
		}
	}
};

microphoneCheckbox.parentNode.addEventListener('click', () => {
	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then(function () {
			microphoneCheckbox.checked = true;
			startButton.style.pointerEvents = 'auto';
			startButton.style.opacity = '1';
		})
		.catch(function () {
			console.log('No mic for you!');
		});
});

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
	let inputIndex = '';
	if (!input) {
		inputIndex = document.getElementById('input-response').selectedIndex;
	}
	let datatransferIndex = '';
	if (!datatransfer) {
		datatransferIndex =
			document.getElementById('input-datatransfer').selectedIndex;
	}

	// mapping (key value lookup) for gender, input and datatransfer
	const genderMapping = new Map()
		.set(0, 'female')
		.set(1, 'male')
		.set(2, 'diverse');
	const inputMapping = new Map()
		.set(0, 'userchoice-audio')
		.set(1, 'userchoice-text')
		.set(2, 'audio')
		.set(3, 'text');
	const datatransferMapping = new Map().set(0, 'both').set(1, 'server');

	gender = gender ? gender : genderMapping.get(genderIndex);
	input = input ? input : inputMapping.get(inputIndex);
	datatransfer = datatransfer
		? datatransfer
		: datatransferMapping.get(datatransferIndex);

	window.location.href = `${window.location.href}app.html?id=${id}&community=${community}&birthday=${birthday}&gender=${gender}&input=${input}&datatransfer=${datatransfer}&coupon=${coupon}&PROLIFIC_PID=${PROLIFIC_PID}`;
	console.log(window.location.href);
});
