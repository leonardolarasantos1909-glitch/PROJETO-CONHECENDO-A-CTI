#!/usr/bin/env python3
"""Generate the reviewed-source leaflet layouts without adding a browser dependency.

Requires reportlab and PyMuPDF in the document-preparation environment. Fonts are
embedded subsets of DejaVu Sans. Existing app PDFs are never opened for writing.
"""
import hashlib
import json
from html import escape
from pathlib import Path

import fitz
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, A5, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'src/data/family-leaflet.json'
OUTPUT = ROOT / 'public/materiais/acolher-familia'
FONT_DIRECTORY = Path('/usr/share/fonts/truetype/dejavu')

for name, filename in [('Leaflet', 'DejaVuSans.ttf'), ('LeafletBold', 'DejaVuSans-Bold.ttf')]:
    font_path = FONT_DIRECTORY / filename
    if not font_path.is_file():
        raise SystemExit(f'Fonte necessária para regenerar o folheto: {font_path}')
    pdfmetrics.registerFont(TTFont(name, str(font_path)))

data = json.loads(SOURCE.read_text())
assert [page['number'] for page in data['pages']] == [1, 2, 3, 4]
assert data['print']['sheets'] == [[4, 1], [2, 3]]
assert data['lastClinicalReview'] is None, 'Não inventar uma data de revisão clínica.'
OUTPUT.mkdir(parents=True, exist_ok=True)
WINE = colors.HexColor('#9e3041')
GREEN = colors.HexColor('#354735')
MUTED = colors.HexColor('#435c49')
LINE = colors.HexColor('#b7c2b3')
PAGE_W, PAGE_H = A5
MARGIN = 12 * mm
CONTENT_W = PAGE_W - MARGIN * 2
FOOTER_TOP = 69
fit_details = []


def paragraph(pdf, text, y, *, size=13, leading=18, bold=False, color=GREEN, width=CONTENT_W):
    style = ParagraphStyle('leaflet', fontName='LeafletBold' if bold else 'Leaflet',
                           fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT,
                           splitLongWords=False, allowWidows=0, allowOrphans=0)
    para = Paragraph(escape(text), style)
    _, height = para.wrap(width, PAGE_H)
    para.drawOn(pdf, MARGIN, y - height)
    return y - height


def illustration(pdf, top, height=118):
    """Same original partnership drawing as the HTML preview, in vector form."""
    scale = min(CONTENT_W / 320, height / 160)
    x = MARGIN + (CONTENT_W - 320 * scale) / 2
    pdf.saveState()
    pdf.translate(x, top)
    pdf.scale(scale, -scale)
    pdf.setStrokeColor(WINE)
    pdf.setLineWidth(3.5)
    pdf.setLineCap(1)
    pdf.setLineJoin(1)
    for cx in [76, 244]:
        pdf.circle(cx, 48, 19, stroke=1, fill=0)
    for x0, cx in [(40, 76), (208, 244)]:
        p = pdf.beginPath()
        p.moveTo(x0, 135)
        p.lineTo(x0, 109)
        p.curveTo(x0, 88, cx - 20, 73, cx, 73)
        p.curveTo(cx + 20, 73, cx + 36, 88, cx + 36, 109)
        p.lineTo(cx + 36, 135)
        pdf.drawPath(p)
    p = pdf.beginPath()
    for index, (px, py) in enumerate([(94, 105), (131, 128), (160, 115), (189, 128), (226, 105)]):
        p.moveTo(px, py) if index == 0 else p.lineTo(px, py)
    pdf.drawPath(p)
    pdf.line(70, 93, 70, 120)
    pdf.line(60, 107, 80, 107)
    p = pdf.beginPath()
    p.moveTo(160, 94)
    p.lineTo(132, 69)
    p.curveTo(112, 51, 139, 25, 160, 48)
    p.curveTo(181, 25, 208, 51, 188, 69)
    p.close()
    pdf.drawPath(p)
    p = pdf.beginPath()
    p.moveTo(115, 27)
    p.lineTo(124, 18)
    p.lineTo(196, 18)
    p.lineTo(196, 39)
    p.lineTo(179, 39)
    pdf.drawPath(p)
    pdf.line(205, 38, 196, 47)
    pdf.restoreState()
    return top - 160 * scale


def footer(pdf, number):
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(.6)
    pdf.line(MARGIN, FOOTER_TOP, PAGE_W - MARGIN, FOOTER_TOP)
    issue_date = '/'.join(reversed(data['updatedAt'].split('-')))
    rows = [data['statusNotice'], f"Versão {data['version']} · Atualização editorial: {issue_date}",
            'Revisão clínica: não realizada · Revisão institucional: pendente']
    y = FOOTER_TOP - 15
    for index, row in enumerate(rows):
        pdf.setFont('LeafletBold' if index == 0 else 'Leaflet', 8.2)
        pdf.setFillColor(MUTED)
        pdf.drawString(MARGIN, y, row)
        y -= 11
    pdf.setFont('Leaflet', 9)
    pdf.drawRightString(PAGE_W - MARGIN, 17, f'{number} / 4')


