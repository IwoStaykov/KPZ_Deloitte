import { Prompt, PromptHistoryItem } from '../types/interfaces';

/**
 * Funkcja kopiująca treść promptu do schowka
 * @param prompt Prompt, którego treść ma zostać skopiowana
 * @returns Promise<boolean> Informacja czy kopiowanie się powiodło
 */
export const copyPromptToClipboard = async (prompt: Prompt | null): Promise<boolean> => {
  if (!prompt) return false;
  
  try {
    await navigator.clipboard.writeText(prompt.promptContent);
    return true;
  } catch (err) {
    console.error("Failed to copy prompt to clipboard:", err);
    return false;
  }
};

/**
 * Funkcja tworząca nowy prompt na podstawie danych formularza
 * @param formData Dane formularza
 * @param author Autor promptu
 * @returns Nowy prompt
 */
export const createPromptFromForm = (
  formData: { 
    title: string; 
    description: string; 
    tags: string; 
    content: string; 
  }, 
  author: string = "Current User"
): Prompt => {
  return {
    id: Date.now(), // Używamy timestampa jako tymczasowego ID
    title: formData.title,
    description: formData.description,
    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    author: author,
    date: "Just now",
    usageCount: 0,
    promptContent: formData.content,
    history: [] // Nowy prompt nie ma historii
  };
};

/**
 * Funkcja aktualizująca prompt i dodająca wpis do historii
 * @param prompt Prompt do aktualizacji
 * @param updatedData Zaktualizowane dane
 * @param changeDescription Opis zmian
 * @returns Zaktualizowany prompt
 */
export const updatePromptWithHistory = (
  prompt: Prompt,
  updatedData: {
    title?: string;
    description?: string;
    tags?: string[] | string;
    content?: string;
  },
  changeDescription: string = "Edycja promptu"
): Prompt => {
  if (!prompt) return prompt;

  // Przygotowanie tagów
  let processedTags = prompt.tags;
  if (updatedData.tags) {
    if (typeof updatedData.tags === 'string') {
      processedTags = updatedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else {
      processedTags = updatedData.tags;
    }
  }

  // Utworzenie obiektu historii zawierającego aktualną wersję
  const currentHistoryItem: PromptHistoryItem = {
    version: prompt.history?.length ? prompt.history.length + 1 : 1,
    date: new Date().toLocaleDateString(),
    changes: changeDescription,
    content: prompt.promptContent
  };

  // Aktualizacja historii
  const updatedHistory = prompt.history 
    ? [...prompt.history, currentHistoryItem] 
    : [currentHistoryItem];

  // Utworzenie obiektu zaktualizowanego promptu
  return {
    ...prompt,
    title: updatedData.title || prompt.title,
    description: updatedData.description || prompt.description,
    tags: processedTags,
    promptContent: updatedData.content || prompt.promptContent,
    date: "Just now", // W wersji produkcyjnej użylibyśmy formatowania daty
    history: updatedHistory
  };
};

/**
 * Funkcja filtrująca prompty według kategorii
 * @param prompts Lista wszystkich promptów
 * @param category Kategoria do filtrowania
 * @returns Przefiltrowana lista promptów
 */
export const filterPromptsByCategory = (prompts: Prompt[], category: string): Prompt[] => {
  if (category === "All") return prompts;
  
  return prompts.filter(prompt => 
    prompt.tags.some(tag => tag === category)
  );
};

/**
 * Funkcja formatująca datę do wyświetlenia
 * @param date Data w formacie ISO lub timestamp
 * @returns Sformatowana data (np. "2 days ago")
 */
export const formatPromptDate = (date: string | number | Date): string => {
  const now = new Date();
  const promptDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - promptDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
    }
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
  }
};
