type PagefindSearchResultData = {
  url: string;
  excerpt?: string;
  meta: {
    title?: string;
    category?: string;
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

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '').trim();

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
          <div class="mt-1 text-xs text-[var(--color-text-muted)]">${escapeHtml(entry.category)}${entry.excerpt ? ` - ${entry.excerpt}` : ''}</div>
        </a>
      `,
    )
    .join('');
  results.classList.remove('hidden');
};

const setSearchUnavailable = (input: HTMLInputElement, results: HTMLDivElement, message: string) => {
  input.disabled = true;
  input.setAttribute('aria-disabled', 'true');
  renderEmptyState(results, message);
};

const searchPagefind = async (query: string): Promise<SearchEntry[] | null | undefined> => {
  const pagefind = await getPagefind();
  if (!pagefind) return null;

  const search = await pagefind.debouncedSearch(query, {}, SEARCH_DEBOUNCE_MS);
  if (!search) return undefined;

  return Promise.all(
    search.results.slice(0, MAX_RESULTS).map(async (result) => {
      const data = await result.data();

      return {
        title: data.meta.title ?? 'Untitled',
        excerpt: stripTags(data.excerpt ?? ''),
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
  let latestQuery = '';

  input.addEventListener(
    'focus',
    () => {
      void getPagefind();
    },
    { once: true },
  );

  input.addEventListener('input', async () => {
    const query = input.value.trim();
    latestQuery = query;

    if (!query) {
      results.classList.add('hidden');
      results.innerHTML = '';
      return;
    }

    const matches = await searchPagefind(query);
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
