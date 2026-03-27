#!/usr/bin/env node
/**
 * Generates a multi-page PDF from the individual room SVG blueprints.
 * Page 1: Title page with KoP seal and title
 * Pages 2+: Individual room blueprints (no overview)
 *
 * Usage: node gen-pdf.js (run from project root where sharp/pdf-lib are installed)
 * Output: "KoP Helmet Lodge No. 33 Event Floor Plans.pdf"
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');

const DIR = __dirname;
const SEAL_PATH = path.join(DIR, '../../website/public/seal.png');
const OUTPUT = path.join(DIR, 'KoP Helmet Lodge No. 33 Event Floor Plans.pdf');

// Individual room pages only (no overview)
const PAGES = [
  { file: 'dining-hall.svg', title: 'Dining Hall' },
  { file: 'grand-hall.svg', title: 'Grand Hall' },
  { file: 'lobby.svg', title: 'Lobby' },
  { file: 'parking-lot.svg', title: 'Parking Lot' },
  { file: 'upstairs-hallway.svg', title: 'Upstairs Hallway' },
];

async function svgToPng(svgPath, width = 2400) {
  const svgBuf = fs.readFileSync(svgPath);
  return sharp(svgBuf)
    .resize({ width, fit: 'inside' })
    .png()
    .toBuffer();
}

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle('KoP Helmet Lodge No. 33 Event Floor Plans');
  doc.setAuthor('Knights of Pythias \u2014 Helmet Lodge No. 33');
  doc.setSubject('Architectural floor plans with measurements');

  // ── Title Page ──
  const pageW = 792, pageH = 612; // landscape letter
  const titlePage = doc.addPage([pageW, pageH]);

  // Embed seal
  if (fs.existsSync(SEAL_PATH)) {
    const sealBuf = fs.readFileSync(SEAL_PATH);
    const sealImg = await doc.embedPng(sealBuf);
    const sealSize = 200;
    titlePage.drawImage(sealImg, {
      x: (pageW - sealSize) / 2,
      y: (pageH - sealSize) / 2 + 40,
      width: sealSize,
      height: sealSize,
    });
  }

  // Title text (pdf-lib uses bottom-left origin)
  const { rgb } = require('pdf-lib');
  titlePage.drawText('KoP Helmet Lodge No. 33', {
    x: pageW / 2 - 155,
    y: (pageH - 200) / 2 - 20,
    size: 26,
    color: rgb(0.1, 0.1, 0.18),
  });
  titlePage.drawText('Event Floor Plans', {
    x: pageW / 2 - 100,
    y: (pageH - 200) / 2 - 50,
    size: 20,
    color: rgb(0.33, 0.33, 0.33),
  });
  console.log('Added title page');

  // ── Blueprint Pages ──
  for (const pg of PAGES) {
    const svgPath = path.join(DIR, pg.file);
    if (!fs.existsSync(svgPath)) {
      console.warn(`Skipping ${pg.file} \u2014 not found`);
      continue;
    }

    const pngBuf = await svgToPng(svgPath);
    const img = await doc.embedPng(pngBuf);
    const { width: iw, height: ih } = img.scale(1);

    const margin = 36;
    const maxW = pageW - margin * 2, maxH = pageH - margin * 2;
    const scale = Math.min(maxW / iw, maxH / ih);
    const drawW = iw * scale, drawH = ih * scale;

    const page = doc.addPage([pageW, pageH]);
    page.drawImage(img, {
      x: margin + (maxW - drawW) / 2,
      y: margin + (maxH - drawH) / 2,
      width: drawW,
      height: drawH,
    });

    console.log(`Added page: ${pg.title}`);
  }

  const bytes = await doc.save();
  fs.writeFileSync(OUTPUT, bytes);
  console.log(`\nPDF saved: ${OUTPUT}`);
}

main().catch(console.error);
