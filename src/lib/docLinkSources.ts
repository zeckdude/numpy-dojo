/**
 * Maps documentation host → logo asset under `public/`.
 * Add entries when linking outside numpy.org (and add the matching file under `public/logos/`).
 */
export const DOC_LINK_SOURCES = {
  numpy: {
    logoSrc: '/logos/numpy-logo.svg',
    name: 'NumPy',
  },
  // Example for future non-NumPy links:
  // python: {
  //   logoSrc: '/logos/python-logo.svg',
  //   name: 'Python',
  // },
} as const;

export type DocLinkSourceId = keyof typeof DOC_LINK_SOURCES;

const DEFAULT_SOURCE: DocLinkSourceId = 'numpy';

function hostnameFromHref(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Resolve which branded logo to show from the doc URL (no per-link logo path in data).
 */
export function resolveDocLinkSource(href: string): DocLinkSourceId {
  const host = hostnameFromHref(href);
  if (!host) return DEFAULT_SOURCE;
  if (host === 'numpy.org' || host.endsWith('.numpy.org')) return 'numpy';
  // When adding links to other sites: register `DOC_LINK_SOURCES.<id>` and map `host` here.
  return DEFAULT_SOURCE;
}

export function docLinkLogoProps(href: string): { src: string; alt: string } {
  const id = resolveDocLinkSource(href);
  const meta = DOC_LINK_SOURCES[id];
  return {
    src: meta.logoSrc,
    alt: `${meta.name} documentation`,
  };
}
