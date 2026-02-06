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
      doc.fontSize(18).text('SUVIDHA – Payment Receipt', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Receipt No: ${payment.id}`);
      doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);
      doc.moveDown();

      doc.text(`Citizen Name: ${user.name || 'N/A'}`);
      doc.text(`Mobile: ${user.mobile}`);
      doc.moveDown();

      doc.text(`Amount Paid: ₹${(payment.amountPaise / 100).toFixed(2)}`);
      doc.text(`Payment Status: SUCCESS`);
      doc.text(`Transaction ID: ${payment.stripePaymentIntentId}`);
      doc.moveDown();

      doc.text('This is a system generated receipt.');
      doc.text('Thank you for using SUVIDHA.');

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateReceipt };
