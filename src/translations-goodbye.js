const supportedLanguages = ['de', 'en'];
const languageIds = [
	'heading',
	'leuphana',
	'imprint',
	'dataProtection',
	'goodbye',
];

const translations = {
	heading: {
		de: `Soziale Entwicklung`,
		en: `Social Development`,
	},
	leuphana: {
		de: `von der Leuphana Universität Lüneburg, Entwicklungspsychologie, und <br>
		dem Max-Planck-Institut für evolutionäre Anthropologie, Vergleichende Kulturpsychologie`,
		en: `at the Leuphana University Lüneburg, Department of Developmental Psychology, and <br>
		the Max Planck Institute for Evolutionary Anthropology, Comparative Cultural Psychology`,
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
		de: `Toll - alles geschafft! Herzlichen Dank für's Mitspielen. Wir hoffen, es hat dir Spaß gemacht.
			<br/><br/>Falls ihr Fragen oder Anmerkungen habt, wendet euch bitte an diese E-Mail-Adresse: 
			<a href="mailto:lueneluetten@leuphana.de">lueneluetten@leuphana.de</a>.
			<br/><br/>Wir freuen uns auf ein Wiedersehen!<br/><br/>
			Herzliche Grüße und bis bald, <br/> 
			Ihr Forschungsteam von der Leuphana Universität Lüneburg <br />
			und dem Max-Planck-Institut für evolutionäre Anthropologie Leipzig`,
		en: `Great - all done! Thank you very much for participating. We hope you enjoyed it.
			<br/><br/>In case you have any questions or comments, please contact us at this email address:
			<a href="mailto:lueneluetten@leuphana.de">lueneluetten@leuphana.de</a>.
			<br/><br/>We look forward to seeing you again!<br/><br/>
			Best regards and see you soon, <br/>
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
