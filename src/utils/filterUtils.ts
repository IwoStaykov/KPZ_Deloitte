import { Prompt, FilterOptions } from '../types/interfaces';

/**
 * Funkcja aplikująca filtry do listy promptów
 * @param prompts Lista wszystkich promptów
 * @param options Opcje filtrowania
 * @param currentFilters Aktualne filtry
 * @param selectedCategory Aktualnie wybrana kategoria
 * @returns Przefiltrowana lista promptów
 */
export const applyFilters = (
  prompts: Prompt[],
  options: FilterOptions,
  currentFilters: FilterOptions,
  selectedCategory: string
): Prompt[] => {
  // Pobieranie opcji z parametrów lub używanie aktualnych wartości
  const filterQuery = options.query !== undefined ? options.query : currentFilters.query;
  const filterAuthor = options.author !== undefined ? options.author : currentFilters.author;
  const filterTag = options.tag !== undefined ? options.tag : currentFilters.tag;
  const filterDate = options.date !== undefined ? options.date : currentFilters.date;
  const filterCategory = options.category !== undefined ? options.category : selectedCategory;

  // Rozpoczynamy od wszystkich promptów
  let filtered = [...prompts];

  // Filtrowanie po kategorii/tagu głównym
  if (filterCategory !== "All") {
    filtered = filtered.filter(prompt => 
      prompt.tags.some(tag => tag === filterCategory)
    );
  }

  // Filtrowanie po frazie wyszukiwania
  if (filterQuery.trim()) {
    const query = filterQuery.toLowerCase().trim();
    filtered = filtered.filter(prompt => 
      prompt.title.toLowerCase().includes(query) || 
      prompt.description.toLowerCase().includes(query)
    );
  }

  // Filtrowanie po autorze
  if (filterAuthor.trim()) {
    const author = filterAuthor.toLowerCase().trim();
    filtered = filtered.filter(prompt => 
      prompt.author.toLowerCase().includes(author)
    );
  }

  // Filtrowanie po tagu
  if (filterTag.trim()) {
    const tag = filterTag.toLowerCase().trim();
    filtered = filtered.filter(prompt => 
      prompt.tags.some(t => t.toLowerCase().includes(tag))
    );
  }

  // Filtrowanie po dacie
  if (filterDate.trim()) {
    const date = filterDate.toLowerCase().trim();
    
    // Obsługa specjalnych wartości dat
    if (date === 'today') {
      filtered = filtered.filter(prompt => 
        prompt.date.toLowerCase().includes('today') || 
        prompt.date.toLowerCase().includes('hours ago') || 
        prompt.date.toLowerCase().includes('hour ago') || 
        prompt.date.toLowerCase().includes('minutes ago') || 
        prompt.date.toLowerCase().includes('minute ago')
      );
    } else if (date === 'week') {
      filtered = filtered.filter(prompt => 
        prompt.date.toLowerCase().includes('today') || 
        prompt.date.toLowerCase().includes('yesterday') || 
        prompt.date.toLowerCase().includes('days ago') || 
        prompt.date.toLowerCase().includes('day ago')
      );
    } else if (date === 'month') {
      filtered = filtered.filter(prompt => 
        prompt.date.toLowerCase().includes('today') || 
        prompt.date.toLowerCase().includes('yesterday') || 
        prompt.date.toLowerCase().includes('days ago') || 
        prompt.date.toLowerCase().includes('day ago') || 
        prompt.date.toLowerCase().includes('weeks ago') || 
        prompt.date.toLowerCase().includes('week ago')
      );
    } else {
      // Standardowe filtrowanie po tekście daty
      filtered = filtered.filter(prompt => 
        prompt.date.toLowerCase().includes(date)
      );
    }
  }

  return filtered;
};

/**
 * Funkcja zbierająca wartości z pól formularza i aplikująca filtry
 * @param formElement Element formularza lub kontener zawierający pola formularza
 * @param setSearchFilters Funkcja do aktualizacji stanu filtrów
 * @param applyFiltersFunc Funkcja aplikująca filtry
 */
export const collectAndApplyFilters = (
  formElement: HTMLElement | Document,
  setSearchFilters: (filters: FilterOptions) => void,
  applyFiltersFunc: (options: FilterOptions) => void
): void => {
  // Zbierz wartości z pól formularza
  const query = ((formElement as Document).getElementById('filter-query') as HTMLInputElement)?.value || '';
  const author = (formElement instanceof Document ? formElement.getElementById('filter-author') : null) as HTMLInputElement | null;
  const authorValue = author?.value || '';
  const tag = (formElement instanceof Document ? formElement.getElementById('filter-tag') : null) as HTMLInputElement | null;
  const tagValue = tag?.value || '';
  const date = (formElement instanceof Document 
    ? formElement.getElementById('filter-date') 
    : null) as HTMLInputElement | null;
  const dateValue = date?.value || '';

  // Przygotuj nowy obiekt filtrów
  const category = (formElement instanceof Document 
    ? formElement.getElementById('filter-category') 
    : null) as HTMLInputElement | null;
  const categoryValue = category?.value || 'All';

  const newFilters: FilterOptions = { 
    query, 
    author: authorValue, 
    tag: tagValue, 
    date: dateValue, 
    category: categoryValue 
  };

  // Aktualizuj stan i zastosuj filtry
  setSearchFilters(newFilters);
  applyFiltersFunc({ ...newFilters, closePanel: true });
};

/**
 * Funkcja resetująca filtry
 * @param searchInputRef Referencja do pola wyszukiwania
 * @param applyFiltersFunc Funkcja aplikująca filtry
 */
export const resetFilters = (
  searchInputRef: React.RefObject<HTMLInputElement>,
  applyFiltersFunc: (options: FilterOptions) => void
): void => {
  // Resetujemy wartość wszystkich pól
  ['filter-query', 'filter-author', 'filter-tag', 'filter-date'].forEach(id => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  });

  // Resetujemy wartość pola wyszukiwania w nagłówku
  if (searchInputRef.current) {
    searchInputRef.current.value = '';
  }

  // Używamy uniwersalnej funkcji filtrowania z pustymi wartościami
  applyFiltersFunc({
      query: '',
      author: '',
      tag: '',
      date: '',
      closePanel: true,
      category: ''
  });
};

/**
 * Funkcja zwracająca unikalne wartości tagów z listy promptów
 * @param prompts Lista promptów
 * @returns Tablica unikalnych tagów
 */
export const getUniqueTags = (prompts: Prompt[]): string[] => {
  const allTags = prompts.flatMap(prompt => prompt.tags);
  return [...new Set(allTags)].sort();
};

/**
 * Funkcja zwracająca unikalnych autorów z listy promptów
 * @param prompts Lista promptów
 * @returns Tablica unikalnych autorów
 */
export const getUniqueAuthors = (prompts: Prompt[]): string[] => {
  return [...new Set(prompts.map(prompt => prompt.author))].sort();
};
