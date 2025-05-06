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
  if (filters.date?.trim()) {
    const date = filters.date.toLowerCase().trim();
    filtered = filtered.filter(prompt =>
      prompt.date.toLowerCase().includes(date)
    );
  }

  return filtered;
};
