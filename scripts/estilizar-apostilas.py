#!/usr/bin/env python3
"""Aplica a paleta do aplicativo sem reconstruir as páginas das apostilas.

Uso: python3 scripts/estilizar-apostilas.py --source-dir /caminho/anexos
Dependências: PyMuPDF e pypdf. Os arquivos de entrada nunca são sobrescritos.

Altera somente operadores RGB vetoriais conhecidos e acrescenta uma faixa
bordô de 4 pontos onde a margem superior está vazia. Fontes, textos, imagens,
referências, links e a paginação são verificados após a gravação. As credenciais
C2PA auxiliares deixam de certificar o arquivo depois de qualquer alteração e,
quando presentes, são retiradas somente da cópia adaptada.
"""
from __future__ import annotations

import argparse
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path

import fitz
from pypdf import PdfReader, PdfWriter
from pypdf.generic import FloatObject

REPO = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = REPO / "public/materiais/apostilas"
MATERIALS = [
    ("Apostila_Cuidados_Paciente_Critico_CTI_Adulto", "cuidados-paciente-critico", "Cuidados com o paciente crítico", 26),
    ("Apostila_Curativos_e_Cuidados_com_Feridas_CTI_Emergencia_APH", "curativos-feridas", "Curativos e cuidados com feridas", 33),
    ("Apostila_Evolucao_e_Anotacao_de_Enfermagem_no_CTI_Adulto", "evolucao-anotacao-enfermagem", "Evolução e anotação de enfermagem", 22),
    ("Apostila_Medicacoes_e_Bombas_de_Infusao_CTI_Adulto", "medicacoes-bombas-infusao", "Medicações e bombas de infusão", 42),
    ("Apostila_Monitorizacao_e_Equipamentos_CTI_Adulto", "monitorizacao-equipamentos", "Monitorização e equipamentos", 24),
]
# Valores realmente encontrados nas cinco apostilas. Cores de alertas, imagens,
# pretos e quaisquer cores desconhecidas são mantidos sem transformação.
COLOR_GROUPS = {
    "#a73344": ["#174f67", "#17758d", "#14728d", "#0c5b78", "#146c8d", "#123b56", "#133b55", "#143b55", "#18708c", "#176a86", "#102e47"],
    "#293737": ["#263b48", "#253946", "#263d48", "#23343e", "#334b58"],
    "#596b5e": ["#557280", "#526c79", "#567482", "#496474", "#547286", "#476879", "#cce5ef"],
    "#f1f3ed": ["#f2f8fa", "#f6fafb", "#eaf5f7", "#dceef3", "#eef6f8", "#dcecf1", "#f2f7f9", "#edf6f8"],
    "#e1e7df": ["#bdd5dc", "#bfd4dc", "#b7d3dc", "#bed4dc", "#bdd2dc", "#b6ced8", "#a9c4cf", "#c1d4dc"],
    "#738275": ["#16819a", "#16809a", "#14809b"],
}
COLOR_MAP = {source.lower(): target for target, sources in COLOR_GROUPS.items() for source in sources}


def digest(data: bytes) -> str:
    return sha256(data).hexdigest()


def rgb_hex(values) -> str:
    return "#" + "".join(f"{round(float(v) * 255):02x}" for v in values)


def rgb_values(color: str):
    return [FloatObject(int(color[i:i+2], 16) / 255) for i in (1, 3, 5)]


def normalize(value):
    """Compara geometria e estrutura sem depender dos novos números de objetos."""
    if isinstance(value, (fitz.Rect, fitz.Point)):
        return [round(float(x), 6) for x in value]
    if isinstance(value, dict):
        return {k: normalize(v) for k, v in value.items() if k not in {"xref", "id"}}
    if isinstance(value, (tuple, list)):
        return [normalize(v) for v in value]
    if isinstance(value, bytes):
        return value.hex()
    if isinstance(value, float):
        return round(value, 6)
    return value


def text_spans(page):
    return [
        {key: normalize(span[key]) for key in ("text", "font", "size", "flags", "origin", "bbox")}
        for block in page.get_text("dict")["blocks"] if block["type"] == 0
        for line in block["lines"] for span in line["spans"]
    ]


def image_placements(page):
    return normalize(page.get_image_info(hashes=True))


