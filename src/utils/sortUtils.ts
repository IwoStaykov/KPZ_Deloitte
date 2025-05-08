import { Prompt } from '../types/interfaces';

/**
 * Główna funkcja sortująca prompty
 */
export const sortPrompts = (prompts: Prompt[], option: string): Prompt[] => {
  const sorted = [...prompts];
  
  switch (option) {
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'date-desc':
      default:
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};