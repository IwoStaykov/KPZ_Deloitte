import React, {useState, useEffect, useRef} from 'react';
import DiffEditor, {DiffMethod} from 'react-diff-viewer-continued'; // nowa biblioteka do porównywania tekstu.
import './App.css';

// Definicje typów
interface SubmenuItem {
    label: string;
    path: string;
}

interface SidebarCategory {
    icon: string;
    label: string;
    items?: SubmenuItem[];
    path?: string;
}

interface PromptCardProps {
    title: string;
    description: string;
    tags: string[];
    author: string;
    date: string;
    onClick: () => void;
}

interface PromptDetailProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    tags: string[];
    description: string;
    author: string;
    date: string;
    usageCount: number;
    promptContent: string;
    history?: PromptHistoryItem[]; // Historia wersji
    onEdit: () => void; // Funkcja do obsługi przycisku edycji
}

// Interfejs dla elementu historii promptu
interface PromptHistoryItem {
    version: number;
    date: string;
    changes: string;
    content: string;
}

// Interfejs dla członka zespołu
interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'leader' | 'member';
    avatar: string;
    joinDate: string;
}

// Interfejs dla modalu zespołu
interface TeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    members: TeamMember[];
    currentUserRole: 'leader' | 'member';
    teamPrompts: Prompt[];
}

// Interfejs dla okna edycji promptu
interface EditPromptProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: Prompt;
    onSave: (updatedPrompt: Prompt) => void;
}