def make_reading_pdf():
    path = OUTPUT / 'folheto-familia-a5.pdf'
    pdf = canvas.Canvas(str(path), pagesize=A5, invariant=1, pageCompression=1)
    pdf.setTitle(data['fullTitle'])
    pdf.setAuthor('Conhecendo a CTI — material educativo em avaliação')
    pdf.setSubject('Quatro páginas A5 em ordem de leitura. Validação institucional pendente.')
    for page in data['pages']:
        y = PAGE_H - MARGIN
        y = paragraph(pdf, f"{data['projectName']} · Para familiares", y, size=9.5, leading=13, color=MUTED)
        pdf.setLineWidth(.6)
        pdf.setStrokeColor(LINE)
        pdf.line(MARGIN, y - 8, PAGE_W - MARGIN, y - 8)
        y -= 28
        y = paragraph(pdf, page['title'], y, size=28 if page['number'] == 1 else 21,
                      leading=34 if page['number'] == 1 else 26, bold=True, color=WINE)
        y -= 16
        if page.get('subtitle'):
            y = paragraph(pdf, page['subtitle'], y, size=22, leading=28, bold=True)
            y -= 18
        if page.get('intro'):
            y = paragraph(pdf, page['intro'], y, size=13, leading=17.5)
            y -= 18
        if page['number'] == 1:
            y = illustration(pdf, y, 127)
            y -= 18
        for block in page.get('blocks', []):
            y = paragraph(pdf, block['title'], y, size=13, leading=18, bold=True)
            y -= 4
            y = paragraph(pdf, block['text'], y, size=13, leading=17.5)
            y -= 10
        if page.get('message'):
            if page['number'] != 1:
                pdf.setStrokeColor(WINE)
                pdf.setLineWidth(1)
                pdf.line(MARGIN, y - 1, PAGE_W - MARGIN, y - 1)
                y -= 15
            y = paragraph(pdf, page['message'], y, size=14 if page['number'] == 1 else 13,
                          leading=20 if page['number'] == 1 else 18)
        assert y >= FOOTER_TOP + 14, f"Página {page['number']} excede a área de leitura: {y:.1f}"
        fit_details.append({'page': page['number'], 'lastBodyBaseline': round(y, 2), 'footerTop': FOOTER_TOP,
                            'bodyFontPt': 13, 'bodyFits': True})
        footer(pdf, page['number'])
        pdf.showPage()
    pdf.save()
    return path


reading = make_reading_pdf()
reading_doc = fitz.open(reading)
print_doc = fitz.open()
A4_W, A4_H = landscape(A4)
for sheet in data['print']['sheets']:
    page = print_doc.new_page(width=A4_W, height=A4_H)
    for side, logical_number in enumerate(sheet):
        bounds = fitz.Rect(side * A4_W / 2, 0, (side + 1) * A4_W / 2, A4_H)
        page.show_pdf_page(bounds, reading_doc, logical_number - 1, keep_proportion=True)
    page.draw_line(fitz.Point(A4_W / 2, 7 * mm), fitz.Point(A4_W / 2, A4_H - 7 * mm),
                   color=(.7, .7, .7), width=.3, dashes='[2 3] 0')
print_doc.set_metadata({'title': data['fullTitle'], 'author': 'Conhecendo a CTI — material educativo em avaliação',
                        'subject': 'A4 paisagem: frente 4|1, verso 2|3; borda curta; dobrar ao meio.'})
imposed = OUTPUT / 'folheto-familia-a4.pdf'
print_doc.save(imposed, garbage=4, deflate=True, no_new_id=True)
print_doc.close()
reading_doc.close()

materials = []
for record in data['pdfs']:
    file_path = ROOT / 'public' / record['href'].lstrip('/')
    content = file_path.read_bytes()
    doc = fitz.open(file_path)
    assert len(doc) == record['pages']
    materials.append({**record, 'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest(),
                      'mediaBox': [round(doc[0].rect.width, 4), round(doc[0].rect.height, 4)]})
    doc.close()
manifest = {
    'version': 1, 'source': 'src/data/family-leaflet.json',
    'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'contentVersion': data['version'], 'updatedAt': data['updatedAt'],
    'lastClinicalReview': data['lastClinicalReview'], 'validationStatus': data['validationStatus'],
    'logicalPages': 4, 'printOrder': data['print']['sheets'],
    'materials': materials, 'fit': fit_details,
}
(OUTPUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'output': str(OUTPUT), 'materials': materials, 'fit': fit_details}, ensure_ascii=False, indent=2))
