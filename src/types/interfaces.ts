// Interfejsy dla menu bocznego
export interface SubmenuItem {
    label: string;
    path: string;
  }
  
  export interface SidebarCategory {
    icon: string;
    label: string;
    items?: SubmenuItem[];
    path?: string;
  }
  
  // Interfejsy dla promptów
  export interface PromptHistoryItem {
    version: number;
    date: string;
    changes: string;
    content: string;
  }
  
  export interface Prompt {
    id: number;
    title: string;
    description: string;
    tags: string[];
    author: string;
    date: string;
    usageCount: number;
    promptContent: string;
    history?: PromptHistoryItem[];
  }
  
  // Interfejsy dla komponentów
  export interface PromptCardProps {
    title: string;
    description: string;
    tags: string[];
    author: string;
    date: string;
    onClick: () => void;
  }
  
  export interface PromptDetailProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    tags: string[];
    description: string;
    author: string;
    date: string;
    usageCount: number;
    promptContent: string;
    history?: PromptHistoryItem[];
    onEdit: () => void;
  }
  
  export interface CreatePromptModalProps {
    newPrompt: {
      title: string;
      description: string;
      tags: string;
      content: string;
    };
    handleNewPromptChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSavePrompt: () => void;
    closeCreatePrompt: () => void;
  }
  
  export interface EditPromptProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: Prompt | null;
    onSave: (updatedPrompt: Prompt) => void;
  }
  
  // Interfejsy dla filtrów
  export interface FilterOptions {
    query: string;
    author: string;
    tag: string;
    date: string;
    category: string;
    closePanel?: boolean;
  }
  
  export interface FilterPanelProps {
    isVisible: boolean;
    currentFilters: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
    onClose: () => void;
    availableTags: string[];
    availableAuthors: string[];
  }
  
  // Interfejsy dla zespołu
  export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
    joinDate: string;
  }
  
  export interface TeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamMembers: TeamMember[];
    onAddMember: (member: Omit<TeamMember, 'id'>) => void;
    onRemoveMember: (id: number) => void;
    onUpdateMemberRole: (id: number, role: string) => void;
  }
  
  // Interfejsy dla layoutu
  export interface HeaderProps {
    isSidebarVisible: boolean;
    handleLogoClick: () => void;
    searchFilters: FilterOptions;
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
    isFilterPanelVisible: boolean;
    toggleFilterPanel: () => void;
    isDarkTheme: boolean;
    toggleTheme: () => void;
    openCreatePrompt: () => void;
    toggleProfileMenu: (e: React.MouseEvent) => void;
    isProfileMenuOpen: boolean;
    handleSignOut: () => void;
  }
  
  export interface SidebarProps {
    categories: SidebarCategory[];
    isVisible: boolean;
    openCategoryIndex: number | null;
    toggleSidebar: () => void;
    handleSidebarItemClick: (index: number) => void;
    handleSubmenuItemClick: (path: string) => void;
  }
  
  export interface ProfileMenuProps {
    isOpen: boolean;
    toggleMenu: (e: React.MouseEvent) => void;
    handleSignOut: () => void;
    userAvatar?: string;
  }
  