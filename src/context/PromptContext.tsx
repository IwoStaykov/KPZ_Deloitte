import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Prompt, FilterOptions } from '../types/interfaces';
import { applyFilters, getUniqueTags, getUniqueAuthors } from '../utils/filterUtils';
import { prompts as mockPrompts } from '../data/mockData';

// Interfejs dla kontekstu promptów
interface PromptContextType {
  prompts: Prompt[];
  filteredPrompts: Prompt[];
  selectedPrompt: Prompt | null;
  selectedCategory: string;
  searchFilters: FilterOptions;
  availableTags: string[];
  availableAuthors: string[];
  
  setSelectedPrompt: (prompt: Prompt | null) => void;
  setSelectedCategory: (category: string) => void;
  applyFilters: (options: FilterOptions) => void;
  resetFilters: () => void;
  addPrompt: (prompt: Omit<Prompt, 'id'>) => void;
  updatePrompt: (updatedPrompt: Prompt) => void;
  deletePrompt: (id: number) => void;
}

// Utworzenie kontekstu z domyślnymi wartościami
const PromptContext = createContext<PromptContextType>({
  prompts: [],
  filteredPrompts: [],
  selectedPrompt: null,
  selectedCategory: 'All',
  searchFilters: { query: '', author: '', tag: '', date: '', category: 'All' },
  availableTags: [],
  availableAuthors: [],
  
  setSelectedPrompt: () => {},
  setSelectedCategory: () => {},
  applyFilters: () => {},
  resetFilters: () => {},
  addPrompt: () => {},
  updatePrompt: () => {},
  deletePrompt: () => {}
});

// Hook do używania kontekstu promptów
export const usePrompts = () => useContext(PromptContext);

interface PromptProviderProps {
  children: ReactNode;
}

// Provider dla kontekstu promptów
export const PromptProvider: React.FC<PromptProviderProps> = ({ children }) => {
  // Stany dla promptów i filtrów
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(mockPrompts);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilters, setSearchFilters] = useState<FilterOptions>({
    query: '',
    author: '',
    tag: '',
    date: '',
    category: 'All'
  });
  
  // Obliczanie dostępnych tagów i autorów
  const availableTags = getUniqueTags(prompts);
  const availableAuthors = getUniqueAuthors(prompts);

  // Efekt do aktualizacji filtrowanych promptów przy zmianie filtrów lub kategorii
  useEffect(() => {
    const filtered = applyFilters(prompts, searchFilters, searchFilters, selectedCategory);
    setFilteredPrompts(filtered);
  }, [prompts, searchFilters, selectedCategory]);

  // Funkcja do aplikowania filtrów
  const applyFiltersFunc = (options: FilterOptions) => {
    // Pobieranie opcji z parametrów lub używanie aktualnych wartości
    const filterQuery = options.query !== undefined ? options.query : searchFilters.query;
    const filterAuthor = options.author !== undefined ? options.author : searchFilters.author;
    const filterTag = options.tag !== undefined ? options.tag : searchFilters.tag;
    const filterDate = options.date !== undefined ? options.date : searchFilters.date;
    const filterCategory = options.category !== undefined ? options.category : selectedCategory;

    // Aktualizacja stanu filtrów
    setSearchFilters({
      query: filterQuery,
      author: filterAuthor,
      tag: filterTag,
      date: filterDate,
      category: filterCategory
    });

    // Aktualizacja wybranej kategorii, jeśli została zmieniona
    if (options.category !== undefined) {
      setSelectedCategory(filterCategory);
    }
  };

  // Funkcja do resetowania filtrów
  const resetFilters = () => {
    setSearchFilters({
      query: '',
      author: '',
      tag: '',
      date: '',
      category: selectedCategory
    });
  };

  // Funkcja do dodawania nowego promptu
  const addPrompt = (prompt: Omit<Prompt, 'id'>) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now(), // Używamy timestampa jako tymczasowego ID
      usageCount: 0,
      date: "Just now"
    };
    
    setPrompts(prevPrompts => [...prevPrompts, newPrompt]);
  };

  // Funkcja do aktualizacji promptu
  const updatePrompt = (updatedPrompt: Prompt) => {
    setPrompts(prevPrompts =>
      prevPrompts.map(p => (p.id === updatedPrompt.id ? updatedPrompt : p))
    );
    
    // Aktualizujemy również wybrany prompt, jeśli jest to ten sam
    if (selectedPrompt && selectedPrompt.id === updatedPrompt.id) {
      setSelectedPrompt(updatedPrompt);
    }
  };

  // Funkcja do usuwania promptu
  const deletePrompt = (id: number) => {
    setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== id));
    
    // Jeśli usuwamy aktualnie wybrany prompt, resetujemy wybór
    if (selectedPrompt && selectedPrompt.id === id) {
      setSelectedPrompt(null);
    }
  };

  // Wartość kontekstu
  const contextValue: PromptContextType = {
    prompts,
    filteredPrompts,
    selectedPrompt,
    selectedCategory,
    searchFilters,
    availableTags,
    availableAuthors,
    
    setSelectedPrompt,
    setSelectedCategory,
    applyFilters: applyFiltersFunc,
    resetFilters,
    addPrompt,
    updatePrompt,
    deletePrompt
  };

  return (
    <PromptContext.Provider value={contextValue}>
      {children}
    </PromptContext.Provider>
  );
};

export default PromptContext;
