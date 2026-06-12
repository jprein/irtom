const supportedLanguages = ['de', 'en'];
const languageIds = [
	'heading-main',
	'heading-sub',
	'goodbye',
	'info',
	'imprint',
	'dataProtection',
];

const translations = {
	'heading-main': {
		de: `irToM`,
		en: `irToM`,
	},
	'heading-sub': {
		de: `Testbatterie für Soziale Kognition`,
		en: `Test battery for Social Cognition`,
	},
	info: {
		de: `Weitere Informationen über die Testbatterie:`,
		en: `Additional information about the test battery:`,
	},
	thanks: {
		de: `Vielen Dank für Ihr Interesse an unserer Testbatterie:`,
		en: `Thank you for your interest in our test battery:`,
	},
	imprint: {
		de: `Impressum`,
		en: `Imprint`,
	},
	dataProtection: {
		de: `Datenschutz`,
		en: `Data Protection`,
	},
	goodbye: {
		de: `Toll - alles geschafft! Herzlichen Dank, dass Sie unsere Testbatterie
			nutzen. 
			<br />
			<br />
			Falls Sie Fragen oder Anmerkungen habt, schreiben Sie uns bitte an
			diese E-Mail-Adresse:
			<a href="mailto:lueneluetten@leuphana.de">lueneluetten@leuphana.de</a
			>.
			<br />
			<br />
			Wir freuen uns von Ihnen zu hören!
			<br />
			<br />
			Herzliche Grüße,
			<br />
			Ihr Forschungsteam von der Leuphana Universität Lüneburg <br />
			und dem Max-Planck-Institut für evolutionäre Anthropologie Leipzig`,
		en: `Great - all done! Thank you very much for using our test battery.
			<br/><br/>In case you have any questions or comments, please contact us at this email address:
			<a href="mailto:lueneluetten@leuphana.de">lueneluetten@leuphana.de</a>.
			<br/><br/>We look forward to hearing from you!<br/><br/>
			All the best, <br/>
			Your research team from Leuphana University Lüneburg <br />
			and the Max Planck Institute for Evolutionary Anthropology Leipzig`,
	},
};

const browserLanguage = window.navigator.language.substring(0, 2);

// check if browser language is defined in supported languages
let hasTranslation = true;
if (!supportedLanguages.includes(browserLanguage)) {
	hasTranslation = false;
}

languageIds.forEach((languageId) => {
	const currentEle = document.getElementById(languageId);
	currentEle.innerHTML = hasTranslation
		? translations[languageId][browserLanguage]
		: translations[languageId].en;
});
