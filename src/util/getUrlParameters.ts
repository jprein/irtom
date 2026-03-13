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
			if (config.devmode.on) {
				Toastify({
					escapeMarkup: false,
					text: `<strong>Parameter Error</strong>: <small>ID cannot contain special characters. Defaulting to: ${config.globals.defaultSubjectId}</small></small>`,
					duration: 0,
					className: 'toast-error',
				}).showToast();
			}
			params.id = config.globals.defaultSubjectId;
		}

		if (params.id.length > 30) {
			if (config.devmode.on) {
				Toastify({
					escapeMarkup: false,
					text: `<strong>Parameter Error</strong>: <small>id too long! Only 30 chars are allowed. Defaulting to: ${config.globals.defaultSubjectId}</small>`,
					duration: 0,
					className: 'toast-error',
				}).showToast();
			}
			params.id = config.globals.defaultSubjectId;
		}
	} else {
		params.id = config.globals.defaultSubjectId;
	}

	if (params.community) {
		if (!Object.keys(config.procedure).includes(params.community)) {
			if (config.devmode.on) {
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
			}
			params.community = config.globals.defaultCommunity;
		}
	} else {
		params.community = config.globals.defaultCommunity;
	}

	if (params.datatransfer) {
		if (
			params.datatransfer !== 'both' &&
			params.datatransfer !== 'server' &&
			params.datatransfer !== 'local'
		) {
			if (config.devmode.on) {
				Toastify({
					escapeMarkup: false,
					text: `<strong>Parameter Error</strong>: <small><code>datatransfer</code> parameter can only be: <code>both</code> or <code>server</code></small><br><br> Defaulting to <code>${config.globals.defaultDataTransfer}</code>`,
					duration: 0,
					className: 'toast-info',
				}).showToast();
			}
			params.datatransfer = config.globals.defaultDataTransfer;
		}
	} else {
		params.datatransfer = config.globals.defaultDataTransfer;
	}

	// if not in devmode, remove all params from URL
	if (!config.devmode.on) {
		// remove all params from URL
		window.history.pushState({}, document.title, window.location.pathname);
	}

	return params;
};
