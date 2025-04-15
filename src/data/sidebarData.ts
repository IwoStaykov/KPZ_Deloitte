import { SidebarCategory } from '../types/interfaces';

/**
 * Dane kategorii w menu bocznym
 */
export const sidebarCategories: SidebarCategory[] = [
  {
    icon: "bi-house-door",
    label: "Home",
    items: [
      { label: "Dashboard", path: "dashboard" },
      { label: "Recent Prompts", path: "recent" }
    ]
  },
  {
    icon: "bi-people",
    label: "Team",
    items: [
      { label: "Team Members", path: "teammembers" },
      { label: "Team Prompts", path: "teamprompts" },
      { label: "Alter Members", path: "teamadd" }
    ]
  },
  {
    icon: "bi-grid",
    label: "Categories",
    items: [
      { label: "Writing", path: "categories/writing" },
      { label: "Programming", path: "categories/programming" },
      { label: "Design", path: "categories/design" },
      { label: "Business", path: "categories/business" }
    ]
  },
  {
    icon: "bi-bookmark",
    label: "Collections",
    items: [
      { label: "Favorites", path: "collections/favorites" },
      { label: "My Prompts", path: "collections/my-prompts" },
      { label: "Recent", path: "collections/recent" }
    ]
  },
  {
    icon: "bi-gear",
    label: "Settings",
    items: [
      { label: "Account", path: "settings/account" },
      { label: "Preferences", path: "settings/preferences" },
      { label: "API Keys", path: "settings/api-keys" }
    ]
  },
  {
    icon: "bi-question-circle",
    label: "Help",
    path: "help"
  }
];

/**
 * Funkcja zwracająca kategorie główne (do filtrowania)
 * @returns Tablica kategorii głównych
 */
export const getMainCategories = (): string[] => {
  return ["All", "Writing", "Programming", "Design", "Business"];
};

/**
 * Funkcja zwracająca ścieżkę dla danej kategorii
 * @param category Nazwa kategorii
 * @returns Ścieżka do kategorii
 */
export const getCategoryPath = (category: string): string => {
  if (category === "All") return "/";
  return `/categories/${category.toLowerCase()}`;
};