def embedded_resource_hashes(doc, page):
    images = []
    for image in page.get_images(full=True):
        xref, smask = image[:2]
        images.append({
            "resource": list(image[2:]),
            "streamSha256": digest(doc.xref_stream_raw(xref)),
            "maskSha256": digest(doc.xref_stream_raw(smask)) if smask else None,
        })
    fonts = []
    for font in page.get_fonts(full=True):
        xref, *description = font
        _, _, _, font_data = doc.extract_font(xref)
        fonts.append({"description": description[:-1], "sha256": digest(font_data)})
    return {"images": images, "fonts": fonts}


def top_margin_clear(page) -> bool:
    stripe = fitz.Rect(0, 0, page.rect.width, 4)
    for block in page.get_text("dict")["blocks"]:
        if stripe.intersects(fitz.Rect(block["bbox"])):
            return False
    for drawing in page.get_drawings():
        if stripe.intersects(drawing["rect"]):
            return False
    return True


def remove_invalidated_credentials(writer, original_reader):
    """Remove somente a árvore auxiliar Content Credentials conhecida."""
    names = list(original_reader.attachments.keys())
    if not names:
        return []
    if names != ["Content Credentials"]:
        raise ValueError(f"Anexos desconhecidos exigem revisão antes de adaptar: {names}")
    root = writer._root_object
    names_dictionary = root.get("/Names")
    if names_dictionary:
        names_dictionary = names_dictionary.get_object()
        if "/EmbeddedFiles" in names_dictionary:
            del names_dictionary["/EmbeddedFiles"]
        if not names_dictionary:
            del root["/Names"]
    if "/AF" in root:
        del root["/AF"]
    return names


def validate(original: Path, adapted: Path, stripes, changed_colors):
    original_reader, adapted_reader = PdfReader(original), PdfReader(adapted, strict=True)
    source_doc, adapted_doc = fitz.open(original), fitz.open(adapted)
    if len(source_doc) != len(adapted_doc):
        raise AssertionError("A paginação foi alterada")
    if dict(original_reader.metadata or {}) != dict(adapted_reader.metadata or {}):
        raise AssertionError("Metadados de autoria ou criação foram alterados")
    if original_reader.pdf_header != adapted_reader.pdf_header:
        raise AssertionError("Versão do PDF foi alterada")
    if list(adapted_reader.attachments.keys()):
        raise AssertionError("A cópia adaptada reteve credenciais auxiliares inválidas")
    total_images = total_links = total_text_characters = 0
    for index, (source_page, adapted_page) in enumerate(zip(source_doc, adapted_doc)):
        if source_page.get_text() != adapted_page.get_text():
            raise AssertionError(f"Texto diferente na página {index + 1}")
        if text_spans(source_page) != text_spans(adapted_page):
            raise AssertionError(f"Fonte ou posição de texto diferente na página {index + 1}")
        if normalize(source_page.rect) != normalize(adapted_page.rect):
            raise AssertionError(f"Dimensões diferentes na página {index + 1}")
        if normalize(source_page.get_links()) != normalize(adapted_page.get_links()):
            raise AssertionError(f"Links diferentes na página {index + 1}")
        if image_placements(source_page) != image_placements(adapted_page):
            raise AssertionError(f"Imagem ou posição diferente na página {index + 1}")
        if embedded_resource_hashes(source_doc, source_page) != embedded_resource_hashes(adapted_doc, adapted_page):
            raise AssertionError(f"Bytes de fonte ou imagem diferentes na página {index + 1}")
        original_ops = original_reader.pages[index].get_contents().operations
        output_ops = adapted_reader.pages[index].get_contents().operations
        original_count = len(original_ops)
        if len(output_ops) != original_count + (5 if stripes[index] else 0):
            raise AssertionError(f"Operadores inesperados na página {index + 1}")
        for (original_args, original_op), (output_args, output_op) in zip(original_ops, output_ops[:original_count]):
            if original_op != output_op:
                raise AssertionError("Operador estrutural alterado")
            expected_args = original_args
            if original_op in (b"rg", b"RG"):
                target = COLOR_MAP.get(rgb_hex(original_args))
                if target:
                    # FloatObject pode ser serializado com uma precisão menor;
                    # tolerância menor que um milionésimo não modifica desenho.
                    expected_args = rgb_values(target)
            if len(expected_args) != len(output_args):
                raise AssertionError("Quantidade de argumentos alterada")
            for expected, actual in zip(expected_args, output_args):
                if isinstance(expected, (int, float)):
                    if abs(float(expected) - float(actual)) > 1e-6:
                        raise AssertionError("Coordenada ou argumento não autorizado foi alterado")
                elif expected != actual:
                    raise AssertionError("Conteúdo não visual foi alterado")
        total_images += len(source_page.get_image_info())
        total_links += len(source_page.get_links())
        total_text_characters += len(source_page.get_text())
    return {
        "allPagesChecked": len(source_doc),
        "textExact": True,
        "textCharacters": total_text_characters,
        "fontBytesAndTextGeometryExact": True,
        "imageBytesAndGeometryExact": True,
        "images": total_images,
        "linksAndGeometryExact": True,
        "links": total_links,
        "pageDimensionsExact": True,
        "authorAndReferenceMetadataExact": True,
        "onlyKnownRgbOperatorsAndClearMarginStripeChanged": True,
        "colorOperatorsChanged": sum(changed_colors.values()),
        "topMarginStripes": sum(stripes),
        "clinicalReviewPerformed": False,
        "antivirusScanPerformed": False,
    }


