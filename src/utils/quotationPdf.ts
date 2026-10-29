import { jsPDF } from 'jspdf';
import { CRMItinerary } from '../types/crm';

/**
 * Format currency with INR label matching the inspiration PDF
 */
function formatInr(amount: number): string {
  const num = Math.round(amount || 0);
  return `INR ${num.toLocaleString('en-IN')}`;
}

function formatInrSuffix(amount: number): string {
  const num = Math.round(amount || 0);
  return `INR ${num.toLocaleString('en-IN')}/-`;
}

/**
 * Extract structured, unique hotel stays from itinerary days
 */
function getUniqueHotelStays(itinerary: CRMItinerary) {
  const stays: {
    hotelName: string;
    destination: string;
    roomCategory: string;
    mealPlan: string;
    nights: number;
    startDay: number;
    endDay: number;
    numberOfRooms: number;
  }[] = [];

  let currentStay: typeof stays[0] | null = null;

  (itinerary.days || []).forEach((day) => {
    if (day.hotelName) {
      if (currentStay && currentStay.hotelName === day.hotelName) {
        currentStay.nights += 1;
        currentStay.endDay = day.dayNumber;
      } else {
        if (currentStay) stays.push(currentStay);
        currentStay = {
          hotelName: day.hotelName,
          destination: day.destination || 'Darjeeling',
          roomCategory: day.roomCategoryName || 'Premium Room (Mountain View)',
          mealPlan: day.mealPlan || 'Breakfast (CP)',
          nights: 1,
          startDay: day.dayNumber,
          endDay: day.dayNumber,
          numberOfRooms: day.numberOfRooms || 1
        };
      }
    }
  });

  if (currentStay) stays.push(currentStay);

  // If no hotel was explicitly assigned, provide curated default stays
  if (stays.length === 0) {
    stays.push({
      hotelName: 'Summit Swiss Heritage Resort & Spa',
      destination: 'Darjeeling',
      roomCategory: 'Deluxe Suite (Mountain View)',
      mealPlan: 'Breakfast (CP)',
      nights: Math.max(1, Math.floor(itinerary.durationNights / 2)),
      startDay: 1,
      endDay: Math.max(1, Math.floor(itinerary.durationNights / 2)),
      numberOfRooms: 1
    });
    if (itinerary.durationNights > 1) {
      stays.push({
        hotelName: 'Yangkhyil Residency / Jagjeet Yuma',
        destination: 'Gangtok',
        roomCategory: 'Mountain View Premium',
        mealPlan: 'Breakfast (CP)',
        nights: Math.max(1, Math.ceil(itinerary.durationNights / 2)),
        startDay: Math.max(1, Math.floor(itinerary.durationNights / 2)) + 1,
        endDay: itinerary.durationDays,
        numberOfRooms: 1
      });
    }
  }

  return stays;
}

/**
 * Extract summary of destinations
 */
function getDestinationTitle(itinerary: CRMItinerary): string {
  const destSet = new Set<string>();
  (itinerary.days || []).forEach(d => {
    if (d.destination) destSet.add(d.destination);
  });
  if (destSet.size === 0) return 'Darjeeling & Sikkim';
  return Array.from(destSet).join(' & ');
}

/**
 * Generate a high-resolution branded PDF quotation inspired by the reference design
 */
