import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const App = () => {
  const [recipientName, setRecipientName] = useState('Samira Hadid');
  const [description, setDescription] = useState(
    'For the successful completion of the professional management course and demonstrating great skills in practical application.'
  );

  const generatePdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor('#FFFFFF');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Colors
    const royalBlue = '#1E3A8A';
    const shimmeringGold = '#FFD700';
    const grayText = '#444444';

    // Decorative waves
    const drawWave = (x1, y1, c1x, c1y, c2x, c2y, x2, y2, color) => {
      doc.setFillColor(color);
      doc.beginPath();
      doc.moveTo(x1, y1);
      doc.bezierCurveTo(c1x, c1y, c2x, c2y, x2, y2);
      doc.lineTo(x2, pageHeight);
      doc.lineTo(x1, pageHeight);
      doc.closePath();
      doc.fill();
    };

    // Bottom-left
    drawWave(0, pageHeight - 50, pageWidth * 0.2, pageHeight - 120, pageWidth * 0.35, pageHeight, pageWidth * 0.5, pageHeight, royalBlue);
    drawWave(0, pageHeight - 30, pageWidth * 0.1, pageHeight - 100, pageWidth * 0.25, pageHeight, pageWidth * 0.4, pageHeight, shimmeringGold);

    // Top-right
    drawWave(pageWidth, 50, pageWidth - pageWidth * 0.2, 120, pageWidth - pageWidth * 0.35, 0, pageWidth - pageWidth * 0.5, 0, royalBlue);
    drawWave(pageWidth, 30, pageWidth - pageWidth * 0.1, 100, pageWidth - pageWidth * 0.25, 0, pageWidth - pageWidth * 0.4, 0, shimmeringGold);

    // Seal
    const sealX = 80;
    const sealY = 80;
    const sealRadius = 28;

    // Gold Ribbon
    doc.setFillColor(shimmeringGold);
    doc.triangle(sealX, sealY, sealX - 18, sealY + sealRadius + 25, sealX + 18, sealY + sealRadius + 25);

    // Seal Circle
    doc.setFillColor(shimmeringGold);
    doc.circle(sealX, sealY, sealRadius);
    doc.fill();
    doc.setFillColor(royalBlue);
    doc.circle(sealX, sealY, sealRadius - 4);
    doc.fill();

    // Certificate Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(royalBlue);
    doc.text('CERTIFICATE', pageWidth / 2, pageHeight / 2 - 130, { align: 'center' });

    doc.setFontSize(28);
    doc.text('OF ACHIEVEMENT', pageWidth / 2, pageHeight / 2 - 90, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(grayText);
    doc.text('This certificate is proudly presented to', pageWidth / 2, pageHeight / 2 - 40, { align: 'center' });

    doc.setFont('times', 'bolditalic');
    doc.setFontSize(52);
    doc.setTextColor(royalBlue);
    doc.text(recipientName || 'Recipient Name', pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(grayText);
    const descriptionLines = doc.splitTextToSize(description || 'Description of achievement.', pageWidth - 200);
    doc.text(descriptionLines, pageWidth / 2, pageHeight / 2 + 100, { align: 'center' });

    // Signature & Date
    const lineY = pageHeight - 80;
    const sigX1 = pageWidth * 0.2;
    const sigX2 = pageWidth * 0.4;
    const dateX1 = pageWidth * 0.6;
    const dateX2 = pageWidth * 0.8;

    doc.setDrawColor(grayText);
    doc.setLineWidth(1);
    doc.line(sigX1, lineY, sigX2, lineY);
    doc.line(dateX1, lineY, dateX2, lineY);

    doc.setFontSize(12);
    doc.text('Signature', sigX1 + (sigX2 - sigX1) / 2, lineY + 18, { align: 'center' });
    doc.text('Date', dateX1 + (dateX2 - dateX1) / 2, lineY + 18, { align: 'center' });

    doc.save(`${recipientName.replace(/ /g, '_')}_Certificate.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-blue-400">
          Corporate Certificate Generator
        </h1>
        <p className="text-center text-gray-400">
          Enter the details below to generate a professional certificate.
        </p>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-300">Recipient's Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g., Jane Doe"
            className="p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-300">Achievement Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the achievement..."
            rows="4"
            className="p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
          />
        </div>

        <button
          onClick={generatePdf}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          Download Certificate PDF
        </button>
      </div>
    </div>
  );
};

export default App;
