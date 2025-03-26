import Toastify from 'toastify-js';
import config from '../config.yaml';

export const getUrlParameters = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const params: Record<string, string> = {};
	for (const [key, value] of urlParams) {
		params[key] = value;
	}

	// Perfom sanity checks on provided parameters, else use config.yaml defaults
	if (params.id) {
		const allowedChars = /[0-9a-z-_äöüß ]/i;
		if (!allowedChars.test(params.id)) {
			Toastify({
				escapeMarkup: false,
				text: `<strong>Parameter Error</strong>: <small>ID cannot contain special characters. Defaulting to: ${config.globals.defaultSubjectId}</small></small>`,
				duration: 0,
				className: 'toast-error',
			}).showToast();
			params.id = config.globals.defaultSubjectId;
		}

		if (params.id.length > 30) {
			Toastify({
				escapeMarkup: false,
				text: `<strong>Parameter Error</strong>: <small>id too long! Only 30 chars are allowed. Defaulting to: ${config.globals.defaultSubjectId}</small>`,
				duration: 0,
				className: 'toast-error',
			}).showToast();
			params.id = config.globals.defaultSubjectId;
		}
	} else {
		params.id = config.globals.defaultSubjectId;
	}

	if (params.community) {
		if (!Object.keys(config.procedure).includes(params.community)) {
			Toastify({
				escapeMarkup: false,
				text: `🌏 <strong>Community not found.</strong> <small>Your given URL paramter was not found within procedure objects in config.yaml. You either need to define the procedure, or check your URL parameter for typos.<br><br><b>Possible values: ${Object.keys(
					config.procedure
				).join(', ')}<br>Redirected to: ${
					config.globals.defaultCommunity
				}</small></b></small>`,
				close: true,
				className: 'toast-error',
			}).showToast();
			params.community = config.globals.defaultCommunity;
		}
	} else {
		params.community = config.globals.defaultCommunity;
	}

	if (params.birthday) {
		// exact regex for YYYY-MM-DD: https://stackoverflow.com/a/22061879/2258480
		const yyyymmddRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
		if (!yyyymmddRegex.test(params.birthday)) {
			Toastify({
				escapeMarkup: false,
				text: `<strong>Parameter Error</strong>: <small><code>birthday</code> must be in yyyy-mm-dd format!</small><br><br>Defaulting to: <code>${config.globals.defaultBirthday}</code>`,
				duration: 0,
				className: 'toast-info',
			}).showToast();
			params.birthday = config.globals.defaultBirthday;
		}
	} else {
		params.birthday = config.globals.defaultBirthday;
	}

	if (params.gender) {
		if (
			params.gender !== 'female' &&
			params.gender !== 'male' &&
			params.gender !== 'diverse' &&
			params.gender !== 'none'
		) {
			Toastify({
				escapeMarkup: false,
				text: `<strong>Parameter Error</strong>: <small><code>gender</code> must be one of: <code>female, male, diverse, none</code></small><br><br>Defaulting to: <code>${config.globals.defaultGender}</code>`,
				duration: 0,
				className: 'toast-info',
			}).showToast();
			params.gender = config.globals.defaultGender;
		}
	} else {
		params.gender = config.globals.defaultGender;
	}

	if (params.input) {
		if (
			params.input !== 'text' &&
			params.input !== 'audio' &&
			params.input !== 'userchoice-audio' &&
			params.input !== 'userchoice-text'
		) {
			Toastify({
				escapeMarkup: false,
				text: `<strong>Parameter Error</strong>: <small><code>input</code> parameter can only be: <code>text</code>, <code>audio</code>, <code>userchoice-audio</code> or <code>userchoice-text</code></small><br><br> Defaulting to <code>${config.globals.defaultInput}</code>`,
				duration: 0,
				className: 'toast-info',
			}).showToast();
			params.input = config.globals.defaultInput;
		}
	} else {
		params.input = config.globals.defaultInput;
	}

	if (params.datatransfer) {
		if (params.datatransfer !== 'both' && params.datatransfer !== 'server') {
			Toastify({
				escapeMarkup: false,
				text: `<strong>Parameter Error</strong>: <small><code>datatransfer</code> parameter can only be: <code>both</code> or <code>server</code></small><br><br> Defaulting to <code>${config.globals.defaultDataTransfer}</code>`,
				duration: 0,
				className: 'toast-info',
			}).showToast();
			params.datatransfer = config.globals.defaultDataTransfer;
		}
	} else {
		params.datatransfer = config.globals.defaultDataTransfer;
	}

	if (!params.coupon) {
		params.coupon = config.globals.defaultCoupon;
	}

	if (!params.PROLIFIC_PID) {
		params.PROLIFIC_PID = config.globals.defaultPROLIFIC_PID;
	}

	// if not in devmode, remove all params from URL
	if (!config.devmode.on) {
		// remove all params from URL
		window.history.pushState({}, document.title, window.location.pathname);
	}

	return params;
};