export function downloadQuotationPDF(itinerary: CRMItinerary): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 12;
    const contentWidth = pageWidth - margin * 2; // 186mm
    let y = 12;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 16) {
        doc.addPage();
        y = 14;
        drawPageHeaderSmall();
      }
    };

    const drawPageHeaderSmall = () => {
      doc.setFillColor(2, 132, 199); // Sky blue 600
      doc.rect(margin, y, contentWidth, 7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('SPIKY CABS & HIMALAYAN TRAVELS · TOUR QUOTATION', margin + 4, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(240, 249, 255);
      doc.text(`Ref: #${(itinerary.id || 'QUO').slice(-6).toUpperCase()}`, pageWidth - margin - 4, y + 4.8, { align: 'right' });
      y += 11;
    };

    // Calculate Pricing Per Adult
    const grandTotal = itinerary.pricing.grandTotal || 0;
    const adults = Math.max(1, itinerary.adults || 2);
    const perAdultPrice = Math.round(grandTotal / adults);
    const destTitle = getDestinationTitle(itinerary);
    const guestFirstName = (itinerary.guestName || 'Guest').split(' ')[0];
    const issueDate = itinerary.createdAt 
      ? new Date(itinerary.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN');

    // ==========================================
    // 1. HERO HEADER BANNER (Sky Blue with Floating Card)
    // ==========================================
    const heroHeight = 36;
    doc.setFillColor(14, 165, 233); // Sky-500
    doc.rect(margin, y, contentWidth, heroHeight, 'F');

    // Left Title Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(240, 249, 255);
    doc.text(`${guestFirstName}'s trip to`, margin + 6, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(destTitle, margin + 6, y + 15.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(224, 242, 254);
    const agentName = itinerary.createdByName || itinerary.assignedAgentName || 'Spiky Cabs Specialist';
    doc.text(`Curated By: ${agentName}`, margin + 6, y + 21);

    // Pill Badges: Duration & Circuit Code
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 6, y + 25, 26, 6, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(2, 132, 199);
    doc.text(`${itinerary.durationNights}N/${itinerary.durationDays}D · Custom`, margin + 8, y + 29);

    doc.setFillColor(3, 105, 161); // Sky-700
    doc.roundedRect(margin + 34, y + 25, 36, 6, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`REF: ${(itinerary.id || 'QUO').slice(-6).toUpperCase()}`, margin + 36, y + 29);

    // Floating White Contact Card on the Right of Hero
    const heroCardW = 68;
    const heroCardH = 28;
    const heroCardX = pageWidth - margin - heroCardW - 4;
    const heroCardY = y + 4;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(heroCardX, heroCardY, heroCardW, heroCardH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Quotation Date: ${issueDate}`, heroCardX + 4, heroCardY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Mobile: +91 75860 47996 / +91 74780 47996', heroCardX + 4, heroCardY + 12);
    doc.text('Email: spikycabssiliguri@gmail.com', heroCardX + 4, heroCardY + 17.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(2, 132, 199);
    doc.text('Spiky Cabs Siliguri Operations Desk', heroCardX + 4, heroCardY + 23);

    y += heroHeight + 4;

    // ==========================================
    // 2. OVERVIEW TILES SECTION (Soft Sky Blue Block)
    // ==========================================
    const overviewH = 25;
    doc.setFillColor(240, 249, 255); // Sky-50
    doc.setDrawColor(186, 230, 253); // Sky-200
    doc.roundedRect(margin, y, contentWidth, overviewH, 2.5, 2.5, 'FD');

    // Section Tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(2, 132, 199);
    doc.text('OVERVIEW', margin + 6, y + 5.5);

    // 5 Tiles Grid
    const tileW = (contentWidth - 12) / 5; // ~34.8mm each
    const tileY = y + 8;

    // 1. Duration
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DURATION', margin + 6, tileY + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${itinerary.durationNights} Nights`, margin + 6, tileY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`${itinerary.durationDays} Days Tour`, margin + 6, tileY + 12.5);

    // 2. Travelers
    const t2X = margin + 6 + tileW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('TRAVELERS', t2X, tileY + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${itinerary.adults} Adults`, t2X, tileY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(itinerary.children ? `${itinerary.children} Kids` : 'Private Trip', t2X, tileY + 12.5);

    // 3. Accommodation
    const t3X = t2X + tileW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('ACCOMMODATION', t3X, tileY + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('3 Star / Luxury', t3X, tileY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('Verified Stays', t3X, tileY + 12.5);

    // 4. Travel Date
    const t4X = t3X + tileW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('TRAVEL DATE', t4X, tileY + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(itinerary.travelStartDate || 'Flexible', t4X, tileY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('Confirmed Slot', t4X, tileY + 12.5);

    // 5. Vehicle
    const t5X = t4X + tileW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('VEHICLE', t5X, tileY + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text(itinerary.vehicleCategory || 'Dedicated Cab', t5X, tileY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(itinerary.vehicleName?.slice(0, 14) || 'Private Fleet', t5X, tileY + 12.5);

    y += overviewH + 4;

    // ==========================================
    // 3. PACKAGE SUMMARY & PER-ADULT PRICING
    // ==========================================
    const summaryH = 20;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, summaryH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Package Summary', margin + 5, y + 5);

    // Left Total Price Callout
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199); // Sky-600
    doc.text(`${formatInrSuffix(grandTotal)} for ${adults} Adults`, margin + 5, y + 11);

    // Right Per Adult Price Callout
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${formatInrSuffix(perAdultPrice)}`, pageWidth - margin - 5, y + 9.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Per Adult Price', pageWidth - margin - 5, y + 14, { align: 'right' });

    // Disclaimer Note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Note: Package price is tentative and subject to change at confirmation. Hotels subject to availability.', margin + 5, y + 16.5);

    y += summaryH + 3.5;

    // ==========================================
    // 4. FINAL QUOTATION SUMMARY (Blue Pill Box)
    // ==========================================
    const finalH = 14;
    doc.setFillColor(2, 132, 199); // Sky-600
    doc.roundedRect(margin, y, contentWidth, finalH, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(224, 242, 254);
    doc.text('Final Quotation Summary', margin + 6, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(224, 242, 254);
    doc.text('(Valid for a week from the quotation date)', margin + 6, y + 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`Total Quotation Price: ${formatInr(grandTotal)}`, pageWidth - margin - 6, y + 8.5, { align: 'right' });

    y += finalH + 6;

    // ==========================================
    // 5. YOUR ITINERARY (Clean Day-by-Day Timeline)
    // ==========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(2, 132, 199); // Sky-600
    doc.text('Your Itinerary', margin, y);
    doc.setDrawColor(186, 230, 253);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 6;

    // Render Each Day with Clean Styling
    (itinerary.days || []).forEach((day) => {
      // Clean Bullet Points
      const bulletItems: string[] = [];

      if (day.serviceName) {
        bulletItems.push(day.serviceName);
      }

      if (day.description) {
        // Split description by period or line
        const sentences = day.description.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
        sentences.slice(0, 3).forEach(s => bulletItems.push(s.trim()));
      }

      if (day.sightseeingPoints && day.sightseeingPoints.length > 0) {
        bulletItems.push(`Key Sightseeing: ${day.sightseeingPoints.slice(0, 4).join(', ')}`);
      }

      if (day.hotelName) {
        bulletItems.push(`Overnight stay in ${day.destination}`);
      }

      // Height Calculation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      let totalBulletLines = 0;
      const wrappedBullets: string[][] = [];
      bulletItems.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 12);
        wrappedBullets.push(lines);
        totalBulletLines += lines.length;
      });

      const dayBlockHeight = 11 + totalBulletLines * 3.6 + 3;
      checkPageBreak(dayBlockHeight + 2);

      // Day Subheader: e.g. Day 1 / 27-12-2025
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const dayDateStr = day.date || itinerary.travelStartDate || `Day ${day.dayNumber}`;
      doc.text(`Day ${day.dayNumber} / ${dayDateStr}`, margin + 2, y + 3.5);

      // Destination in Large Bold
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(day.destination || day.title, margin + 2, y + 8);

      // Render Bullets
      let bY = y + 12;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);

      wrappedBullets.forEach(lines => {
        lines.forEach(l => {
          doc.text(l, margin + 4, bY);
          bY += 3.6;
        });
      });

      y += dayBlockHeight;
    });

    // ==========================================
    // 6. YOUR HOTEL SECTION (Sky Blue Container)
    // ==========================================
    const stays = getUniqueHotelStays(itinerary);
    const hotelCardHeight = 22;
    const hotelContainerHeight = 12 + stays.length * (hotelCardHeight + 3);

    checkPageBreak(hotelContainerHeight);

    // Blue Container
    doc.setFillColor(2, 132, 199); // Sky-600
    doc.roundedRect(margin, y, contentWidth, hotelContainerHeight, 2.5, 2.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('YOUR HOTEL', margin + 6, y + 6.5);

    let hotelY = y + 9.5;

    stays.forEach((stay) => {
      // Hotel Inner Card
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + 4, hotelY, contentWidth - 8, hotelCardHeight, 2, 2, 'F');

      // Hotel Icon / Thumbnail placeholder
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 6, hotelY + 2.5, 20, 17, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('HOTEL', margin + 16, hotelY + 11.5, { align: 'center' });

      // Hotel Details
      const textX = margin + 29;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`${stay.hotelName} | ${stay.destination}`, textX, hotelY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`${stay.nights} Nights · Days ${stay.startDay} to ${stay.endDay} | Rooms: ${stay.numberOfRooms}`, textX, hotelY + 10.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(2, 132, 199);
      doc.text(`Meal: ${stay.mealPlan} | Category: ${stay.roomCategory}`, textX, hotelY + 15);

      // Star Rating
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(245, 158, 11); // Amber stars
      doc.text('★ ★ ★', pageWidth - margin - 8, hotelY + 6, { align: 'right' });

      hotelY += hotelCardHeight + 3;
    });

    y += hotelContainerHeight + 4;

    // ==========================================
    // 7. YOUR VEHICLES SECTION (Sky Blue Container)
    // ==========================================
    const vehH = 26;
    checkPageBreak(vehH);

    doc.setFillColor(2, 132, 199); // Sky-600
    doc.roundedRect(margin, y, contentWidth, vehH, 2.5, 2.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('YOUR VEHICLES', margin + 6, y + 6.5);

    // Vehicle Inner Card
    const vehCardY = y + 9;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 4, vehCardY, contentWidth - 8, 14, 2, 2, 'F');

    // Thumbnail
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin + 6, vehCardY + 2, 18, 10, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CAB', margin + 15, vehCardY + 7.5, { align: 'center' });

    // Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(itinerary.vehicleName || 'Dedicated Tourist Cab', margin + 28, vehCardY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Category: ${itinerary.vehicleCategory} · No of vehicles: 1 · Private Hill Driver Included`, margin + 28, vehCardY + 10.5);

    y += vehH + 5;

    // ==========================================
    // 8. INCLUSIONS & EXCLUSIONS (Pastel Green & Rose)
    // ==========================================
    const incW = (contentWidth - 4) / 2;
    const defaultInclusions = itinerary.inclusions?.length ? itinerary.inclusions : [
      'Accommodation in verified hotels with daily breakfast',
      'Arrival & departure transfers from Bagdogra (IXB) / NJP',
      'Day-wise sightseeing transfers as per itinerary',
      'Dedicated private mountain vehicle for the entire trip',
      'Driver hill charges, parking & state toll taxes included',
      'All local assistance and GST included'
    ];

    const defaultExclusions = itinerary.exclusions?.length ? itinerary.exclusions : [
      'Entry fees to monuments, ropeway, parks and museums',
      'Water sports & adventure activities',
      'Personal expenses (laundry, tips, heater charges, calls)',
      'Any drinks or meals not specified in inclusions',
      'Nathula Pass permit charges (optional extra)'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    let incCount = 0;
    defaultInclusions.forEach(i => { incCount += doc.splitTextToSize(`• ${i}`, incW - 8).length; });
    let excCount = 0;
    defaultExclusions.forEach(e => { excCount += doc.splitTextToSize(`• ${e}`, incW - 8).length; });

    const incBoxH = 10 + Math.max(incCount, excCount, 4) * 3.6 + 4;
    checkPageBreak(incBoxH);

    // Left: INCLUSION (Mint Green #ecfdf5)
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin, y, incW, incBoxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('INCLUSION', margin + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    let incItemY = y + 10.5;
    defaultInclusions.forEach(item => {
      const wrapped = doc.splitTextToSize(`• ${item}`, incW - 8);
      wrapped.forEach((l: string) => {
        doc.text(l, margin + 5, incItemY);
        incItemY += 3.6;
      });
    });

    // Right: EXCLUSION (Pastel Rose #fff1f2)
    const excBoxX = margin + incW + 4;
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(excBoxX, y, incW, incBoxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text('EXCLUSION', excBoxX + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    let excItemY = y + 10.5;
    defaultExclusions.forEach(item => {
      const wrapped = doc.splitTextToSize(`• ${item}`, incW - 8);
      wrapped.forEach((l: string) => {
        doc.text(l, excBoxX + 5, excItemY);
        excItemY += 3.6;
      });
    });

    y += incBoxH + 5;

    // ==========================================
    // 9. POLICIES & TERMS
    // ==========================================
    checkPageBreak(40);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Booking Policy', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('• 40% of the total package value is payable at the time of booking.', margin, y + 4.5);
    doc.text('• Remaining balance payable at least 30 days prior to departure or upon arrival.', margin, y + 8.5);

    y += 12.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Cancellation Policy', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('• Cancellations made 30 days or more before the trip are governed by standard vendor policies.', margin, y + 4.5);
    doc.text('• Cancellations made within 30 days are non-refundable.', margin, y + 8.5);

    y += 12.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Terms and Condition', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text('• All bookings subject to availability. Prices may change due to seasonal adjustments.', margin, y + 4.5);
    doc.text('• Guests must carry valid original identification documents (Voter ID/Passport) for permits.', margin, y + 8.5);
    doc.text('• Company is not liable for loss or delay caused by natural disasters, strikes or road conditions.', margin, y + 12.5);

    y += 18;

    // ==========================================
    // 10. HAVE AN AMAZING JOURNEY BANNER
    // ==========================================
    checkPageBreak(24);
    doc.setFillColor(14, 165, 233); // Sky-500
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Have an amazing journey!', margin + 8, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(224, 242, 254);
    doc.text('May your suitcase be light and your experiences heavy!', margin + 8, y + 13.5);

    y += 22;

    // ==========================================
    // 11. GET IN TOUCH & COMPANY BANK DETAILS
    // ==========================================
    checkPageBreak(42);

    // Consultant Card
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(2, 132, 199);
    doc.text('GET IN TOUCH', margin + 5, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(agentName, margin + 5, y + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Your Travel Consultant · +91 75860 47996 · spikycabssiliguri@gmail.com', margin + 35, y + 10.5);

    y += 18;

    // Company & Bank Details Card (with UPI QR box)
    const companyH = 24;
    doc.setFillColor(2, 132, 199); // Sky-600
    doc.roundedRect(margin, y, contentWidth, companyH, 2.5, 2.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('COMPANY INFORMATION & BANK DETAILS', margin + 6, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(224, 242, 254);
    doc.text('Spiky Cabs Taxi Services · Himachal Sarani, Opp Janki Apt, Haiderpara, Siliguri 734001, WB, India', margin + 6, y + 10);
    doc.text('GST No: 19AATFT2250J1Z0 · Website: https://www.spikycabs.in', margin + 6, y + 14);
    doc.text('Bank: HDFC BANK · AC: 50200076588261 · IFSC: HDFC0009312 · Current Account · UPI: spikycabs@upi', margin + 6, y + 18.5);

    // QR Box placeholder on right
    const qrW = 16;
    const qrX = pageWidth - margin - qrW - 6;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX, y + 4, qrW, 16, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(2, 132, 199);
    doc.text('SCAN TO PAY', qrX + qrW / 2, y + 11, { align: 'center' });
    doc.text('UPI / GPay', qrX + qrW / 2, y + 15, { align: 'center' });

    // Page Numbers on all pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, pageHeight - 8, pageWidth - margin, pageHeight - 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Spiky Cabs & Himalayan Travels · Official Travel Quotation', margin, pageHeight - 5);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    }

    const safeGuest = (itinerary.guestName || 'Guest').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`SpikyCabs_Quotation_${safeGuest}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Generate high-definition printable HTML that closely replicates the uploaded reference design
 */
export function generatePrintableHtml(itinerary: CRMItinerary): string {
  const stays = getUniqueHotelStays(itinerary);
  const destTitle = getDestinationTitle(itinerary);
  const guestFirstName = (itinerary.guestName || 'Guest').split(' ')[0];
  const grandTotal = itinerary.pricing.grandTotal || 0;
  const adults = Math.max(1, itinerary.adults || 2);
  const perAdultPrice = Math.round(grandTotal / adults);
  const agentName = itinerary.createdByName || itinerary.assignedAgentName || 'Spiky Cabs Specialist';
  const issueDate = itinerary.createdAt 
    ? new Date(itinerary.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN');

  const daysHtml = (itinerary.days || []).map(day => {
    const bullets: string[] = [];
    if (day.serviceName) bullets.push(day.serviceName);
    if (day.description) {
      day.description.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).slice(0, 4).forEach(s => bullets.push(s.trim()));
    }
    if (day.sightseeingPoints && day.sightseeingPoints.length > 0) {
      bullets.push(`Key Sightseeing: ${day.sightseeingPoints.slice(0, 5).join(', ')}`);
    }
    if (day.hotelName) {
      bullets.push(`Overnight stay in ${day.destination}`);
    }

    return `
      <div style="margin-bottom: 18px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b;">
          Day ${day.dayNumber} / ${day.date || itinerary.travelStartDate || `Day ${day.dayNumber}`}
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 2px 0 6px 0;">
          ${day.destination || day.title}
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.6; color: #334155;">
          ${bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');

  const hotelsHtml = stays.map(s => `
    <div style="background: #ffffff; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="background: #f1f5f9; border-radius: 6px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; color: #64748b; shrink-0;">
          HOTEL
        </div>
        <div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a;">${s.hotelName} | ${s.destination}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${s.nights} Nights · Days ${s.startDay} to ${s.endDay} · No. of rooms - ${s.numberOfRooms}</div>
          <div style="font-size: 11px; font-weight: 600; color: #0284c7; margin-top: 1px;">Meal type - ${s.mealPlan} | Room Category - ${s.roomCategory}</div>
        </div>
      </div>
      <div style="color: #f59e0b; font-size: 14px; letter-spacing: 2px; font-weight: bold;">
        ★★★
      </div>
    </div>
  `).join('');

  const defaultInclusions = itinerary.inclusions?.length ? itinerary.inclusions : [
    'Accommodation in verified partner hotels/resorts',
    'Daily complimentary breakfast included',
    'Arrival & departure airport/station transfers',
    'Day-wise sightseeing transfers as per the itinerary',
    'Dedicated private vehicle for the entire trip',
    'Driver charges, parking & state road toll taxes',
    'Assistance during the entire trip',
    'GST & hill transport allowances'
  ];

  const defaultExclusions = itinerary.exclusions?.length ? itinerary.exclusions : [
    'Entry fees to monuments, parks, museums, ropeway, etc.',
    'Water sports & adventure activities',
    'Personal expenses (laundry, tips, heater charges, calls)',
    'Any kind of drinks (mineral/alcoholic/beverages)',
    'Nathula Pass charges (optional extra permit)',
    'Anything not mentioned in the inclusions'
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${itinerary.guestName}'s trip to ${destTitle} - Spiky Cabs Quotation</title>
  <style>
    @page {
      size: A4;
      margin: 10mm 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    .print-bar {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 12px 18px;
      border-radius: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    .btn {
      background: #0284c7;
      color: #fff;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      text-decoration: none;
    }
    .btn-dark {
      background: #0f172a;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div style="font-size: 13px; color: #475569;">
      <strong>Quotation Preview</strong> · Inspired by luxury travel designer format. Click to print or save as PDF.
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" class="btn btn-dark">🖨️ Print / Save as PDF</button>
      <button onclick="window.close()" class="btn" style="background: #e2e8f0; color: #334155;">Close</button>
    </div>
  </div>

  <div style="max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    
    <!-- 1. Hero Header Banner -->
    <div style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); color: #ffffff; padding: 28px 24px; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
        <div>
          <div style="font-size: 13px; font-weight: 600; color: #e0f2fe;">${guestFirstName}'s trip to</div>
          <h1 style="font-size: 32px; font-weight: 900; margin: 2px 0 6px 0; letter-spacing: -0.5px; color: #ffffff;">${destTitle}</h1>
          <div style="font-size: 12px; font-weight: 600; color: #e0f2fe; margin-bottom: 12px;">Curated By: ${agentName}</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span style="background: #ffffff; color: #0284c7; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 20px;">
              ${itinerary.durationNights}N/${itinerary.durationDays}D • Customizable
            </span>
            <span style="background: rgba(15, 23, 42, 0.4); color: #ffffff; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 20px;">
              REF: ${(itinerary.id || 'QUO').slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        <!-- Floating White Card -->
        <div style="background: #ffffff; color: #0f172a; padding: 14px 18px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 11px; min-width: 240px;">
          <div style="font-weight: 700; color: #64748b; margin-bottom: 4px;">Quotation Date: ${issueDate}</div>
          <div style="font-weight: 600; margin-bottom: 2px;">Mobile: +91 75860 47996 / +91 74780 47996</div>
          <div style="color: #64748b; margin-bottom: 6px;">Email: reservations@spikycabs.in</div>
          <div style="font-size: 10px; font-weight: 700; color: #0284c7; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            Spiky Cabs & Himalayan Travels Desk
          </div>
        </div>
      </div>
    </div>

    <div style="padding: 24px;">
      
      <!-- 2. Overview Tiles -->
      <div style="background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 10px; padding: 16px 20px; margin-bottom: 18px;">
        <div style="font-size: 12px; font-weight: 800; color: #0284c7; letter-spacing: 0.5px; margin-bottom: 12px;">OVERVIEW</div>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; text-align: left;">
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #64748b;">DURATION</div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">${itinerary.durationNights} Nights</div>
            <div style="font-size: 11px; color: #64748b;">${itinerary.durationDays} Days</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #64748b;">TRAVELERS</div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">${itinerary.adults} Adults</div>
            <div style="font-size: 11px; color: #64748b;">${itinerary.children ? `${itinerary.children} Kids` : 'Private Trip'}</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #64748b;">ACCOMMODATION</div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">3 Star / Luxury</div>
            <div style="font-size: 11px; color: #64748b;">Verified Stays</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #64748b;">TRAVEL DATE</div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">${itinerary.travelStartDate || 'Flexible'}</div>
            <div style="font-size: 11px; color: #64748b;">Confirmed Slot</div>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #64748b;">VEHICLE</div>
            <div style="font-size: 14px; font-weight: 800; color: #059669; margin-top: 2px;">${itinerary.vehicleCategory}</div>
            <div style="font-size: 11px; color: #64748b;">${itinerary.vehicleName}</div>
          </div>
        </div>
      </div>

      <!-- 3. Package Summary Box -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 2px;">Package Summary</div>
          <div style="font-size: 22px; font-weight: 900; color: #0284c7;">INR ${grandTotal.toLocaleString('en-IN')}/- for ${adults} Adults</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">
            Note: Package price is tentative and subject to change at confirmation. Hotels subject to availability.
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 18px; font-weight: 800; color: #0f172a;">INR ${perAdultPrice.toLocaleString('en-IN')}/-</div>
          <div style="font-size: 11px; color: #64748b;">Per Adult Price</div>
        </div>
      </div>

      <!-- 4. Final Quotation Summary Banner -->
      <div style="background: #0284c7; color: #ffffff; border-radius: 8px; padding: 12px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-size: 12px; font-weight: 800; color: #ffffff;">Final Quotation Summary</div>
          <div style="font-size: 11px; color: #e0f2fe;">(Valid for a week from the quotation date)</div>
        </div>
        <div style="font-size: 18px; font-weight: 900;">
          Total Quotation Price: INR ${grandTotal.toLocaleString('en-IN')}
        </div>
      </div>

      <!-- 5. Your Itinerary -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0284c7; margin: 0 0 16px 0; border-bottom: 2px solid #e0f2fe; padding-bottom: 6px;">
          Your Itinerary
        </h2>
        ${daysHtml}
      </div>

      <!-- 6. YOUR HOTEL -->
      <div style="background: #0284c7; border-radius: 10px; padding: 18px; margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 12px; letter-spacing: 0.5px;">YOUR HOTEL</div>
        ${hotelsHtml}
      </div>

      <!-- 7. YOUR VEHICLES -->
      <div style="background: #0284c7; border-radius: 10px; padding: 18px; margin-bottom: 24px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 12px; letter-spacing: 0.5px;">YOUR VEHICLES</div>
        <div style="background: #ffffff; border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; gap: 14px;">
          <div style="background: #f1f5f9; border-radius: 6px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; color: #64748b; shrink-0;">
            CAB
          </div>
          <div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${itinerary.vehicleName || 'Dedicated Tourist Fleet'}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              Category: ${itinerary.vehicleCategory} • No of vehicles : 1 • Experienced Hill Driver Included
            </div>
          </div>
        </div>
      </div>

      <!-- 8. INCLUSIONS & EXCLUSIONS -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; page-break-inside: avoid; break-inside: avoid;">
        <!-- Inclusions -->
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 16px;">
          <h3 style="font-size: 12px; font-weight: 800; color: #059669; margin: 0 0 10px 0; letter-spacing: 0.5px;">INCLUSION</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.7; color: #064e3b;">
            ${defaultInclusions.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>

        <!-- Exclusions -->
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 16px;">
          <h3 style="font-size: 12px; font-weight: 800; color: #e11d48; margin: 0 0 10px 0; letter-spacing: 0.5px;">EXCLUSION</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.7; color: #881337;">
            ${defaultExclusions.map(e => `<li>${e}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 9. Policies & Terms -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px; font-size: 11px; color: #475569; line-height: 1.6; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-weight: 800; color: #0f172a; font-size: 12px; margin-bottom: 4px;">Booking Policy</div>
        <div style="margin-bottom: 12px;">
          1. 40% of the total package value is payable at the time of booking.<br>
          2. Remaining balance payable at least 30 days prior to departure or on arrival.
        </div>

        <div style="font-weight: 800; color: #0f172a; font-size: 12px; margin-bottom: 4px;">Cancellation Policy</div>
        <div style="margin-bottom: 12px;">
          • Cancellations made 30 days or more before the trip will be governed by vendor policy.<br>
          • Cancellations made within 30 days is non-refundable.
        </div>

        <div style="font-weight: 800; color: #0f172a; font-size: 12px; margin-bottom: 4px;">Terms and Condition</div>
        <div>
          • All bookings are subject to availability at the time of confirmation.<br>
          • Prices and itineraries may change due to seasonal adjustments or unforeseen circumstances.<br>
          • Customers are responsible for carrying valid identification documents during the trip.<br>
          • The company is not liable for any loss, injury, or delay caused by natural disasters, strikes, or road blocks.
        </div>
      </div>

      <!-- 10. Have an amazing journey Banner -->
      <div style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); color: #ffffff; border-radius: 10px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 18px; font-weight: 900; margin-bottom: 4px;">Have an amazing journey!</div>
        <div style="font-size: 12px; color: #e0f2fe;">May your suitcase be light and your experiences heavy!</div>
      </div>

      <!-- 11. GET IN TOUCH -->
      <div style="background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; page-break-inside: avoid; break-inside: avoid;">
        <div>
          <div style="font-size: 11px; font-weight: 800; color: #0284c7; letter-spacing: 0.5px; margin-bottom: 2px;">GET IN TOUCH</div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${agentName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Your Travel Consultant · +91 75860 47996 / +91 74780 47996</div>
          <div style="font-size: 11px; color: #64748b;">spikycabssiliguri@gmail.com</div>
        </div>
        <div style="font-weight: 900; font-size: 18px; color: #0284c7; letter-spacing: -0.5px;">
          SPIKY CABS
        </div>
      </div>

      <!-- 12. COMPANY INFORMATION & BANK DETAILS -->
      <div style="background: #0284c7; color: #ffffff; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; page-break-inside: avoid; break-inside: avoid;">
        <div style="font-size: 11px; line-height: 1.6; color: #e0f2fe;">
          <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 4px;">COMPANY INFORMATION</div>
          <div style="color: #ffffff; font-weight: 600;">Spiky Cabs Taxi Services & Himalayan Travels</div>
          <div>Himachal Sarani, Opp Janki apt, Haiderpara, Siliguri 734001, West Bengal, India</div>
          <div>GST No: 19AATFT2250J1Z0 · Website: https://www.spikycabs.in</div>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.2);">
            <strong style="color: #ffffff;">Bank Details:</strong> Bank Name: HDFC BANK · Account Name: Spiky Cabs Taxi Services<br>
            AC No: 50200076588261 · IFSC Code: HDFC0009312 · Account Type: CURRENT · UPI ID: spikycabs@upi
          </div>
        </div>

        <div style="background: #ffffff; color: #0284c7; border-radius: 8px; padding: 10px 14px; text-align: center; min-width: 90px;">
          <div style="font-size: 20px; margin-bottom: 2px;">📱</div>
          <div style="font-size: 9px; font-weight: 800; letter-spacing: 0.5px;">SCAN TO PAY</div>
          <div style="font-size: 8px; color: #64748b;">UPI / GPay</div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

/**
 * Universal print handler that handles iframe restrictions gracefully
 */
export function printQuotation(itinerary: CRMItinerary): void {
  try {
    const html = generatePrintableHtml(itinerary);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 60000);
        } catch (iframeErr) {
          console.warn('Iframe print blocked by sandbox, attempting blob/direct PDF fallback:', iframeErr);
          fallbackPrintOrPdf(itinerary, html);
        }
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Hidden iframe creation failed, falling back:', err);
  }

  // Fallback
  const html = generatePrintableHtml(itinerary);
  fallbackPrintOrPdf(itinerary, html);
}

function fallbackPrintOrPdf(itinerary: CRMItinerary, html: string): void {
  try {
    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (win) {
      win.focus();
      return;
    }
  } catch (blobErr) {
    console.warn('Blob window open error:', blobErr);
  }

  // Final guaranteed fallback: download branded PDF directly
  downloadQuotationPDF(itinerary);
}
