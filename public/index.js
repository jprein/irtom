// check if URL Params already exist and store them
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

let id = '';
let community = '';
let birthday = '';
let gender = '';
let datatransfer = '';

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

// remove all params from URL
window.history.pushState({}, document.title, window.location.pathname);

const handleDate = (e) => {
	let age = 0;
	if (typeof e.target === 'undefined') {
		age = calculateAge(Date.parse(e));
	} else {
		age = calculateAge(Date.parse(e.target.value));
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

	let href = window.location.href;
	if (href.includes('index.html')) {
		href = href.replace('index.html', '');
	}
	window.location.href = `${href}app.html?id=${id}&community=${community}&birthday=${birthday}&gender=${gender}&datatransfer=${datatransfer}`;
});
