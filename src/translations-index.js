const supportedLanguages = ['de', 'en'];
const languageIds = [
	'heading',
	'leuphana',
	'idLabel',
	'community',
	'chooseCommunity',
	'english',
	'german',
	'kikuyu',
	'swahili',
	'turkish',
	'dataTransfer',
	'chooseDatatransfer',
	'local',
	'server',
	'both',
	'webcam',
	'chooseWebcam',
	'webcamTrue',
	'webcamFalse',
	'webcamPreview',
	'startButton',
	'imprint',
	'dataProtection',
	'freepikAttribution',
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
	idLabel: {
		de: `Vor- und Nachname oder ID`,
		en: `Name and Surname or ID`,
	},
	community: {
		de: `Gemeinschaft`,
		en: `Community`,
	},
	chooseCommunity: {
		de: `Bitte wählen...`,
		en: `Please select...`,
	},
	english: {
		de: `Englisch`,
		en: `English`,
	},
	german: {
		de: `Deutsch`,
		en: `German`,
	},
	kikuyu: {
		de: `Kikuyu`,
		en: `Kikuyu`,
	},
	swahili: {
		de: `Swahili`,
		en: `Swahili`,
	},
	turkish: {
		de: `Türkisch`,
		en: `Turkish`,
	},
	dataTransfer: {
		de: `Datentransfer`,
		en: `Data Transfer`,
	},
	chooseDatatransfer: {
		de: `Bitte wählen...`,
		en: `Please select...`,
	},
	local: {
		de: `Lokaler Download`,
		en: `Local Download`,
	},
	server: {
		de: `Upload auf Leuphana Server`,
		en: `Upload to Leuphana Server`,
	},
	both: {
		de: `Lokaler Download und Upload auf Leuphana Server`,
		en: `Local Download and Upload to Leuphana Server`,
	},
	webcam: {
		de: `Webcam`,
		en: `Webcam`,
	},
	chooseWebcam: {
		de: `Bitte wählen...`,
		en: `Please select...`,
	},
	webcamTrue: {
		de: `Ja`,
		en: `Yes`,
	},
	webcamFalse: {
		de: `Nein`,
		en: `No`,
	},
	webcamPreview: {
		de: `Webcam-Vorschau`,
		en: `Webcam Preview`,
	},
	audioButton:{
		de: 'Audio testen',
		en: 'Test Audio',
		es: 'Probar audio',
	},
	startButton: {
		de: `Start`,
		en: `Start`,
	},
	imprint: {
		de: `Impressum`,
		en: `Imprint`,
	},
	dataProtection: {
		de: `Datenschutz`,
		en: `Data Protection`,
	},
	freepikAttribution: {
		de: `Grafiken und Designelemente auf dieser Website enthalten Ressourcen
		von Freepik, die unter der freien Lizenz von
		<a href="https://www.freepik.com/" target="_blank" id="freepik">Freepik</a>
		mit der erforderlichen Namensnennung verwendet werden. 
		Einige Inhalte können bearbeitet oder angepasst worden sein.`,
		en: `Graphics and design elements on this website include resources from
		<a href="https://www.freepik.com/" target="_blank" id="freepik">Freepik</a>
		used under Freepik’s Free License with required attribution. 
		Some contents may have been edited or customized.`,
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
