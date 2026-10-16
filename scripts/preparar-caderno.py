#!/usr/bin/env python3
"""Prepare páginas estáticas do PDF, sem modificar nem buscar conteúdo externo.

Execute na raiz do repositório: python scripts/preparar-caderno.py
Dependências usadas: PyMuPDF==1.26.6 e Pillow==12.3.0.
O leitor usa apenas WebP e JSON; as dependências Python não são de produção.
"""

from __future__ import annotations

import hashlib
import json
import re
import tempfile
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

import fitz
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/materiais/caderno-cti-adulto-digital.pdf"
DESTINATION = ROOT / "public/caderno"
SOURCE_URL = "/materiais/caderno-cti-adulto-digital.pdf"
WIDTH = 1440
QUALITY = 90
GENERATED_PAGE = re.compile(r"pagina-[0-9]{3,}\.webp\Z")


def previous_pages() -> set[str]:
    """Só reconhece como geradas as páginas do nosso manifesto anterior."""
    manifest = DESTINATION / "paginas.json"
    if not manifest.exists():
        return set()
    data = json.loads(manifest.read_text(encoding="utf-8"))
    if data.get("version") != 1 or data.get("source") != SOURCE_URL:
        raise RuntimeError("O manifesto existente não pertence a esta geração.")
    owned = set()
    for page in data.get("pages", []):
        src = page.get("src", "")
        name = src.removeprefix("/caderno/")
        if src != f"/caderno/{name}" or not GENERATED_PAGE.fullmatch(name):
            raise RuntimeError("Caminho inesperado no manifesto anterior.")
        owned.add(name)
    return owned


def page_title(text: str, number: int) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines or lines[0].endswith(":") or len(lines[0]) > 80:
        return f"Página {number}"
    # Os títulos são linhas reais do documento, sem reescrever conteúdo clínico.
    chosen = [lines[0]]
    if len(lines) > 1 and len(lines[1]) <= 80 and not lines[1].endswith(":"):
        chosen.append(lines[1])
    return " — ".join(chosen)


def page_links(page: fitz.Page, count: int, warnings: Counter) -> list[dict]:
    result = []
    rect = page.rect
    for link in page.get_links():
        area = fitz.Rect(link.get("from", fitz.Rect())) & rect
        if area.is_empty or area.is_infinite:
            warnings["links sem retângulo visível"] += 1
            continue
        bounds = {
            "left": area.x0 / rect.width,
            "top": area.y0 / rect.height,
            "width": area.width / rect.width,
            "height": area.height / rect.height,
        }
        kind = link.get("kind")
        if kind == fitz.LINK_GOTO:
            destination = link.get("page", -1)
            if not isinstance(destination, int) or not 0 <= destination < count:
                warnings["destinos de página inválidos"] += 1
                continue
            result.append({
                "kind": "page",
                "page": destination + 1,
                "label": f"Ir para página {destination + 1}",
                "bounds": bounds,
            })
        elif kind == fitz.LINK_URI:
            href = link.get("uri", "")
            try:
                parsed = urlsplit(href)
                allowed = (
                    parsed.scheme.lower() in {"http", "https"}
                    and bool(parsed.hostname)
                    and not any(ord(char) < 32 for char in href)
                )
            except ValueError:
                allowed = False
            if not allowed:
                warnings["URLs fora de HTTP/HTTPS descartadas"] += 1
                continue
            label = " ".join(page.get_textbox(area).split())
            result.append({
                "kind": "external",
                "href": href,
                "label": label if label and len(label) <= 180 else "Abrir referência",
                "bounds": bounds,
            })
        else:
            warnings["tipos de links não suportados"] += 1
    return result


def render_page(page: fitz.Page, target: Path) -> tuple[int, int]:
    zoom = WIDTH / page.rect.width
    pixmap = page.get_pixmap(
        matrix=fitz.Matrix(zoom, zoom), colorspace=fitz.csRGB, alpha=False
    )
    size = (WIDTH, round(page.rect.height * WIDTH / page.rect.width))
    with Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples) as image:
        del pixmap
        if image.size != size:
            with image.resize(size, Image.Resampling.LANCZOS) as resized:
                resized.save(target, "WEBP", quality=QUALITY, method=6, exact=True)
        else:
            image.save(target, "WEBP", quality=QUALITY, method=6, exact=True)
    return size


def main() -> None:
    with SOURCE.open("rb") as source_file:
        source_hash = hashlib.file_digest(source_file, "sha256").hexdigest()
    DESTINATION.mkdir(parents=True, exist_ok=True)
    owned = previous_pages()
    warnings: Counter = Counter()
    pages = []
    # Renderização sequencial: só uma página e sua imagem ficam na memória.
    # As saídas são preparadas antes de substituir o conjunto já existente.
    with fitz.open(SOURCE) as document, tempfile.TemporaryDirectory(
        prefix=".preparar-caderno-", dir=DESTINATION
    ) as temporary:
        staging = Path(temporary)
        for index in range(len(document)):
            number = index + 1
            name = f"pagina-{number:03}.webp"
            target = DESTINATION / name
            if target.exists() and name not in owned:
                raise RuntimeError(f"Arquivo não gerado preservado: {target}")
            page = document[index]
            text = page.get_text("text", sort=False)
            width, height = render_page(page, staging / name)
            pages.append({
                "number": number,
                "src": f"/caderno/{name}",
                "width": width,
                "height": height,
                "title": page_title(text, number),
                "text": text,
                "links": page_links(page, len(document), warnings),
            })
            print(f"Página {number}/{len(document)} preparada", flush=True)
        manifest = {
            "version": 1,
            "source": SOURCE_URL,
            "sourceSha256": source_hash,
            "pageCount": len(pages),
            "pages": pages,
        }
        (staging / "paginas.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        names = {Path(page["src"]).name for page in pages}
        for name in sorted(names):
            (staging / name).replace(DESTINATION / name)
        (staging / "paginas.json").replace(DESTINATION / "paginas.json")
        for name in sorted(owned - names):
            # Sem glob ou remoção recursiva: apenas nomes do manifesto anterior.
            (DESTINATION / name).unlink(missing_ok=True)

    total_bytes = sum((DESTINATION / Path(page["src"]).name).stat().st_size for page in pages)
    manifest_bytes = (DESTINATION / "paginas.json").stat().st_size
    links = Counter(link["kind"] for page in pages for link in page["links"])
    print(f"Fonte: {SOURCE.relative_to(ROOT)}")
    print(f"SHA-256: {source_hash}")
    print(f"Páginas: {len(pages)}; imagens: {total_bytes:,} bytes; JSON: {manifest_bytes:,} bytes")
    print(f"Links preservados: {dict(links)}")
    print(f"Avisos: {dict(warnings) if warnings else 'nenhum'}")


if __name__ == "__main__":
    main()
