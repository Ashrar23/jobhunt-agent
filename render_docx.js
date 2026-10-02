// Render a tailored resume.html (built from templates/resume.html) to a Word .docx
// with the same look as the PDF.
// Usage: node render_docx.js applications/<id>/resume.html   -> applications/<id>/resume.docx
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, BorderStyle, TabStopType,
} = require('docx');

const input = process.argv[2];
if (!input) { console.error('usage: node render_docx.js <resume.html>'); process.exit(1); }
const output = input.replace(/\.html$/, '.docx');

const ACCENT = '3B3BB3', INK = '1A1A1A', NAME = '14142B', MUTED = '666666', CONTACT = '555555';
const FONT = 'Arial';
const pt = (n) => Math.round(n * 2); // docx sizes are half-points

const decode = (s) => s
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ').trim();

let html = fs.readFileSync(input, 'utf8');
html = html.slice(html.indexOf('<body')).replace(/<!--[\s\S]*?-->/g, '');

// Walk the known template elements in document order.
const token = new RegExp([
  '<h1>([\\s\\S]*?)</h1>',
  '<div class="title">([\\s\\S]*?)</div>',
  '<div class="contact">([\\s\\S]*?)</div>',
  '<p class="summary">([\\s\\S]*?)</p>',
  '<h2>([\\s\\S]*?)</h2>',
  '<h3>([\\s\\S]*?)</h3>',
  '<div class="meta">([\\s\\S]*?)</div>',
  '<li>([\\s\\S]*?)</li>',
  '<div><b>([\\s\\S]*?)</b>([\\s\\S]*?)</div>',
  '<div>((?:(?!<div)[\\s\\S])*?)</div>',
].join('|'), 'g');

const base = { font: FONT, size: pt(10), color: INK };
const children = [];
let m;
while ((m = token.exec(html))) {
  const [, h1, title, contact, summary, h2, h3, meta, li, skLabel, skValue, plain] = m;
  if (h1 !== undefined) {
    children.push(new Paragraph({ spacing: { after: 0 },
      children: [new TextRun({ ...base, text: decode(h1), bold: true, size: pt(26), color: NAME })] }));
  } else if (title !== undefined) {
    children.push(new Paragraph({ spacing: { before: 40, after: 60 },
      children: [new TextRun({ ...base, text: decode(title), size: pt(12.5), color: ACCENT })] }));
  } else if (contact !== undefined) {
    children.push(new Paragraph({ spacing: { after: 160 },
      children: [new TextRun({ ...base, text: decode(contact), size: pt(8.8), color: CONTACT })] }));
  } else if (summary !== undefined) {
    children.push(new Paragraph({ spacing: { after: 60, line: 264 },
      children: [new TextRun({ ...base, text: decode(summary) })] }));
  } else if (h2 !== undefined) {
    children.push(new Paragraph({ keepNext: true, spacing: { before: 220, after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 2 } },
      children: [new TextRun({ ...base, text: decode(h2).toUpperCase(), bold: true, size: pt(11.5), color: ACCENT })] }));
  } else if (h3 !== undefined) {
    // "<Title> <span class="tag">— Personal</span>" -> bold title + small grey tag
    const tagMatch = h3.match(/<span class="tag">([\s\S]*?)<\/span>/);
    const runs = [new TextRun({ ...base, text: decode(h3.replace(/<span class="tag">[\s\S]*?<\/span>/, '')), bold: true, size: pt(10.5) })];
    if (tagMatch) runs.push(new TextRun({ ...base, text: ' ' + decode(tagMatch[1]), bold: true, size: pt(8.5), color: MUTED }));
    children.push(new Paragraph({ keepNext: true, spacing: { before: 120, after: 0 }, children: runs }));
  } else if (meta !== undefined) {
    children.push(new Paragraph({ keepNext: true, spacing: { after: 40 },
      children: [new TextRun({ ...base, text: decode(meta), italics: true, size: pt(9), color: MUTED })] }));
  } else if (li !== undefined) {
    children.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 30, line: 252 },
      children: [new TextRun({ ...base, text: decode(li) })] }));
  } else if (skLabel !== undefined) {
    // label, tab, value; hanging indent keeps wrapped lines aligned with the value column
    children.push(new Paragraph({ spacing: { after: 30 },
      tabStops: [{ type: TabStopType.LEFT, position: 2300 }], indent: { left: 2300, hanging: 2300 },
      children: [new TextRun({ ...base, text: decode(skLabel), bold: true }), new TextRun({ ...base, text: '\t' + decode(skValue) })] }));
  } else if (plain !== undefined && decode(plain)) {
    children.push(new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ ...base, text: decode(plain) })] }));
  }
}

const nameMatch = html.match(/<h1>([\s\S]*?)<\/h1>/);
const person = nameMatch ? decode(nameMatch[1]) : 'Resume';
const doc = new Document({
  creator: person,
  title: person + ' — Resume',
  styles: { default: { document: { run: { font: FONT, size: pt(10), color: INK } } } },
  numbering: { config: [{ reference: 'bullets', levels: [{
    level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 300, hanging: 220 } }, run: { color: ACCENT } },
  }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, // A4
      margin: { top: 794, bottom: 794, left: 907, right: 907 } } }, // 14mm / 16mm
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(output, buf); console.log(output); });
