import { useState } from 'react';
import { sortPrompts } from '../utils/sortUtils';

export const useSort = (initialSort = 'date-desc') => {
  const [sortOption, setSortOption] = useState(initialSort);

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return {
    sortOption,
    handleSortChange,
    sortPrompts: (prompts: any[]) => sortPrompts(prompts, sortOption)
  };
};