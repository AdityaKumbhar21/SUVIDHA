const PDFDocument = require('pdfkit');
const { uploadToCloudinary } = require('./upload');


async function generateReceipt(payment, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);

        const receiptUrl = await uploadToCloudinary(
          pdfBuffer,
          'suvidha/receipts',
          'raw'
        );

        resolve(receiptUrl);
      });

      // ───── PDF CONTENT ─────

      const amountRupees = (Number(payment.amountPaise) / 100).toFixed(2);
      const receiptDate = new Date(payment.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      });

      // Header
      doc.rect(0, 0, doc.page.width, 80).fill('#1A365D');
      doc.fontSize(22).fillColor('#FFFFFF').text('SUVIDHA PORTAL', 50, 25, { align: 'center' });
      doc.fontSize(10).text('Government of India – Digital Services', { align: 'center' });

      doc.moveDown(2);
      doc.fillColor('#000000');

      // Title
      doc.fontSize(16).fillColor('#1A365D').text('PAYMENT RECEIPT', { align: 'center' });
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#1A365D');
      doc.moveDown();

      // Details
      doc.fillColor('#333333').fontSize(11);
      const leftX = 60;
      const rightX = 300;

      const addRow = (label, value) => {
        const y = doc.y;
        doc.font('Helvetica-Bold').text(label, leftX, y);
        doc.font('Helvetica').text(value, rightX, y);
        doc.moveDown(0.6);
      };

      addRow('Receipt No:', payment.id);
      addRow('Date:', receiptDate);
      addRow('Citizen Name:', user.name || 'N/A');
      addRow('Mobile:', user.mobile);
      addRow('Transaction ID:', payment.stripePaymentIntentId || 'N/A');

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#E2E8F0');
      doc.moveDown();

      // Amount box
      doc.rect(50, doc.y, doc.page.width - 100, 50).fill('#F0FFF4');
      doc.fillColor('#276749').fontSize(14).font('Helvetica-Bold')
        .text(`Amount Paid: ₹ ${amountRupees}`, 60, doc.y + 15, { align: 'center' });
      doc.moveDown(3);

      doc.fillColor('#333333').font('Helvetica').fontSize(11);
      doc.text('Payment Status: SUCCESS', { align: 'center' });
      doc.moveDown(2);

      // Footer
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#E2E8F0');
      doc.moveDown();
      doc.fontSize(9).fillColor('#999999');
      doc.text('This is a system-generated receipt. No signature required.', { align: 'center' });
      doc.text('Thank you for using SUVIDHA Portal.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateReceipt };
