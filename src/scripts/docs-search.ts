type PagefindSearchResultData = {
  url: string;
  excerpt?: string;
  meta: {
    title?: string;
    category?: string;
    preview?: string;
  };
};

type PagefindSearch = {
  results: Array<{
    data: () => Promise<PagefindSearchResultData>;
  }>;
};

type PagefindApi = {
  debouncedSearch: (
    term: string,
    options?: Record<string, never>,
    debounceTimeoutMs?: number,
  ) => Promise<PagefindSearch | null>;
};

type SearchEntry = {
  title: string;
  excerpt: string;
  category: string;
  url: string;
};

type SearchElements = {
  input: HTMLInputElement;
  results: HTMLDivElement;
};

const MAX_RESULTS = 8;
const SEARCH_DEBOUNCE_MS = 150;
const PAGEFIND_BUNDLE_URL = '/pagefind/pagefind.js';

let pagefindPromise: Promise<PagefindApi | null> | undefined;
let searchShortcutsBound = false;

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '').trim();

const normalizeSearchUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.origin);
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return value.replace(/\/$/, '') || '/';
  }
};

const getPagefind = () => {
  if (!pagefindPromise) {
    pagefindPromise = import(/* @vite-ignore */ PAGEFIND_BUNDLE_URL)
      .then((module) => module as PagefindApi)
      .catch((error) => {
        console.error('Unable to load the Pagefind bundle.', error);
        return null;
      });
  }

  return pagefindPromise;
};

const getSearchElements = (root: HTMLElement): SearchElements | null => {
  const input = root.querySelector('[data-search-input]');
  const results = root.querySelector('[data-search-results]');

  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLDivElement)) {
    return null;
  }

  return { input, results };
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
};

const getPreferredSearchInput = () => {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-docs-search]'));

  for (const root of roots) {
    if (root.offsetParent === null) continue;

    const elements = getSearchElements(root);
    if (!elements || elements.input.disabled) continue;

    return elements.input;
  }

  return null;
};

const focusSearchInput = () => {
  const input = getPreferredSearchInput();
  if (!input) return;

  input.focus();
  input.select();
};

const bindSearchShortcuts = () => {
  if (searchShortcutsBound) return;
  searchShortcutsBound = true;

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) return;
    if (isEditableTarget(event.target)) return;

    const isSlashShortcut = event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;
    const isCommandPaletteShortcut =
      event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.altKey;

    if (!isSlashShortcut && !isCommandPaletteShortcut) return;

    event.preventDefault();
    focusSearchInput();
  });
};

const renderEmptyState = (results: HTMLDivElement, message: string) => {
  results.innerHTML = `<p class="px-4 py-4 text-sm text-[var(--color-text-muted)]">${escapeHtml(message)}</p>`;
  results.classList.remove('hidden');
};

const renderResults = (results: HTMLDivElement, entries: SearchEntry[]) => {
  results.innerHTML = entries
    .map(
      (entry) => `
        <a href="${escapeHtml(entry.url)}" class="block px-4 py-3 transition-colors hover:bg-[var(--color-hover-surface)]">
          <div class="search-result-title text-sm font-medium text-[var(--color-accent)]">${escapeHtml(entry.title)}</div>
          ${entry.excerpt ? `<div class="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">${escapeHtml(entry.excerpt)}</div>` : ''}
        </a>
      `,
    )
    .join('');
  results.classList.remove('hidden');
};

const getSuggestions = (root: HTMLElement): SearchEntry[] => {
  const rawSuggestions = root.dataset.searchSuggestions;
  if (!rawSuggestions) return [];

  try {
    const parsed = JSON.parse(rawSuggestions) as SearchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getSearchPreviews = (root: HTMLElement) => {
  const rawPreviews = root.dataset.searchPreviews;
  if (!rawPreviews) return {} as Record<string, string>;

  try {
    const parsed = JSON.parse(rawPreviews) as Record<string, string>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const renderSuggestions = (root: HTMLElement, results: HTMLDivElement) => {
  const suggestions = getSuggestions(root);
  if (suggestions.length === 0) {
    results.classList.add('hidden');
    results.innerHTML = '';
    return;
  }

  renderResults(results, suggestions);
};

const setSearchUnavailable = (input: HTMLInputElement, results: HTMLDivElement, message: string) => {
  input.disabled = true;
  input.setAttribute('aria-disabled', 'true');
  renderEmptyState(results, message);
};

const searchPagefind = async (
  query: string,
  searchPreviews: Record<string, string>,
): Promise<SearchEntry[] | null | undefined> => {
  const pagefind = await getPagefind();
  if (!pagefind) return null;

  const search = await pagefind.debouncedSearch(query, {}, SEARCH_DEBOUNCE_MS);
  if (!search) return undefined;

  return Promise.all(
    search.results.slice(0, MAX_RESULTS).map(async (result) => {
      const data = await result.data();
      const normalizedUrl = normalizeSearchUrl(data.url);
      const preview = searchPreviews[normalizedUrl] ?? data.meta.preview ?? stripTags(data.excerpt ?? '');

      return {
        title: data.meta.title ?? 'Untitled',
        excerpt: preview,
        category: data.meta.category ?? 'Docs',
        url: data.url,
      };
    }),
  );
};

const attachSearch = (root: HTMLElement) => {
  const elements = getSearchElements(root);
  if (!elements) return;

  const { input, results } = elements;
  const emptyMessage = root.dataset.searchEmpty ?? 'No matching articles found.';
  const errorMessage = root.dataset.searchError ?? 'Search is temporarily unavailable.';
  const searchPreviews = getSearchPreviews(root);
  let latestQuery = '';

  input.addEventListener(
    'focus',
    () => {
      void getPagefind();
      if (!input.value.trim()) {
        renderSuggestions(root, results);
      }
    },
  );

  input.addEventListener('click', () => {
    if (!input.value.trim()) {
      renderSuggestions(root, results);
    }
  });

  input.addEventListener('input', async () => {
    const query = input.value.trim();
    latestQuery = query;

    if (!query) {
      renderSuggestions(root, results);
      return;
    }

    const matches = await searchPagefind(query, searchPreviews);
    if (query !== latestQuery) return;

    if (matches === undefined) {
      return;
    }

    if (matches === null) {
      setSearchUnavailable(input, results, errorMessage);
      return;
    }

    if (matches.length === 0) {
      renderEmptyState(results, emptyMessage);
      return;
    }

    renderResults(results, matches);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!root.contains(target)) {
      results.classList.add('hidden');
    }
  });
};

const initDocsSearch = () => {
  bindSearchShortcuts();

  document.querySelectorAll<HTMLElement>('[data-docs-search]').forEach((root) => {
    if (root.dataset.searchBound === 'true') return;
    root.dataset.searchBound = 'true';
    attachSearch(root);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDocsSearch, { once: true });
} else {
  initDocsSearch();
}
