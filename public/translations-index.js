const supportedLanguages = ['de', 'en', 'es'];
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
	'birthday',
	'gender',
	'chooseGender',
	'female',
	'male',
	'diverse',
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
		es: `Desarrollo social`,
	},
	leuphana: {
		de: `Leuphana Universität Lüneburg, Abteilung Entwicklungspsychologie`,
		en: `Leuphana University Lüneburg, Department of Developmental Psychology`,
		es: `Universidad Leuphana de Lüneburg, Departamento de Psicología del Desarrollo`,
	},
	idLabel: {
		de: `Vor- und Nachname oder ID`,
		en: `Name and Surname or ID`,
		es: `Nombre y Apellido o DNI`,
	},
	community: {
		de: `Gemeinschaft`,
		en: `Community`,
		es: `Comunidad`,
	},
	chooseCommunity: {
		de: `Bitte wählen...`,
		en: `Please select...`,
		es: `Por favor seleccione...`,
	},
	english: {
		de: `Englisch`,
		en: `English`,
		es: `Inglés`,
	},
	german: {
		de: `Deutsch`,
		en: `German`,
		es: `Alemán`,
	},
	kikuyu: {
		de: `Kikuyu`,
		en: `Kikuyu`,
		es: `Kikuyu`,
	},
	swahili: {
		de: `Swahili`,
		en: `Swahili`,
		es: `Swahili`,
	},
	turkish: {
		de: `Türkisch`,
		en: `Turkish`,
		es: `Turco`,
	},
	birthday: {
		de: `Geburtstag`,
		en: `Birthday`,
		es: `Cumpleaños`,
	},
	gender: {
		de: `Geschlecht`,
		en: `Gender`,
		es: `Sexo`,
	},
	chooseGender: {
		de: `Bitte wählen...`,
		en: `Please select...`,
		es: `Por favor seleccione...`,
	},
	female: {
		de: `Weiblich`,
		en: `Female`,
		es: `Feminino`,
	},
	male: {
		de: `Männlich`,
		en: `Male`,
		es: `Masculino`,
	},
	diverse: {
		de: `Divers`,
		en: `Diverse`,
		es: `Diverso`,
	},
	dataTransfer: {
		de: `Datentransfer`,
		en: `Data Transfer`,
		es: `Transferencia de datos`,
	},
	chooseDatatransfer: {
		de: `Bitte wählen...`,
		en: `Please select...`,
		es: `Por favor seleccione...`,
	},
	local: {
		de: `Lokaler Download`,
		en: `Local Download`,
		es: `Descarga local`,
	},
	server: {
		de: `Upload auf Leuphana Server`,
		en: `Upload to Leuphana Server`,
		es: `Subida al servidor de Leuphana`,
	},
	both: {
		de: `Lokaler Download und Upload auf Leuphana Server`,
		en: `Local Download and Upload to Leuphana Server`,
		es: `Descarga local y subida al servidor de Leuphana`,
	},
	webcam: {
		de: `Webcam`,
		en: `Webcam`,
		es: `Cámara web`,
	},
	chooseWebcam: {
		de: `Bitte wählen...`,
		en: `Please select...`,
		es: `Por favor seleccione...`,
	},
	webcamTrue: {
		de: `Ja`,
		en: `Yes`,
		es: `Sí`,
	},
	webcamFalse: {
		de: `Nein`,
		en: `No`,
		es: `No`,
	},
	webcamPreview: {
		de: `Webcam-Vorschau`,
		en: `Webcam Preview`,
		es: `Vista previa de la cámara web`,
	},
	startButton: {
		de: `Start`,
		en: `Start`,
		es: `Inicio`,
	},
	imprint: {
		de: `Impressum`,
		en: `Imprint`,
		es: `Pie de imprenta`,
	},
	dataProtection: {
		de: `Datenschutz`,
		en: `Data Protection`,
		es: `Protección de datos `,
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
		es: `Los gráficos y elementos de diseño de este sitio web incluyen recursos de 
		<a href="https://www.freepik.com/" target="_blank" id="freepik">Freepik</a>
		utilizados bajo la Licencia Libre de Freepik con la atribución requerida. 
		Algunos contenidos pueden haber sido editados o personalizados.`,
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