// Definicja interfejsu dla prompt
interface Prompt {
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

// Interfejs dla komponentu Filtrowania
interface FilterOptions {
    query?: string;
    author?: string;
    tag?: string;
    date?: string;
    category?: string;
    closePanel?: boolean;
}

const App: React.FC = () => {



    // Stany
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Domyślnie ukryty
    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
    const [isPromptDetailOpen, setIsPromptDetailOpen] = useState<boolean>(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
    const [isCreatePromptOpen, setIsCreatePromptOpen] = useState<boolean>(false);
    const [isEditPromptOpen, setIsEditPromptOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<'leader' | 'member'>('member');
    const [teamPrompts, setTeamPrompts] = useState<Prompt[]>([]);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
    const [searchFilters, setSearchFilters] = useState<{
        query: string;
        author: string;
        tag: string;
        date: string;
    }>({
        query: '',
        author: '',
        tag: '',
        date: ''
    });

    // Stan dla widoczności panelu filtrów
    const [isFilterPanelVisible, setIsFilterPanelVisible] = useState<boolean>(false);

    const filterPanelRef = useRef<HTMLDivElement>(null);

// Dodanie efektu dla obsługi kliknięć poza panelem filtrów
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            if (isFilterPanelVisible && filterPanelRef.current &&
                !filterPanelRef.current.contains(target) &&
                !(target as Element).closest?.('.filter-toggle-btn')) {
                setIsFilterPanelVisible(false);
            }
        };

        if (isFilterPanelVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterPanelVisible]);

    // Stan dla przechowywania wyfiltrowanych promptów
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])


    const [newPrompt, setNewPrompt] = useState<{

        title: string;
        description: string;
        tags: string;
        content: string;
    }>({
        title: '',
        description: '',
        tags: '',
        content: ''
    });

    // Bezpieczna obsługa signOut bez warunkowego wywołania hooka
    const signOutFunction = () => {
        console.log('Wylogowanie (tryb lokalny)');
        alert('Wylogowanie w trybie lokalnym - funkcja symulowana');
    };

    // Przykładowe dane (ZINTEGORWAĆ Z BAZĄ DANYCH)
    const sidebarCategories: SidebarCategory[] = [
        {
            icon: 'bi-house-door',
            label: 'Home',
            items: [
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Recent Prompts', path: '/recent' }
            ]
        },
        {
            icon: 'bi-people',
            label: 'Team',
            items: [
                { label: 'Team Members', path: '/team/members' },
                { label: 'Team Prompts', path: '/team/prompts' },
                { label: 'Alter Members', path: '/team/add' }
            ]
        },
        {
            icon: 'bi-grid',
            label: 'Categories',
            items: [
                { label: 'Writing', path: '/categories/writing' },
                { label: 'Programming', path: '/categories/programming' },
                { label: 'Design', path: '/categories/design' },
                { label: 'Business', path: '/categories/business' }
            ]
        },
        {
            icon: 'bi-bookmark',
            label: 'Collections',
            items: [
                { label: 'Favorites', path: '/collections/favorites' },
                { label: 'My Prompts', path: '/collections/my-prompts' },
                { label: 'Recent', path: '/collections/recent' }
            ]
        },
        {
            icon: 'bi-gear',
            label: 'Settings',
            items: [
                { label: 'Account', path: '/settings/account' },
                { label: 'Preferences', path: '/settings/preferences' },
                { label: 'API Keys', path: '/settings/api-keys' }
            ]
        },
        {
            icon: 'bi-question-circle',
            label: 'Help',
            path: '/help'
        }
    ];

    // Referencja do danych promptów, używana w komponencie
    const prompts: Prompt[] = [
        {
            id: 1,
            title: 'SEO Blog Post Generator',
            description: 'Create SEO-optimized blog posts with proper headings, keywords, and meta descriptions.',
            tags: ['SEO', 'Content', 'Blog'],
            author: 'John Doe',
            date: '2 days ago',
            usageCount: 3457,
            promptContent: `I want you to act as a professional content writer and SEO expert. Create a comprehensive blog post about [TOPIC] that is optimized for SEO.

Your blog post should include:
1. An attention-grabbing headline with the target keyword "[KEYWORD]"
2. A compelling introduction that engages the reader and sets up the topic
3. At least 5 sections with H2 headings that cover different aspects of the topic
4. 1-2 H3 subheadings under each H2 section for better organization
5. Naturally incorporated related keywords: [RELATED KEYWORD 1], [RELATED KEYWORD 2], [RELATED KEYWORD 3]
6. A minimum of 1,500 words of valuable, informative content
7. Practical examples, case studies, or statistics to support main points
8. A conclusion that summarizes key takeaways and includes a call-to-action
9. 3 FAQs about the topic with detailed answers
10. Meta description of 150-160 characters that includes the main keyword and entices clicks

Format the content in Markdown. Make the content engaging, authoritative, and valuable to readers while ensuring it follows SEO best practices.`,
            // Dodajemy historię wersji
            history: [
                {
                    version: 1,
                    date: '10 days ago',
                    changes: 'Initial version',
                    content: `I want you to act as a content writer and SEO expert. Create a blog post about [TOPIC] optimized for SEO.

Your blog post should include:
1. A headline with the keyword "[KEYWORD]"
2. An introduction 
3. 3-4 sections with headings
4. Related keywords
5. A conclusion with call-to-action
6. 2 FAQs

Format in Markdown.`
                },
                {
                    version: 2,
                    date: '7 days ago',
                    changes: 'Added more structure and details',
                    content: `I want you to act as a professional content writer and SEO expert. Create a blog post about [TOPIC] that is optimized for SEO.

Your blog post should include:
1. A headline with the target keyword "[KEYWORD]"
2. An introduction that engages the reader
3. At least 4 sections with H2 headings
4. Related keywords: [RELATED KEYWORD 1], [RELATED KEYWORD 2]
5. About 1,000 words of content
6. Examples or statistics 
7. A conclusion with a call-to-action
8. 2 FAQs about the topic
9. Meta description

Format in Markdown.`
                },
                {
                    version: 3,
                    date: '2 days ago',
                    changes: 'Expanded requirements and added more details',
                    content: `I want you to act as a professional content writer and SEO expert. Create a comprehensive blog post about [TOPIC] that is optimized for SEO.

Your blog post should include:
1. An attention-grabbing headline with the target keyword "[KEYWORD]"
2. A compelling introduction that engages the reader and sets up the topic
3. At least 5 sections with H2 headings that cover different aspects of the topic
4. 1-2 H3 subheadings under each H2 section for better organization
5. Naturally incorporated related keywords: [RELATED KEYWORD 1], [RELATED KEYWORD 2], [RELATED KEYWORD 3]
6. A minimum of 1,500 words of valuable, informative content
7. Practical examples, case studies, or statistics to support main points
8. A conclusion that summarizes key takeaways and includes a call-to-action
9. 3 FAQs about the topic with detailed answers
10. Meta description of 150-160 characters that includes the main keyword and entices clicks

Format the content in Markdown. Make the content engaging, authoritative, and valuable to readers while ensuring it follows SEO best practices.`
                }
            ]
        },
        {
            id: 2,
            title: 'Code Refactoring Assistant',
            description: 'Helps refactor code for better readability, efficiency, and adherence to best practices.',
            tags: ['Coding', 'DevTools', 'Refactoring'],
            author: 'Jane Smith',
            date: '5 days ago',
            usageCount: 2145,
            promptContent: `As a code refactoring expert, please help me improve the following code for [LANGUAGE]. 

My code:
\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`

Please refactor this code to:
1. Improve readability
2. Enhance performance where possible
3. Follow [LANGUAGE] best practices and design patterns
4. Reduce redundancy and improve code organization
5. Add appropriate error handling
6. Include helpful comments explaining complex parts

For each change you make, please explain your reasoning and the benefits of the improvement.`,
            // Dodajemy historię wersji
            history: [
                {
                    version: 1,
                    date: '12 days ago',
                    changes: 'Initial version',
                    content: `As a code reviewer, please help me improve this code:
\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`

Make it more readable and fix any issues.`
                },
                {
                    version: 2,
                    date: '5 days ago',
                    changes: 'More detailed requirements and structure',
                    content: `As a code refactoring expert, please help me improve the following code for [LANGUAGE]. 

My code:
\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`

Please refactor this code to:
1. Improve readability
2. Enhance performance where possible
3. Follow [LANGUAGE] best practices and design patterns
4. Reduce redundancy and improve code organization
5. Add appropriate error handling
6. Include helpful comments explaining complex parts

For each change you make, please explain your reasoning and the benefits of the improvement.`
                }
            ]
        },
        {
            id: 3,
            title: 'UI/UX Feedback Expert',
            description: 'Provides detailed feedback on UI/UX designs with actionable improvement suggestions.',
            tags: ['Design', 'UI/UX', 'Feedback'],
            author: 'Alex Johnson',
            date: '1 week ago',
            usageCount: 1873,
            promptContent: `Act as a senior UI/UX design consultant with 15+ years of experience. I'm going to show you a design for [PRODUCT/WEBSITE/APP] and I'd like you to provide detailed, professional feedback.

For your analysis, please include:

1. First impressions (visual hierarchy, clarity of purpose, branding)
2. User flow analysis (evaluate how intuitive the navigation and interactions are)
3. Specific UI element feedback (color scheme, typography, spacing, element sizing)
4. Accessibility considerations (contrast, text size, keyboard navigation, screen reader compatibility)
5. Mobile responsiveness (if applicable)
6. 3-5 highest priority recommendations for improvement
7. 2-3 strengths of the current design that should be preserved

For each critique point, please suggest a specific, actionable improvement. Balance your feedback with both positive elements and areas for improvement.`,
            // Dodajemy historię wersji
            history: [
                {
                    version: 1,
                    date: '3 weeks ago',
                    changes: 'Initial version',
                    content: `Act as a UI/UX designer. Review my design for [PRODUCT] and give me feedback on:
                    
1. Visual design
2. Usability
3. Suggestions for improvement`
                },
                {
                    version: 2,
                    date: '2 weeks ago',
                    changes: 'Added more specific feedback points',
                    content: `Act as a UI/UX design consultant. I'm going to show you a design for [PRODUCT/WEBSITE/APP] and I'd like your feedback.

Please review:
1. Visual hierarchy
2. User flow
3. Color scheme and typography
4. Accessibility
5. Recommendations for improvement`
                },
                {
                    version: 3,
                    date: '1 week ago',
                    changes: 'Comprehensive rewrite with detailed structure',
                    content: `Act as a senior UI/UX design consultant with 15+ years of experience. I'm going to show you a design for [PRODUCT/WEBSITE/APP] and I'd like you to provide detailed, professional feedback.

For your analysis, please include:

1. First impressions (visual hierarchy, clarity of purpose, branding)
2. User flow analysis (evaluate how intuitive the navigation and interactions are)
3. Specific UI element feedback (color scheme, typography, spacing, element sizing)
4. Accessibility considerations (contrast, text size, keyboard navigation, screen reader compatibility)
5. Mobile responsiveness (if applicable)
6. 3-5 highest priority recommendations for improvement
7. 2-3 strengths of the current design that should be preserved

For each critique point, please suggest a specific, actionable improvement. Balance your feedback with both positive elements and areas for improvement.`


                }
            ]
        }
    ];

    // Przykładowe dane członków zespołu
    const initialTeamMembers: TeamMember[] = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'leader',
            avatar: 'https://via.placeholder.com/40',
            joinDate: '3 months ago'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'member',
            avatar: 'https://via.placeholder.com/40',
            joinDate: '2 months ago'
        },
        {
            id: 3,
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            role: 'member',
            avatar: 'https://via.placeholder.com/40',
            joinDate: '1 month ago'
        }
    ];

    // Efekty
    useEffect(() => {
        // Sprawdź zapisany motyw
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            setIsDarkTheme(true);
            document.body.setAttribute('data-theme', 'dark');
        }
    }, []);

    // Obsługa kliknięcia poza menu profilu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            const profileMenuContainer = document.querySelector('.profile-menu-container');
            if (isProfileMenuOpen && profileMenuContainer && !profileMenuContainer.contains(target)) {
                setIsProfileMenuOpen(false);
            }
        };

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileMenuOpen]);

    // Efekt inicjalizujący dane zespołu
    useEffect(() => {
        // W wersji produkcyjnej tutaj byłoby pobieranie danych z API
        setTeamMembers(initialTeamMembers);

        // Ustawiamy rolę bieżącego użytkownika (w produkcji pobierane z API)
        setCurrentUserRole('leader');

        // Inicjalizujemy prompty zespołu - dla przykładu używamy pierwszych dwóch standardowych promptów
        setTeamPrompts(prompts.slice(0, 2));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // tak wiem w tamtej lini jest błąd. narazie tak zostawiamy.

    // Obsługa zmiany motywu
    const toggleTheme = () => {
        setIsDarkTheme(prev => !prev);
        if (!isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    // Obsługa menu bocznego
    const toggleSidebar = () => {
        if (!isSidebarVisible) {
            // Jeśli pasek jest niewidoczny, najpierw go pokazujemy
            setIsSidebarVisible(true);
        } else {
            // Jeśli pasek jest już widoczny, możemy go schować
            setIsSidebarVisible(false);
        }
    };

    // Pokaż pasek boczny
    const showSidebar = () => {
        setIsSidebarVisible(true);
    };

    // Obsługa kliknięcia w logo
    const handleLogoClick = () => {
        showSidebar();
    };

    // Obsługa kliknięcia w element menu
    const handleSidebarItemClick = (index: number) => {
        // Jeśli dana kategoria ma elementy podrzędne
        if (sidebarCategories[index].items) {
            toggleCategory(index);
        }
    };

    // Obsługa rozwijania/zwijania kategorii
    const toggleCategory = (index: number) => {
        setOpenCategoryIndex(prev => prev === index ? null : index);
    };

    // Obsługa kliknięcia w element podmenu
    const handleSubmenuItemClick = (path: string) => {
        // Obsługa elementów podmenu Team
        if (path === '/team/members') {
            setIsTeamModalOpen(true);
        } else if (path === '/team/prompts') {
            setIsTeamModalOpen(true);
            // Tutaj można dodać dodatkową logikę, np. ustawienie odpowiedniej zakładki w modalu
        } else if (path === '/team/add') {
            setIsTeamModalOpen(true);
            // Tutaj można dodać dodatkową logikę
        }
        // Dla innych elementów możemy dodać obsługę nawigacji
    };

    // Obsługa kliknięcia w prompt
    const handlePromptClick = (prompt: Prompt) => {
        setSelectedPrompt(prompt);
        setIsPromptDetailOpen(true);
    };

    // Kopiowanie promptu do schowka
    const copyPromptToClipboard = () => {
        if (selectedPrompt) {
            navigator.clipboard.writeText(selectedPrompt.promptContent)
                .then(() => {
                    alert('Prompt copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    // Obsługa menu profilu - poprawiona wersja
    const toggleProfileMenu = (e: React.MouseEvent) => {
        e.stopPropagation(); // Zatrzymujemy propagację wydarzenia
        setIsProfileMenuOpen(prev => !prev);
    };

    // Wyodrębniona funkcja wylogowywania
    const handleSignOut = () => {
        signOutFunction();
        setIsProfileMenuOpen(false); // Zamykamy menu po wylogowaniu
    };

    // Obsługa otwierania formularza nowego promptu
    const openCreatePrompt = () => {
        setIsCreatePromptOpen(true);
    };

    // Obsługa zamknięcia formularza nowego promptu
    const closeCreatePrompt = () => {
        setIsCreatePromptOpen(false);
        setNewPrompt({
            title: '',
            description: '',
            tags: '',
            content: ''
        });
    };

    // Obsługa zmiany pól nowego promptu
    const handleNewPromptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPrompt(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Obsługa zapisania nowego promptu
    const handleSavePrompt = () => {
        // Tutaj dodalibyśmy logikę zapisywania promptu do bazy danych
        // W trybie lokalnym możemy wyświetlić alert
        console.log('Zapisany prompt:', newPrompt);
        alert('Prompt został zapisany! (symulacja w trybie lokalnym)');
        closeCreatePrompt();
    };

    // Obsługa otwarcia okna edycji promptu
    const handleEditPrompt = () => {
        if (selectedPrompt) {
            setEditingPrompt(selectedPrompt);
            setIsEditPromptOpen(true);
            setIsPromptDetailOpen(false); // Zamykamy podgląd szczegółów
        }
    };

// Obsługa zapisania zmian w promptcie
    const handleSaveEditedPrompt = (updatedPrompt: Prompt) => {
        // W wersji produkcyjnej tutaj byłoby wywołanie API do aktualizacji promptu
        console.log('Aktualizacja promptu:', updatedPrompt);
        alert('Prompt został zaktualizowany! (symulacja w trybie lokalnym)');

        // Aktualizujemy prompt lokalnie (mockup)
        prompts.map(p =>
            p.id === updatedPrompt.id ? updatedPrompt : p
        );

        // Aktualizujemy wybrany prompt
        setSelectedPrompt(updatedPrompt);

        // Zamykamy okno edycji i otwieramy ponownie podgląd
        setIsEditPromptOpen(false);
        setIsPromptDetailOpen(true);
    };

// Obsługa zamknięcia modalu zespołu
    const handleCloseTeamModal = () => {
        setIsTeamModalOpen(false);
    };

// Obsługa usunięcia członka zespołu
    const handleRemoveTeamMember = (memberId: number) => {
        // W wersji produkcyjnej tutaj byłoby wywołanie API
        setTeamMembers(prevMembers =>
            prevMembers.filter(member => member.id !== memberId)
        );
        alert('Członek zespołu został usunięty! (symulacja w trybie lokalnym)');
    };

// Obsługa zmiany roli członka zespołu
    const handleChangeRole = (memberId: number, newRole: 'leader' | 'member') => {
        // W wersji produkcyjnej tutaj byłoby wywołanie API
        setTeamMembers(prevMembers =>
            prevMembers.map(member =>
                member.id === memberId ? {...member, role: newRole} : member
            )
        );

        // Jeśli zmieniamy kogoś na lidera, to obecny lider staje się członkiem
        if (newRole === 'leader') {
            setTeamMembers(prevMembers =>
                prevMembers.map(member =>
                    member.role === 'leader' && member.id !== memberId ?
                        {...member, role: 'member'} : member
                )
            );

            // Jeśli to my jesteśmy liderem i przekazujemy uprawnienia, zmieniamy swój status
            if (currentUserRole === 'leader') {
                setCurrentUserRole('member');
            }
        }

        alert(`Rola została zmieniona na ${newRole}! (symulacja w trybie lokalnym)`);
    };

// Obsługa dodania nowego członka zespołu
    const handleAddTeamMember = (email: string) => {
        // W wersji produkcyjnej tutaj byłoby wywołanie API
        const newMember: TeamMember = {
            id: Date.now(), // Tymczasowe ID
            name: `New Member (${email})`,
            email,
            role: 'member',
            avatar: 'https://via.placeholder.com/40',
            joinDate: 'Just now'
        };

        setTeamMembers(prevMembers => [...prevMembers, newMember]);
        alert('Zaproszenie zostało wysłane! (symulacja w trybie lokalnym)');
    };


// Zbierz wartości z pól formularza i zastosuj filtry
    const collectAndApplyFilters = () => {
        // Zbierz wartości z pól formularza
        const query = (document.getElementById('filter-query') as HTMLInputElement)?.value || '';
        const author = (document.getElementById('filter-author') as HTMLInputElement)?.value || '';
        const tag = (document.getElementById('filter-tag') as HTMLInputElement)?.value || '';
        const date = (document.getElementById('filter-date') as HTMLInputElement)?.value || '';

        // Przygotuj nowy obiekt filtrów
        const newFilters = {
            query,
            author,
            tag,
            date
        };

        // Aktualizuj stan i zastosuj filtry
        setSearchFilters(newFilters);
        applyFilters({ ...newFilters, closePanel: true });
    };

// Obsługa resetowania filtrów
    const resetFilters = () => {
        // Resetujemy wartość wszystkich pól
        ['filter-query', 'filter-author', 'filter-tag', 'filter-date'].forEach(id => {
            const input = document.getElementById(id) as HTMLInputElement;
            if (input) input.value = '';
        });

        // Resetujemy wartość pola wyszukiwania w nagłówku
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }

        // Używamy uniwersalnej funkcji filtrowania z pustymi wartościami
        applyFilters({
            query: '',
            author: '',
            tag: '',
            date: '',
            closePanel: true
        });
    };

    // Uniwersalna funkcja filtrująca
    const applyFilters = (options: FilterOptions = {}) => {
        // Pobieranie opcji z parametrów lub używanie aktualnych wartości
        const filterQuery = options.query !== undefined ? options.query : searchFilters.query;
        const filterAuthor = options.author !== undefined ? options.author : searchFilters.author;
        const filterTag = options.tag !== undefined ? options.tag : searchFilters.tag;
        const filterDate = options.date !== undefined ? options.date : searchFilters.date;
        const filterCategory = options.category !== undefined ? options.category : selectedCategory;

        // Rozpoczynamy od wszystkich promptów
        let filtered = [...prompts];

        // Filtrowanie po kategorii/tagu głównym
        if (filterCategory !== 'All') {
            filtered = filtered.filter(prompt =>
                prompt.tags.some(tag => tag === filterCategory)
            );
        }

        // Filtrowanie po frazie wyszukiwania
        if (filterQuery.trim()) {
            const query = filterQuery.toLowerCase().trim();
            filtered = filtered.filter(prompt =>
                prompt.title.toLowerCase().includes(query) ||
                prompt.description.toLowerCase().includes(query)
            );
        }

        // Filtrowanie po autorze
        if (filterAuthor.trim()) {
            const author = filterAuthor.toLowerCase().trim();
            filtered = filtered.filter(prompt =>
                prompt.author.toLowerCase().includes(author)
            );
        }

        // Filtrowanie po tagu
        if (filterTag.trim()) {
            const tag = filterTag.toLowerCase().trim();
            filtered = filtered.filter(prompt =>
                prompt.tags.some(t => t.toLowerCase().includes(tag))
            );
        }

        // Filtrowanie po dacie
        if (filterDate.trim()) {
            const date = filterDate.toLowerCase().trim();
            filtered = filtered.filter(prompt =>
                prompt.date.toLowerCase().includes(date)
            );
        }

        // Aktualizujemy stan wyfiltrowanych promptów
        setFilteredPrompts(filtered);

        // Aktualizujemy stan filtrów, jeśli podano opcje
        if (Object.keys(options).length > 0) {
            setSearchFilters({
                query: filterQuery,
                author: filterAuthor,
                tag: filterTag,
                date: filterDate
            });

            // Aktualizujemy wybraną kategorię, jeśli została zmieniona
            if (options.category !== undefined) {
                setSelectedCategory(filterCategory);
            }
        }

        // Opcjonalnie zamykamy panel filtrów
        if (options.closePanel) {
            setIsFilterPanelVisible(false);
        }
    };

    useEffect(() => {
        const handleClickOutsideModals = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            // Sprawdzamy, czy kliknięcie jest na overlay (tle) modalu, a nie na treści
            if ((target as Element).classList?.contains('modal-overlay')) {
                // Dla modala tworzenia promptu
                if (isCreatePromptOpen) {
                    closeCreatePrompt();
                }

                // Dla modala edycji promptu
                if (isEditPromptOpen) {
                    setIsEditPromptOpen(false);
                    setIsPromptDetailOpen(true); // Powrót do podglądu
                }

                // Dla modala zespołu
                if (isTeamModalOpen) {
                    handleCloseTeamModal();
                }
            }
        };

        // Dodajemy nasłuchiwanie tylko gdy któryś modal jest otwarty
        if (isCreatePromptOpen || isEditPromptOpen || isTeamModalOpen) {
            document.addEventListener('mousedown', handleClickOutsideModals);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModals);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreatePromptOpen, isEditPromptOpen, isTeamModalOpen]);

    const handleCategoryChange = (category: string) => {
        // Użyj uniwersalnej funkcji filtrowania
        applyFilters({ category });
    };

    // Efekt do inicjalizacji filtrowanych promptów przy pierwszym renderowaniu
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Efekt uruchamiany tylko przy pierwszym renderowaniu i zmianach kategorii
    useEffect(() => {
        // Inicjalizacja filtrów przy pierwszym renderowaniu
        if (filteredPrompts.length === 0) {
            applyFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;

        // Użyj uniwersalnej funkcji filtrowania
        applyFilters({ query });
    };

// Obsługa wyświetlania/ukrywania panelu filtrów
    const toggleFilterPanel = () => {
        setIsFilterPanelVisible(prev => !prev);
    };

    // Komponent karty promptu
    const PromptCard: React.FC<PromptCardProps> = ({ title, description, tags, author, date, onClick }) => {
        return (
            <div className="card prompt-card" onClick={onClick}>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <div className="tags-container">
                        {tags.map((tag, index) => (
                            <span key={index} className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="card-footer py-3">
                    <small className="text-muted">By {author} • {date}</small>
                    <button className="btn bookmark-btn">
                        <i className="bi bi-bookmark"></i>
                    </button>
                </div>
            </div>
        );
    };

    // Komponent szczegółów promptu
    const PromptDetail: React.FC<PromptDetailProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           title,
                                                           tags,
                                                           description,
                                                           author,
                                                           date,
                                                           usageCount,
                                                           promptContent,
                                                           history,
                                                           onEdit
                                                       }) => {
        // Stan dla aktualnie wybranej wersji
        const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
        // Stan dla kontroli widoczności historii
        const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

        const historyMenuRef = useRef<HTMLDivElement>(null);

// Dodanie efektu dla obsługi kliknięć poza menu historii
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node | null;
                if (!target) return;

                if (isHistoryOpen && historyMenuRef.current &&
                    !historyMenuRef.current.contains(target) &&
                    !(target as Element).closest?.('.history-btn')) {
                    setIsHistoryOpen(false);
                }
            };

            if (isHistoryOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isHistoryOpen]);

        // Stan dla trybu porównania
        const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
        // Stany dla przechowywania starej i nowej zawartości do porównania
        const [oldContent, setOldContent] = useState<string>('');
        const [newContent, setNewContent] = useState<string>('');

        // Przywrócenie do aktualnej wersji przy zamknięciu
        useEffect(() => {
            if (isOpen) {
                setSelectedVersion(null);
                setIsHistoryOpen(false);
                setIsCompareMode(false);
            }
        }, [isOpen]);

        // Efekt do aktualizacji zawartości dla porównania przy zmianie wersji
        useEffect(() => {
            if (selectedVersion !== null && history) {
                const selectedContent = history.find(item => item.version === selectedVersion)?.content || '';
                setOldContent(selectedContent);

                const nextVersionItem = history.find(item => item.version === selectedVersion + 1);
                const nextContent = nextVersionItem ? nextVersionItem.content : promptContent;
                setNewContent(nextContent);
            }
        }, [selectedVersion, history, promptContent]);

        // Efekt utrzymujący fokus w polu wyszukiwania
        useEffect(() => {
            // Jeśli input ma focus, zachowaj go po renderowaniu
            const isInputFocused = document.activeElement === searchInputRef.current;
            if (isInputFocused && searchInputRef.current) {
                // Zachowaj pozycję kursora
                const cursorPosition = searchInputRef.current.selectionStart;

                // Odtwórz fokus po renderowaniu
                requestAnimationFrame(() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                        searchInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
                    }
                });
            }
            // }, [searchFilters]); // Ten efekt uruchomi się po każdej zmianie filtrów
        }, []); // Uruchamiamy tylko przy montowaniu komponentu

        if (!isOpen) return null;

        // Funkcja do wyświetlenia wersji z historii
        const showHistoryVersion = (version: number) => {
            setSelectedVersion(version);
            setIsCompareMode(false);
        };

        // Funkcja do przełączania trybu porównania
        const toggleCompareMode = () => {
            if (selectedVersion !== null) {
                setIsCompareMode(!isCompareMode);
            }
        };

        // Wybieramy odpowiednią zawartość promptu
        const displayContent = selectedVersion !== null && history
            ? history.find(item => item.version === selectedVersion)?.content || promptContent
            : promptContent;

        return (
            <div className="prompt-detail-view">
                <div className="prompt-detail-header">
                    <h2>{title}</h2>
                    <button className="btn close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="tags-container prompt-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}>
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="prompt-info">
                    <p><strong>Description:</strong> {description}</p>
                    <p><strong>Created by:</strong> {author}</p>
                    <p><strong>Last updated:</strong> {date}</p>
                    <p><strong>Usage count:</strong> {usageCount.toLocaleString()}</p>
                </div>

                <div className="prompt-content-section">
                    <div className="prompt-header">
                        <h4>Prompt:</h4>
                        {selectedVersion !== null && history && (
                            <button
                                className={`btn compare-btn ${isCompareMode ? 'active' : ''}`}
                                onClick={toggleCompareMode}
                                disabled={selectedVersion === history.length}
                            >
                                <i className={`bi ${isCompareMode ? 'bi-code-slash' : 'bi-git'}`}></i>
                                {isCompareMode ? 'Pokaż normalnie' : 'Pokaż zmiany'}
                            </button>
                        )}
                    </div>
                    <div className="prompt-content-box">
                        {isCompareMode ? (
                            <DiffEditor
                                oldValue={oldContent}
                                newValue={newContent}
                                splitView={true}
                                useDarkTheme={document.body.hasAttribute('data-theme') && document.body.getAttribute('data-theme') === 'dark'}
                                disableWordDiff={false}
                                showDiffOnly={false}
                                extraLinesSurroundingDiff={3}
                                compareMethod={DiffMethod.WORDS}
                                styles={{
                                    contentText: {
                                        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                                        fontSize: '0.85rem',
                                        lineHeight: '1.5',
                                    }
                                }}
                            />
                        ) : (
                            displayContent
                        )}
                    </div>
                </div>

                <div className="prompt-actions">
                    {history && history.length > 0 && (
                        <div className="history-dropdown">
                            <button
                                className="btn history-btn"
                                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            >
                                <i className="bi bi-clock-history"></i>
                                {selectedVersion ? `Version ${selectedVersion}` : "History"}
                            </button>
                            {isHistoryOpen && (
                                <div className="history-menu" ref={historyMenuRef}>
                                    <div
                                        className={`history-item ${selectedVersion === null ? 'active' : ''}`}
                                        onClick={() => setSelectedVersion(null)}
                                    >
                                        <span>Current Version</span>
                                        <span>{date}</span>
                                    </div>
                                    {history.slice().reverse().map(item => (
                                        <div
                                            key={item.version}
                                            className={`history-item ${selectedVersion === item.version ? 'active' : ''}`}
                                            onClick={() => showHistoryVersion(item.version)}
                                        >
                                            <span>Version {item.version}</span>
                                            <span>{item.date}</span>
                                            <small>{item.changes}</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="action-buttons">
                        <button className="btn copy-btn" onClick={copyPromptToClipboard}>
                            <i className="bi bi-clipboard"></i> Copy
                        </button>
                        <button className="btn edit-btn" onClick={onEdit}>
                            <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button className="btn use-btn">
                            Use This Prompt
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const FilterPanel: React.FC<{
        filters: {
            query: string;
            author: string;
            tag: string;
            date: string;
        };
        onReset: () => void;
        onApply: () => void;
        isVisible: boolean;
    }> = ({ filters, onReset, onApply, isVisible }) => {
        if (!isVisible) return null;

        return (
            <div className="filter-panel" ref={filterPanelRef}>
                <div className="filter-header">
                    <h4>Filtry wyszukiwania</h4>
                    <button className="btn reset-btn" onClick={onReset}>
                        <i className="bi bi-x-circle"></i> Resetuj
                    </button>
                </div>

                <div className="filter-body">
                    <div className="filter-group">
                        <label htmlFor="filter-query">Szukana fraza:</label>
                        <input
                            type="text"
                            id="filter-query"
                            name="query"
                            className="form-control"
                            defaultValue={filters.query}
                            placeholder="Wyszukaj..."
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="filter-author">Autor:</label>
                        <input
                            type="text"
                            id="filter-author"
                            name="author"
                            className="form-control"
                            defaultValue={filters.author}
                            placeholder="Nazwa autora..."
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="filter-tag">Tag:</label>
                        <input
                            type="text"
                            id="filter-tag"
                            name="tag"
                            className="form-control"
                            defaultValue={filters.tag}
                            placeholder="Nazwa tagu..."
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="filter-date">Data:</label>
                        <input
                            type="text"
                            id="filter-date"
                            name="date"
                            className="form-control"
                            defaultValue={filters.date}
                            placeholder="np. 2 days, week..."
                        />
                    </div>
                </div>

                <div className="filter-footer">
                    <button className="btn apply-btn" onClick={onApply}>
                        <i className="bi bi-check-circle"></i> Zastosuj filtry
                    </button>
                </div>
            </div>
        );
    };

    // Komponent edycji promptu
    const EditPrompt: React.FC<EditPromptProps> = ({ isOpen, onClose, prompt, onSave }) => {
        const [editedPrompt, setEditedPrompt] = useState<{
            title: string;
            description: string;
            tags: string;
            content: string;
        }>({
            title: prompt?.title || '',
            description: prompt?.description || '',
            tags: prompt?.tags?.join(', ') || '',
            content: prompt?.promptContent || ''
        });

        useEffect(() => {
            if (prompt) {
                setEditedPrompt({
                    title: prompt.title,
                    description: prompt.description,
                    tags: prompt.tags.join(', '),
                    content: prompt.promptContent
                });
            }
        }, [prompt]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setEditedPrompt(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSubmit = () => {
            if (!prompt) return;

            // Utworzenie obiektu historii zawierającego aktualną wersję
            const currentHistoryItem: PromptHistoryItem = {
                version: (prompt.history?.length || 0) + 1,
                date: new Date().toLocaleDateString(),
                changes: 'Edycja promptu',
                content: prompt.promptContent
            };

            // Aktualizacja historii
            const updatedHistory = prompt.history ? [...prompt.history, currentHistoryItem] : [currentHistoryItem];

            // Utworzenie obiektu zaktualizowanego promptu
            const updatedPrompt: Prompt = {
                ...prompt,
                title: editedPrompt.title,
                description: editedPrompt.description,
                tags: editedPrompt.tags.split(',').map(tag => tag.trim()),
                promptContent: editedPrompt.content,
                date: 'Teraz', // W wersji produkcyjnej użylibyśmy formatowania daty
                history: updatedHistory
            };

            onSave(updatedPrompt);
        };

        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="create-prompt-modal">
                    <div className="modal-header">
                        <h3>Edytuj prompt</h3>
                        <button className="btn close-btn" onClick={onClose}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group mb-3">
                            <label htmlFor="prompt-title">Tytuł</label>
                            <input
                                type="text"
                                id="prompt-title"
                                name="title"
                                className="form-control"
                                value={editedPrompt.title}
                                onChange={handleChange}
                                placeholder="Podaj tytuł promptu"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="prompt-description">Opis</label>
                            <input
                                type="text"
                                id="prompt-description"
                                name="description"
                                className="form-control"
                                value={editedPrompt.description}
                                onChange={handleChange}
                                placeholder="Krótki opis promptu"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="prompt-tags">Tagi (oddzielone przecinkami)</label>
                            <input
                                type="text"
                                id="prompt-tags"
                                name="tags"
                                className="form-control"
                                value={editedPrompt.tags}
                                onChange={handleChange}
                                placeholder="np. SEO, Content, Blog"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="prompt-content">Treść promptu</label>
                            <textarea
                                id="prompt-content"
                                name="content"
                                className="form-control prompt-textarea"
                                value={editedPrompt.content}
                                onChange={handleChange}
                                placeholder="Wpisz treść promptu..."
                                rows={10}
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn cancel-btn" onClick={onClose}>Anuluj</button>
                        <button
                            className="btn save-btn"
                            onClick={handleSubmit}
                            disabled={!editedPrompt.title || !editedPrompt.content}
                        >
                            Zapisz zmiany
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Komponent modalu zespołu
    const TeamModal: React.FC<TeamModalProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     members,
                                                     currentUserRole,
                                                     teamPrompts
                                                 }) => {
        const [activeTab, setActiveTab] = useState<'members' | 'prompts'>('members');
        const [inviteEmail, setInviteEmail] = useState<string>('');

        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="create-prompt-modal team-modal">
                    <div className="modal-header">
                        <h3>Team Management</h3>
                        <button className="btn close-btn" onClick={onClose}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="team-tabs">
                        <button
                            className={`btn category-btn me-2 ${activeTab === 'members' ? 'active' : ''}`}
                            onClick={() => setActiveTab('members')}
                        >
                            <i className="bi bi-people me-1"></i> Team Members
                        </button>
                        <button
                            className={`btn category-btn ${activeTab === 'prompts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prompts')}
                        >
                            <i className="bi bi-collection me-1"></i> Team Prompts
                        </button>
                    </div>

                    {activeTab === 'members' ? (
                        <div className="modal-body team-members-content">
                            <h4>Team Members</h4>

                            {currentUserRole === 'leader' && (
                                <div className="invite-form mb-4">
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email to invite"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                        />
                                        <button
                                            className="btn invite-btn"
                                            onClick={() => {
                                                if (inviteEmail.trim()) {
                                                    handleAddTeamMember(inviteEmail.trim());
                                                    setInviteEmail('');
                                                }
                                            }}
                                            disabled={!inviteEmail.trim()}
                                        >
                                            <i className="bi bi-plus-lg"></i> Invite
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="team-members-list">
                                {members.map(member => (
                                    <div key={member.id} className="team-member-item">
                                        <div className="member-info">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="member-avatar"
                                            />
                                            <div className="member-details">
                                                <h5>{member.name} {member.role === 'leader' && <span className="leader-badge">Leader</span>}</h5>
                                                <p>{member.email}</p>
                                                <small>Joined {member.joinDate}</small>
                                            </div>
                                        </div>

                                        {/* Akcje dostępne tylko dla lidera */}
                                        {currentUserRole === 'leader' && member.id !== 1 && ( // ID 1 to przykładowe ID bieżącego użytkownika
                                            <div className="member-actions">
                                                {member.role === 'member' ? (
                                                    <button
                                                        className="btn promote-btn"
                                                        onClick={() => handleChangeRole(member.id, 'leader')}
                                                        title="Promote to Leader"
                                                    >
                                                        <i className="bi bi-star"></i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn demote-btn"
                                                        onClick={() => handleChangeRole(member.id, 'member')}
                                                        title="Demote to Member"
                                                    >
                                                        <i className="bi bi-star-fill"></i>
                                                    </button>
                                                )}

                                                <button
                                                    className="btn remove-btn"
                                                    onClick={() => handleRemoveTeamMember(member.id)}
                                                    title="Remove from Team"
                                                >
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="modal-body team-prompts-content">
                            <h4>Team Prompts</h4>
                            <p className="mb-3">Access prompts shared by your team members:</p>

                            <div className="team-prompts-list">
                                {teamPrompts.length > 0 ? (
                                    <div className="row g-4">
                                        {teamPrompts.map(prompt => (
                                            <div className="col-md-6" key={prompt.id}>
                                                <div className="card prompt-card" onClick={() => handlePromptClick(prompt)}>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{prompt.title}</h5>
                                                        <p className="card-text">{prompt.description}</p>
                                                        <div className="tags-container">
                                                            {prompt.tags.map((tag, index) => (
                                                                <span key={index} className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}>
                                            {tag}
                                        </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="card-footer py-3">
                                                        <small className="text-muted">By {prompt.author} • {prompt.date}</small>
                                                        <button className="btn bookmark-btn">
                                                            <i className="bi bi-bookmark"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-prompts-message">
                                        <i className="bi bi-collection display-4"></i>
                                        <p>No team prompts available yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button className="btn cancel-btn" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    // Określenie klasy dla sidebar
    const sidebarClasses = `sidebar ${isSidebarVisible ? 'visible' : ''}`;

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className={sidebarClasses}>
                <div className="sidebar-header">
                    <h3>BETA</h3>
                    <div className="toggle-sidebar" onClick={toggleSidebar}>
                        <i className="bi bi-chevron-left"></i>
                    </div>
                </div>
                <div className="sidebar-menu">
                    {sidebarCategories.map((category, index) => (
                        category.items ? (
                            <div className={`sidebar-category ${openCategoryIndex === index ? 'open' : ''}`} key={index}>
                                <div
                                    className="sidebar-item"
                                    onClick={() => handleSidebarItemClick(index)}
                                >
                                    <i className={`bi ${category.icon}`}></i>
                                    <span>{category.label}</span>
                                    <i className="bi bi-chevron-right dropdown-icon"></i>
                                </div>
                                <div className={`submenu ${openCategoryIndex === index ? 'open' : ''}`}>
                                    {category.items.map((item, itemIndex) => (
                                        <div
                                            className="submenu-item"
                                            key={itemIndex}
                                            onClick={() => handleSubmenuItemClick(item.path)}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="sidebar-item" key={index}>
                                <i className={`bi ${category.icon}`}></i>
                                <span>{category.label}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={`main-content ${isSidebarVisible ? 'with-sidebar' : ''}`}>
                <div className="header">
                    {!isSidebarVisible && (
                        <div className="sidebar-logo" onClick={handleLogoClick}>BETA</div>
                    )}
                    <div className="search-container">
                        <i className="bi bi-search search-icon"></i>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search prompts..."
                            value={searchFilters.query}
                            onChange={handleSearchInputChange}
                            ref={searchInputRef}
                        />
                        {isFilterPanelVisible !== undefined && (
                            <button
                                className={`btn filter-toggle-btn ${isFilterPanelVisible ? 'active' : ''}`}
                                onClick={toggleFilterPanel}
                                title="Pokaż/ukryj filtry"
                            >
                                <i className="bi bi-funnel"></i>
                            </button>
                        )}

                        {/* Panel filtrów - dodaj tylko jeśli masz już komponent FilterPanel */}
                        {isFilterPanelVisible !== undefined && FilterPanel && (
                            <FilterPanel
                                filters={searchFilters}
                                onReset={resetFilters}
                                onApply={collectAndApplyFilters}
                                isVisible={isFilterPanelVisible}
                            />
                        )}
                    </div>
                    <div className="header-actions">
                        <div className="theme-toggle">
                            <span className="theme-toggle-label">Light</span>
                            <label className="theme-toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={isDarkTheme}
                                    onChange={toggleTheme}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                            <span className="theme-toggle-label">Dark</span>
                        </div>
                        <button className="btn create-prompt-btn" onClick={openCreatePrompt}>
                            <i className="bi bi-plus-lg"></i> Create New
                        </button>
                        {/* Poprawiony komponent menu profilu */}
                        <div className="profile-menu-container">
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                className="profile-img"
                                onClick={toggleProfileMenu}
                            />
                            {isProfileMenuOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-menu">
                                        <a href="#" className="dropdown-item">
                                            <i className="bi bi-person me-2"></i>
                                            Profil
                                        </a>
                                        <a href="#" className="dropdown-item">
                                            <i className="bi bi-sliders me-2"></i>
                                            Preferencje
                                        </a>
                                        <button
                                            onClick={handleSignOut}
                                            className="dropdown-item logout-btn"
                                            aria-label="Wyloguj"
                                            title="Wyloguj"
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Wyloguj
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Warunek: Wyświetl listę promptów albo szczegóły wybranego promptu */}
                {isPromptDetailOpen && selectedPrompt ? (
                    <PromptDetail
                        isOpen={isPromptDetailOpen}
                        onClose={() => setIsPromptDetailOpen(false)}
                        title={selectedPrompt.title}
                        tags={selectedPrompt.tags}
                        description={selectedPrompt.description}
                        author={selectedPrompt.author}
                        date={selectedPrompt.date}
                        usageCount={selectedPrompt.usageCount}
                        promptContent={selectedPrompt.promptContent}
                        history={selectedPrompt.history}
                        onEdit={handleEditPrompt}
                    />
                ) : (
                    <div className="content-container">
                        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
                            <div className="d-flex align-items-center">
                                <h3>Prompts</h3>
                                <span className="prompt-count ms-3">
      {filteredPrompts.length} z {prompts.length} wyników
    </span>

                                {/* Wskaźniki aktywnych filtrów */}
                                {/* Wskaźniki aktywnych filtrów */}
                                {(searchFilters.author || searchFilters.tag || searchFilters.date) && (
                                    <div className="active-filters ms-3">
                                        {searchFilters.author && (
                                            <span className="filter-badge">
                Autor: {searchFilters.author}
                                                <button
                                                    className="clear-filter-btn"
                                                    onClick={() => applyFilters({ author: '' })}
                                                >
                    <i className="bi bi-x"></i>
                </button>
            </span>
                                        )}

                                        {searchFilters.tag && (
                                            <span className="filter-badge">
                Tag: {searchFilters.tag}
                                                <button
                                                    className="clear-filter-btn"
                                                    onClick={() => applyFilters({ tag: '' })}
                                                >
                    <i className="bi bi-x"></i>
                </button>
            </span>
                                        )}

                                        {searchFilters.date && (
                                            <span className="filter-badge">
                Data: {searchFilters.date}
                                                <button
                                                    className="clear-filter-btn"
                                                    onClick={() => applyFilters({ date: '' })}
                                                >
                    <i className="bi bi-x"></i>
                </button>
            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    className={`btn category-btn me-2 ${selectedCategory === 'All' ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('All')}
                                >
                                    All
                                </button>
                                <button
                                    className={`btn category-btn me-2 ${selectedCategory === 'Writing' ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('Writing')}
                                >
                                    Writing
                                </button>
                                <button
                                    className={`btn category-btn me-2 ${selectedCategory === 'Programming' ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('Programming')}
                                >
                                    Programming
                                </button>
                                <button
                                    className={`btn category-btn ${selectedCategory === 'Design' ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('Design')}
                                >
                                    Design
                                </button>
                            </div>
                        </div>

                        <div className="row g-4">
                            {filteredPrompts.length > 0 ? (
                                filteredPrompts.map((prompt) => (
                                    <div className="col-lg-4 col-md-6" key={prompt.id}>
                                        <PromptCard
                                            title={prompt.title}
                                            description={prompt.description}
                                            tags={prompt.tags}
                                            author={prompt.author}
                                            date={prompt.date}
                                            onClick={() => handlePromptClick(prompt)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <div className="no-results">
                                        <i className="bi bi-search display-1 mt-3"></i>
                                        <h4 className="mt-3">Nie znaleziono promptów</h4>
                                        <p className="mt-3">Spróbuj zmienić kryteria wyszukiwania lub filtry</p>
                                        <button className="btn reset-search-btn mt-2" onClick={() => {
                                            if (searchInputRef.current) {
                                                searchInputRef.current.value = '';
                                            }
                                            applyFilters({
                                                query: '',
                                                author: '',
                                                tag: '',
                                                date: '',
                                                category: 'All'
                                            });
                                        }}>
                                            <i className="bi bi-arrow-counterclockwise"></i> Resetuj filtry
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal do tworzenia nowego promptu */}
            {isCreatePromptOpen && (
                <div className="modal-overlay">
                    <div className="create-prompt-modal">
                        <div className="modal-header">
                            <h3>Nowy prompt</h3>
                            <button className="btn close-btn" onClick={closeCreatePrompt}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <label htmlFor="prompt-title">Tytuł</label>
                                <input
                                    type="text"
                                    id="prompt-title"
                                    name="title"
                                    className="form-control"
                                    value={newPrompt.title}
                                    onChange={handleNewPromptChange}
                                    placeholder="Podaj tytuł promptu"
                                    autoFocus
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="prompt-description">Opis</label>
                                <input
                                    type="text"
                                    id="prompt-description"
                                    name="description"
                                    className="form-control"
                                    value={newPrompt.description}
                                    onChange={handleNewPromptChange}
                                    placeholder="Krótki opis promptu"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="prompt-tags">Tagi (oddzielone przecinkami)</label>
                                <input
                                    type="text"
                                    id="prompt-tags"
                                    name="tags"
                                    className="form-control"
                                    value={newPrompt.tags}
                                    onChange={handleNewPromptChange}
                                    placeholder="np. SEO, Content, Blog"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="prompt-content">Treść promptu</label>
                                <textarea
                                    id="prompt-content"
                                    name="content"
                                    className="form-control prompt-textarea"
                                    value={newPrompt.content}
                                    onChange={handleNewPromptChange}
                                    placeholder="Wpisz treść promptu..."
                                    rows={10}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn cancel-btn" onClick={closeCreatePrompt}>Anuluj</button>
                            <button
                                className="btn save-btn"
                                onClick={handleSavePrompt}
                                disabled={!newPrompt.title || !newPrompt.content}
                            >
                                Zapisz
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal do edycji promptu */}
            {isEditPromptOpen && editingPrompt && (
                <EditPrompt
                    isOpen={isEditPromptOpen}
                    onClose={() => {
                        setIsEditPromptOpen(false);
                        setIsPromptDetailOpen(true); // Powrót do podglądu po anulowaniu
                    }}
                    prompt={editingPrompt}
                    onSave={handleSaveEditedPrompt}
                />
            )}

            {/* Dodanie modalu zespołu do renderowania */}
            {isTeamModalOpen && (
                <TeamModal
                    isOpen={isTeamModalOpen}
                    onClose={handleCloseTeamModal}
                    members={teamMembers}
                    currentUserRole={currentUserRole}
                    teamPrompts={teamPrompts}
                />
            )}
        </div>
    );
};

export default App;