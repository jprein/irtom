const supportedLanguages = ['de', 'en'];
const languageIds = [
	'heading-main',
	'heading-sub',
	'thanks',
	'idLabel',
	'community',
	'chooseCommunity',
	'kikuyu',
	'swahili',
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
	'heading-main': {
		de: `irToM`,
		en: `irToM`,
	},
	'heading-sub': {
		de: `Testbatterie für Soziale Kognition`,
		en: `Test battery for Social Cognition`,
	},
	thanks: {
		de: `Vielen Dank für Ihr Interesse an unserer Testbatterie: `,
		en: `Thank you for your interest in our test battery: `,
	},
	idLabel: {
		de: `Bitte tragen Sie hier einen Namen oder Pseudonym ein:`,
		en: `Please enter a name or pseudonym here:`,
	},
	community: {
		de: `Bitte wählen Sie die Sprache aus:`,
		en: `Please select a language:`,
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
		de: `Möchten Sie eine Webcam-Aufnahme starten?`,
		en: `Would you like to start a webcam recording?`,
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
	audioButton: {
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
