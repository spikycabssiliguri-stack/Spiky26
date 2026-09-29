import jsPDF from 'jspdf';
import { CabPackage } from '../data/packagesData';

interface GuestInfo {
  name: string;
  phone: string;
}

export function generatePdfBrochure(pkg: CabPackage, guest: GuestInfo, companyPhone = '+91 75860 47996') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 18;
      // Re-add small header on subsequent pages
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(`Spiky Cabs · ${pkg.title}`, margin, 10);
      doc.text(`Call: ${companyPhone}`, pageWidth - margin, 10, { align: 'right' });
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      doc.line(margin, 12, pageWidth - margin, 12);
    }
  };

  // 1. Header Banner
  doc.setFillColor(29, 29, 31); // #1d1d1f Apple charcoal
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SPIKY CABS TAXI SERVICES', margin + 6, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('Himalayan Tourist Cab Packages · Darjeeling · Sikkim · Bhutan', margin + 6, y + 16);

  doc.setFontSize(8);
  doc.setTextColor(41, 151, 255); // accent blue
  doc.text(`Booking Desk: ${companyPhone}`, margin + contentWidth - 6, y + 9, { align: 'right' });
  doc.setTextColor(180, 180, 180);
  doc.text('Himachal Sarani, Siliguri, WB', margin + contentWidth - 6, y + 16, { align: 'right' });

  y += 30;

  // 2. Package Title Section
  doc.setTextColor(29, 29, 31);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(pkg.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(110, 110, 115);
  doc.text(`Route Circuit: ${pkg.subtitle}`, margin, y);
  y += 5;
  doc.text(`Duration: ${pkg.durationNights} Nights / ${pkg.durationDays} Days · Pickup & Drop: ${pkg.pickupDrop}`, margin, y);
  y += 7;

  // 3. Guest Personalized Lead Note Box
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
  doc.setTextColor(60, 60, 65);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared especially for: ${guest.name.trim()} (${guest.phone.trim()})`, margin + 4, y + 5);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · Valid till ${pkg.offerValidity}`, margin + 4, y + 9.5);

  y += 18;

  // 4. Vehicle Tariff Grid
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 29, 31);
  doc.text('ESTIMATED CAB PACKAGE TARIFF (All-Inclusive)', margin, y);
  y += 5;

  const colW = contentWidth / 3;
  const rates = [
    { type: 'Executive Sedan', model: 'Swift Dzire / Etios', price: pkg.startingPrice.sedan, pax: 'Max 4 Guests' },
    { type: 'Comfort MUV', model: 'Maruti Ertiga', price: pkg.startingPrice.suv, pax: 'Max 6 Guests' },
    { type: 'Premium Mountain SUV', model: 'Toyota Innova Crysta', price: pkg.startingPrice.innova, pax: 'Max 6–7 Guests' }
  ];

  rates.forEach((r, idx) => {
    const cardX = margin + idx * colW;
    doc.setFillColor(250, 250, 252);
    doc.setDrawColor(220, 220, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, y, colW - 3, 20, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 29, 31);
    doc.text(r.type, cardX + 3, y + 4.5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 110, 115);
    doc.text(r.model, cardX + 3, y + 8.5);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 113, 227); // #0071e3
    doc.text(`Rs. ${r.price.toLocaleString('en-IN')}`, cardX + 3, y + 14);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(`${r.pax} · Entire Tour`, cardX + 3, y + 18);
  });

  y += 26;

  // 5. Day-by-Day Detailed Itinerary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 29, 31);
  doc.text('DAY-BY-DAY ROUTE SCHEDULE', margin, y);
  y += 6;

  pkg.days.forEach((day) => {
    checkPageBreak(32);

    // Day Header Pill
    doc.setFillColor(0, 113, 227);
    doc.roundedRect(margin, y, 16, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`DAY ${day.dayNumber}`, margin + 8, y + 3.6, { align: 'center' });

    doc.setTextColor(29, 29, 31);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(day.title, margin + 20, y + 4);

    y += 7;

    // Route title & stay
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(110, 110, 115);
    doc.text(`Route: ${day.routeTitle}  |  Stay: ${day.stayLocation}${day.altitude ? `  |  Altitude: ${day.altitude}` : ''}`, margin, y);
    y += 4.5;

    // Description
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 55);
    const descLines = doc.splitTextToSize(day.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 3.8;

    // Sightseeing points
    if (day.sightseeingPoints && day.sightseeingPoints.length > 0) {
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 29, 31);
      doc.text('Key Stops: ' + day.sightseeingPoints.join(' · '), margin, y);
      y += 4;
    }

    y += 3;
    doc.setDrawColor(240, 240, 242);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4;
  });

  // 6. Inclusions & Exclusions
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 29, 31);
  doc.text('WHAT IS INCLUDED & EXCLUDED', margin, y);
  y += 5;

  const halfW = (contentWidth - 6) / 2;

  // Inclusions Box
  doc.setFillColor(245, 250, 247);
  doc.setDrawColor(200, 230, 210);
  doc.roundedRect(margin, y, halfW, 28, 2, 2, 'FD');
  doc.setTextColor(20, 120, 50);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Package Inclusions', margin + 3, y + 5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 70, 55);
  const incs = [
    '• Dedicated sanitized private tourist cab',
    '• Certified native Himalayan mountain driver',
    '• Complete tour route fuel & oil costs',
    '• Toll taxes, state transit permits & parking',
    '• Driver night lodging & food allowances'
  ];
  let incY = y + 9;
  incs.forEach(inc => {
    doc.text(inc, margin + 3, incY);
    incY += 3.8;
  });

  // Exclusions Box
  doc.setFillColor(253, 248, 248);
  doc.setDrawColor(240, 210, 210);
  doc.roundedRect(margin + halfW + 6, y, halfW, 28, 2, 2, 'FD');
  doc.setTextColor(180, 40, 40);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Exclusions', margin + halfW + 9, y + 5);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 50, 50);
  const excs = [
    '• Hotel accommodations & room charges',
    '• Daily meals (breakfast, lunch, dinner)',
    '• Entry tickets (Zoo, Ropeway, Toy Train)',
    '• High-altitude passes (Nathu La / Zero Point)',
    '• Personal expenses & tip allowances'
  ];
  let excY = y + 9;
  excs.forEach(exc => {
    doc.text(exc, margin + halfW + 9, excY);
    excY += 3.8;
  });

  y += 33;

  // 7. Booking & WhatsApp Call to Action
  checkPageBreak(25);
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 29, 31);
  doc.text('Ready to reserve this cab package?', margin + 5, y + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(110, 110, 115);
  doc.text(`Call or WhatsApp Spiky Cabs Siliguri at ${companyPhone} with your travel dates.`, margin + 5, y + 10.5);
  doc.text('Office: Himachal Sarani, Opp Janki Apt, Haiderpara, Siliguri, WB India.', margin + 5, y + 14.5);

  // Trigger browser download
  const cleanName = pkg.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`SpikyCabs_${cleanName}_itinerary.pdf`);
}
