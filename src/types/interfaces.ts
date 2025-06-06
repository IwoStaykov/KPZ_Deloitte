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
    onDelete: (promptId: string) => void;
    selectedPrompt: Prompt;
}

export interface PromptHistoryItem {
    version: number;
    date: string;
    changes: string;
    content: string;
}

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'leader' | 'member';
    avatar: string;
    joinDate: string;
}

export interface TeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    members: TeamMember[];
    currentUserRole: 'leader' | 'member';
    teamPrompts: Prompt[];
}

export interface EditPromptProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: Prompt;
    onSave: (updatedPrompt: Prompt) => void;
}

export interface Prompt {
    id: string;
    title: string;
    description: string;
    tags: string[];
    author: string;
    date: string;
    usageCount: number;
    promptContent: string;
    history?: PromptHistoryItem[];
}

export interface FilterOptions {
    query?: string;
    author?: string;
    tag?: string;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    closePanel?: boolean;
}

export interface SortButtonProps {
  currentSort: string;
  onClick: (option: string) => void;
}

export interface SortDropdownProps {
    currentSort: string;
    onSortChange: (option: string) => void;
}


export type SortOption = 'title-asc' | 'title-desc' | 'date-asc' | 'date-desc';