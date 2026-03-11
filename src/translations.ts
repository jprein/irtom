export const translations = {
	beginning: {
		german: '<h1 class="heading">Herzlich Willkommen</h1>',
		english: '<h1 class="heading">Welcome</h1>',
		kikuyu: '<h1 class="heading">Wĩ kĩambĩrĩrĩ</h1>',
		swahili: '<h1 class="heading">Karibu</h1>',
		turkish: '<h1 class="heading">Hoşgeldiniz</h1>',
	},
	intro: {
		german:
			'<p class="intro-text">Danke, dass du heute bei uns bist. Wir wollen ein kleines Spiel zusammen spielen. <br> Lass uns nun mehr über das Spiel anhören. Tippe auf den orangenen Lautsprecher-Knopf, um mehr zu erfahren.</p>',
		english: `<p class="intro-text">Thank you for joining us today. We want to play a little game together. <br> Let's listen to more information about our game. Please click on the orange speaker button to learn more.</p>`,
		kikuyu: `<p class="intro-text">Wĩ ũruta mwega ũrũmĩte nĩ ũkĩambĩrĩrĩ. Nĩ ũrĩ na mwanajimbi mwaka mwaka ũno. <br> Ĩtwe nĩ tũkĩigua mahoya maiguru. Ĩkuru mwĩ mũ̃nũ ũrũ ngatho rũ ihũa rũ igweta rio mĩ.</p>`,
		swahili: `<p class="intro-text">Asante kwa kujibu kauli leo. Tunataka kucheza mchezo kidogo pamoja. <br> Hayo usikilize habari zaidi kuhusu mchezo wetu. Tafadhali bofya kitufe kinene cha lugha kuona zaidi.</p>`,
		turkish: `<p class="intro-text">Bugün bize katıldığınız için teşekkür ederiz. Küçük bir oyun oynamak istiyoruz. <br> Oyunumuz hakkında daha fazla bilgi dinleyelim. Lütfen daha fazla bilgi almak için turuncu hoparlör düğmesini tıklayın.</p>`,
	},
	thankYou: {
		german:
			'<h1 class="heading">Vielen Dank!</h1><br><p class="end-text">Super, alles geschafft. Tippe auf den orangenen Lautsprecher-Knopf, um eine Abschiedsnachricht zu hören. Um zu einem kleinen Dankeschön zu gelangen, tippe danach auf den Pfeil.</p>',
		english:
			'<h1 class="heading">Thank you!</h1><br><p class="end-text">Excellent, you have completed the study. Click on the orange speaker button to listen to a goodbye message. To receive a small thank-you gift, please click on the arrow below.</p>',
		kikuyu:
			'<h1 class="heading">Wĩ ũruta mwega!</h1><br><p class="end-text">Wĩ kĩambĩrĩrĩ, ĩ mahoya moguo nĩ meyũũmbire. Ĩkuru mwĩ mũ̃nũ ũrũ ngatho rũ igweta rio mĩ nĩguo wĩkigua mahoya ma mwanajimbi. Nĩguo wĩthũka mwanajimbi mwondu, ĩkuru mwĩ mũ̃nũ ũrũ nyoni rio mwanaja.</p>',
		swahili:
			'<h1 class="heading">Asante sana!</h1><br><p class="end-text">Safi, umefanya kazi nzuri. Bofya kitufe kinene cha sauti kupata ujumbe wa kwaheri. Ili kupokea zawadi ndogo ya shukrani, tafadhali bofya kichwa kimeuzwa.</p>',
		turkish:
			'<h1 class="heading">Çok Teşekkür Ederiz!</h1><br><p class="end-text">Harika, çalışmayı tamamladınız. Veda mesajını dinlemek için turuncu hoparlör düğmesini tıklayın. Küçük bir teşekkür hediyesi almak için lütfen aşağıdaki oka tıklayın.</p>',
	},
};

// Button translations for HTML elements (not SVG, so kept separate from svg-dependent translations)
export const buttonTranslations = {
	startAudio: {
		german: 'Klicke hier, um mit der Studie zu beginnen',
		english: 'Click here to start the study',
		kikuyu: 'Nyinyi ũi hĩ nĩguo wĩkhĩte mwanake',
		swahili: 'Bofya hapa kuanza utafiti',
		turkish: 'Çalışmayı başlatmak için buraya tıklayın',
	},
	preparingAudio: {
		german: 'Bitte warten: Die Tonaufnahmen werden geladen...',
		english: 'Please wait: Loading audio files...',
		kikuyu: 'Ruta mwega: Mĩgwanja ĩkĩruta...',
		swahili: 'Karibu subiri: Faili za sauti zinaloading...',
		turkish: 'Lütfen bekleyin: Ses dosyaları yükleniyor...',
	},
	loadingImages: {
		german: 'Bitte warten: Die Bilder werden geladen...',
		english: 'Please wait: Loading images...',
		kikuyu: 'Ruta mwega: Mbakaî ĩkĩruta...',
		swahili: 'Karibu subiri: Picha zinaloading...',
		turkish: 'Lütfen bekleyin: Resimler yükleniyor...',
	},
};
