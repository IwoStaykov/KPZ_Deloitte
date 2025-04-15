import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Typy dla kontekstu motywu
type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

// Utworzenie kontekstu z domyślnymi wartościami
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDarkTheme: false
});

// Hook do używania kontekstu motywu
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Provider dla kontekstu motywu
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Inicjalizacja stanu motywu z localStorage lub domyślnie 'light'
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' ? 'dark' : 'light') as ThemeType;
  });

  // Efekt do aktualizacji atrybutu data-theme na elemencie body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    
    // Zapisanie preferencji w localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Funkcja do przełączania motywu
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Wartość kontekstu
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    isDarkTheme: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
