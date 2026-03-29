import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function generatePdf(html: string, reference: string): Promise<Buffer> {
  // Write rendered HTML to a temp file so Puppeteer can resolve relative paths
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `${reference}.html`);

  // Copy logo to temp dir so relative path resolves
  const logoSrc = path.join(process.cwd(), 'templates', 'logo.png');
  const logoDst = path.join(tmpDir, 'logo.png');
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, logoDst);
  }

  fs.writeFileSync(tmpFile, html, 'utf-8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${tmpFile}`, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
    fs.unlinkSync(tmpFile);
  }
}