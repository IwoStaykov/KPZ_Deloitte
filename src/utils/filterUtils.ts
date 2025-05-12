import { Prompt } from '../types/interfaces';
import { FilterOptions } from '../types/interfaces';

export const filterPrompts = (
  prompts: Prompt[],
  filters: FilterOptions,
  selectedCategory: string
): Prompt[] => {
  let filtered = [...prompts];

  // Filtrowanie po kategorii
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(prompt =>
      prompt.tags.includes(selectedCategory)
    );
  }

  // Filtrowanie po frazie wyszukiwania
  if (filters.query?.trim()) {
    const query = filters.query.toLowerCase().trim();
    filtered = filtered.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query)
    );
  }

  // Filtrowanie po autorze
  if (filters.author?.trim()) {
    const author = filters.author.toLowerCase().trim();
    filtered = filtered.filter(prompt =>
      prompt.author.toLowerCase().includes(author)
    );
  }

  // Filtrowanie po tagu
  if (filters.tag?.trim()) {
    const tag = filters.tag.toLowerCase().trim();
    filtered = filtered.filter(prompt =>
      prompt.tags.some(t => t.toLowerCase().includes(tag))
    );
  }

  // Filtrowanie po dacie
  // Filtrowanie po zakresie dat
  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter(prompt => {
      // Konwertuj datę promptu na obiekt Date
      const promptDate = new Date(prompt.date);
      if (isNaN(promptDate.getTime())) return false; // Pomijaj nieprawidłowe daty

      // Konwertuj daty filtrowania
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

      // Ustaw czas dla daty końcowej na koniec dnia
      if (toDate) {
        toDate.setHours(23, 59, 59, 999);
      }

      // Sprawdź zakres dat
      const isAfterFrom = !fromDate || promptDate >= fromDate;
      const isBeforeTo = !toDate || promptDate <= toDate;

      return isAfterFrom && isBeforeTo;
    });
  }

  return filtered;
};
