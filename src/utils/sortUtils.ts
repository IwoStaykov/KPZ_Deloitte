import { Prompt } from '../types/interfaces';

/**
 * Parsuje datę w formacie DD.MM.YYYY do obiektu Date
 */
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('.');
  return new Date(`${year}-${month}-${day}`);
};

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
      return sorted.sort((a, b) => 
        parseDate(a.date).getTime() - parseDate(b.date).getTime()
      );
    case 'date-desc':
    default:
      return sorted.sort((a, b) => 
        parseDate(b.date).getTime() - parseDate(a.date).getTime()
      );
  }
};