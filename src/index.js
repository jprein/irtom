import { initMedia, stopMediaStream } from './util/mediaRecorderServices';
// check if URL Params already exist and store them
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

let id = '';
let community = '';
let datatransfer = '';
let webcam = '';

if (params.has('id')) {
	id = params.get('id');
}
if (params.has('community')) {
	community = params.get('community');
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
const webcamButton = document.getElementById('webcam-button');
const webcamModal = document.getElementById('webcam-modal');
const webcamModalVideo = document.getElementById('webcam-modal-video');
const webcamModalClose = document.getElementById('webcam-modal-close');

const previewConstraints = {
	// Request both permissions here so app.html doesn't need a second prompt
	// on browsers that persist media grants for the same origin/session.
	audio: true,
	video: {
		frameRate: {
			min: 1,
			ideal: 5,
			max: 10,
		},
		width: {
			min: 640,
			ideal: 640,
			max: 640,
		},
		height: {
			min: 480,
			ideal: 480,
			max: 480,
		},
		facingMode: 'user',
	},
};

const closePreviewModal = () => {
	if (webcamModal) {
		webcamModal.classList.add('hidden');
	}

	if (webcamModalVideo) {
		webcamModalVideo.pause();
		webcamModalVideo.srcObject = null;
	}

	stopMediaStream();
};

const openPreviewModal = async () => {
	try {
		const stream = await initMedia(previewConstraints);
		if (webcamModalVideo) {
			webcamModalVideo.srcObject = stream;
		}
		if (webcamModal) {
			webcamModal.classList.remove('hidden');
		}
	} catch (error) {
		console.error('Failed to open webcam preview:', error);
		alert(
			'Webcam preview could not be opened. Please allow camera permission and try again.',
		);
	}
};

const updateWebcamButtonVisibility = (value) => {
	if (!webcamButton) {
		return;
	}

	webcamButton.style.display = value === 'false' ? 'none' : 'inline';
};

updateWebcamButtonVisibility(webcam || webcamElement.value);

webcamElement.addEventListener('change', (e) => {
	const target = e.target;
	updateWebcamButtonVisibility(target.value);
	if (target.value === 'false') {
		closePreviewModal();
	}
});

webcamButton?.addEventListener('click', openPreviewModal);
webcamModalClose?.addEventListener('click', closePreviewModal);

// handle submit button
document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault();

	// use existing data if available, else use form data
	id = id ? id : document.getElementById('input-id').value;

	// for community and datatransfer, use the selected option's id
	const communityElement = document.getElementById('input-community');
	const communitySelected =
		communityElement.options[communityElement.selectedIndex].id;
	community = community ? community : communitySelected;

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
		datatransfer: datatransfer,
		webcam: webcam,
	};

	localStorage.setItem('storedChoices', JSON.stringify(studyChoices));

	closePreviewModal();

	// let href = window.location.href;
	// href = href.replace('index.html', '');
	// href = href.replace('#', '');
	window.location.href = `./app.html`;
});
