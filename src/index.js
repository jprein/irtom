import mrec from '@ccp-eva/media-recorder';
// check if URL Params already exist and store them
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

let id = '';
let community = '';
let birthday = '';
let gender = '';
let datatransfer = '';
let webcam = '';

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

// remove all params from URL
window.history.pushState({}, document.title, window.location.pathname);

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
}
if (birthday) {
	const birthdayElement = document.getElementById('input-birthday');
	birthdayElement.required = false;
	birthdayElement.parentNode.style.display = 'none';
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
if (webcam) {
	const webcamElement = document.getElementById('input-webcam');
	webcamElement.required = false;
	webcamElement.parentElement.style.display = 'none';
}

// when webcam option false/no is selected, hide the webcam preview button
const webcamElement = document.getElementById('input-webcam');
webcamElement.addEventListener('change', (e) => {
	const webcamButton = document.getElementById('webcam-button');
	if (e.target.value === 'false') {
		webcamButton.style.display = 'none';
	} else {
		webcamButton.style.display = 'inline';
	}
});

// handle submit button
document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault();

	// use existing data if available, else use form data
	id = id ? id : document.getElementById('input-id').value;

	// for community, gender and datatransfer, use the selected option's id
	const communityElement = document.getElementById('input-community');
	const communitySelected =
		communityElement.options[communityElement.selectedIndex].id;
	community = community ? community : communitySelected;

	birthday = birthday
		? birthday
		: document.getElementById('input-birthday').value;

	const genderElement = document.getElementById('input-gender');
	const genderSelected = genderElement.options[genderElement.selectedIndex].id;
	gender = gender ? gender : genderSelected;

	const datatransferElement = document.getElementById('input-datatransfer');
	const datatransferSelected =
		datatransferElement.options[datatransferElement.selectedIndex].id;
	datatransfer = datatransfer ? datatransfer : datatransferSelected;

	const webcamElement = document.getElementById('input-webcam');
	const webcamSelected =
		webcamElement.options[webcamElement.selectedIndex].value;
	webcam = webcam ? webcam : webcamSelected;

	// Store data in local storage
	const studyChoices = {
		id: id,
		community: community,
		birthday: birthday,
		gender: gender,
		datatransfer: datatransfer,
		webcam: webcam,
	};

	localStorage.setItem('storedChoices', JSON.stringify(studyChoices));

	// let href = window.location.href;
	// href = href.replace('index.html', '');
	// href = href.replace('#', '');
	window.location.href = `./app.html`;
});
