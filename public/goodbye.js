import { PDFDocument, StandardFonts } from 'pdf-lib';
const buttonDownload = document.getElementById('button-center-item');
const coupon = new URL(document.location.href).searchParams.get('coupon');
// add unique coupon code to pdf
async function createCoupon() {
	// Fetch an existing PDF document
	const url = 'coupon.pdf';
	const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

	// Load a PDFDocument from the existing PDF bytes
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Embed the Helvetica font
	const helveticaFont = await pdfDoc.embedFont(
		StandardFonts.HelveticaBoldOblique
	);

	// Get the first page of the document
	const pages = pdfDoc.getPages();
	const firstPage = pages[0];

	// Draw a string of text diagonally across the first page
	firstPage.drawText(`${coupon}`, {
		x: 238,
		y: 200,
		size: 25,
		font: helveticaFont,
	});

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();

	// Trigger the browser to download the PDF document
	globalThis.download(pdfBytes, 'Leuphana_Gutschein.pdf', 'application/pdf');
}
//-----------------------------------------------------

// define what happens on button click
const handleDownloadClick = () => {
	createCoupon();
};

// buttonDownload.addEventListener('click', handleDownloadClick, {
// capture: false,
// });