def adapt(original: Path, slug: str, title: str, expected_pages: int, output_dir: Path):
    reader = PdfReader(original)
    if len(reader.pages) != expected_pages:
        raise ValueError(f"Quantidade inesperada de páginas em {original.name}")
    writer = PdfWriter(clone_from=reader)
    writer.pdf_header = reader.pdf_header
    removed_credentials = remove_invalidated_credentials(writer, reader)
    doc = fitz.open(original)
    changed_colors = Counter()
    stripes = []
    for number, page in enumerate(writer.pages):
        content = page.get_contents()
        if content is None:
            raise ValueError("Página sem conteúdo exige revisão")
        operations = content.operations
        for index, (args, operator) in enumerate(operations):
            if operator in (b"rg", b"RG"):
                source_color = rgb_hex(args)
                target_color = COLOR_MAP.get(source_color)
                if target_color:
                    operations[index] = (rgb_values(target_color), operator)
                    changed_colors[f"{source_color} → {target_color}"] += 1
        add_stripe = top_margin_clear(doc[number])
        stripes.append(add_stripe)
        if add_stripe:
            width, height = float(page.mediabox.width), float(page.mediabox.height)
            operations += [
                ([], b"q"), (rgb_values("#a73344"), b"rg"),
                ([FloatObject(0), FloatObject(height - 4), FloatObject(width), FloatObject(4)], b"re"),
                ([], b"f"), ([], b"Q"),
            ]
        content.operations = operations
        page.replace_contents(content)
        page.compress_content_streams()
    # Compactação sem reamostrar imagens ou substituir fontes.
    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    destination = output_dir / f"{slug}.pdf"
    with destination.open("wb") as handle:
        writer.write(handle)
    validation = validate(original, destination, stripes, changed_colors)
    result = {
        "id": slug,
        "title": title,
        "href": f"/materiais/apostilas/{slug}.pdf",
        "sourceName": original.name,
        "sourceSha256": digest(original.read_bytes()),
        "sourceBytes": original.stat().st_size,
        "sha256": digest(destination.read_bytes()),
        "bytes": destination.stat().st_size,
        "pages": len(reader.pages),
        "paletteChanges": dict(sorted(changed_colors.items())),
        "auxiliaryCredentialsRemovedFromAdaptedCopy": removed_credentials,
        "validation": validation,
    }
    print(f"{slug}: {result['pages']} páginas, {result['bytes']} bytes; texto, fontes, imagens e links preservados")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    materials = []
    for prefix, slug, title, pages in MATERIALS:
        matches = sorted(args.source_dir.rglob(prefix + "*.pdf"))
        if not matches:
            print(f"Pendente: {prefix}.pdf (arquivo de origem não encontrado)")
            continue
        if len(matches) != 1:
            raise ValueError(f"Mais de uma origem encontrada para {prefix}")
        materials.append(adapt(matches[0], slug, title, pages, args.output_dir))
    report = {
        "version": 1,
        "description": "Cópias com identidade visual do aplicativo; conteúdo médico original não reescrito.",
        "originalsPreserved": "Os arquivos recebidos são preservados fora do pacote público do aplicativo.",
        "credentialsNote": "Credenciais C2PA auxiliares não certificam um PDF alterado; quando presentes, foram retiradas apenas das cópias adaptadas. Isso não equivale a uma análise antivírus.",
        "clinicalReview": "A adaptação foi visual. Revisão clínica, atualização bibliográfica e autorização institucional ou de terceiros continuam pendentes.",
        "materials": materials,
    }
    (args.output_dir / "integridade.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
