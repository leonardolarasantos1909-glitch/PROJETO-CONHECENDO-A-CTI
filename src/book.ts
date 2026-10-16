export type BookLinkBounds = { left: number; top: number; width: number; height: number };
export type BookLink =
  | { kind: 'page'; page: number; label: string; bounds: BookLinkBounds }
  | { kind: 'external'; href: string; label: string; bounds: BookLinkBounds };
export type BookPage = {
  number: number;
  src: string;
  width: number;
  height: number;
  title: string;
  text: string;
  links: BookLink[];
};
export type BookManifest = {
  version: 1;
  source: string;
  sourceSha256: string;
  pageCount: number;
  pages: BookPage[];
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function validBounds(value: unknown): value is BookLinkBounds {
  if (!isRecord(value)) return false;
  const { left, top, width, height } = value;
  return isFiniteNumber(left) && isFiniteNumber(top) && isFiniteNumber(width) && isFiniteNumber(height)
    && left >= 0 && top >= 0 && width > 0 && height > 0
    && left + width <= 1.001 && top + height <= 1.001;
}

function safeExternalHref(href: string) {
  // Links from a document must never execute a script in the application.
  return /^(?:https?:\/\/|mailto:|tel:)/i.test(href);
}

/** Validate the local manifest before using its paths or document links. */
export function parseBookManifest(value: unknown): BookManifest {
  if (!isRecord(value) || value.version !== 1 || !Number.isInteger(value.pageCount)
    || typeof value.pageCount !== 'number' || value.pageCount < 1 || value.pageCount > 500
    || !Array.isArray(value.pages) || value.pages.length !== value.pageCount
    || typeof value.source !== 'string' || !/^\/materiais\/[a-z0-9_-]+\.pdf$/i.test(value.source)
    || typeof value.sourceSha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(value.sourceSha256)) {
    throw new Error('Manifesto do caderno inválido.');
  }
  const pageCount = value.pageCount;
  const pages = value.pages.map((page: unknown, index: number): BookPage => {
    if (!isRecord(page) || page.number !== index + 1 || typeof page.src !== 'string'
      || !/^\/caderno\/[a-z0-9_/-]+\.(?:webp|png|jpe?g)$/i.test(page.src)
      || !isFiniteNumber(page.width) || page.width <= 0 || !isFiniteNumber(page.height) || page.height <= 0
      || typeof page.title !== 'string' || typeof page.text !== 'string' || !Array.isArray(page.links)) {
      throw new Error('Página do caderno inválida.');
    }
    const links: BookLink[] = [];
    for (const link of page.links as unknown[]) {
      if (!isRecord(link) || !validBounds(link.bounds) || typeof link.label !== 'string') continue;
      if (link.kind === 'page' && typeof link.page === 'number' && Number.isInteger(link.page)
        && link.page >= 1 && link.page <= pageCount) {
        links.push({ kind: 'page', page: link.page, label: link.label, bounds: link.bounds });
      } else if (link.kind === 'external' && typeof link.href === 'string' && safeExternalHref(link.href)) {
        links.push({ kind: 'external', href: link.href, label: link.label, bounds: link.bounds });
      }
    }
    return { number: index + 1, src: page.src, width: page.width, height: page.height, title: page.title, text: page.text, links };
  });
  return { version: 1, source: value.source, sourceSha256: value.sourceSha256, pageCount, pages };
}
