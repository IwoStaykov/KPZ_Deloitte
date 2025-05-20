import React, {useState, useEffect, useRef, useMemo} from 'react';
import './App.css';
import { initialTeamMembers } from './data/mockPrompts';
import { filterPrompts } from './utils/filterUtils';
import type { Schema } from '../amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data'
//import type { Prompt as PromptType } from './types/interfaces';
import { useUserSub } from './hooks/useUserSub';
import { Pagination } from '@aws-amplify/ui-react';
import { getUserName } from './utils/client-utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const client = generateClient<Schema>();
//console.log("Amplify Config:", client.config);

// Komponenty
import PromptCard from './components/PromptCard';
import PromptDetail from './components/PromptDetail';
import EditPrompt from './components/EditPrompt';
import FilterPanel from './components/FilterPanel';
import TeamModal from './components/TeamModal';
import ProfileMenu from './components/ProfileMenu';

// Typy
import {
    Prompt,
    FilterOptions,
    TeamMember,
    SidebarCategory,
    PromptHistoryItem
} from './types/interfaces';

const App: React.FC = () => {

    // Stany
    const [, setError] = useState<string | null>(null);
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Domyślnie ukryty
    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
    const [isPromptDetailOpen, setIsPromptDetailOpen] = useState<boolean>(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
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
        dateFrom: string;
        dateTo: string;
    }>({
        query: '',
        author: '',
        tag: '',
        dateFrom: '',
        dateTo: ''
    });

    // Stan dla widoczności panelu filtrów
    const [isFilterPanelVisible, setIsFilterPanelVisible] = useState<boolean>(false);

    const filterPanelRef = useRef<HTMLDivElement>(null);

    const { signOut} = useAuthenticator();
    const { sub: userSub} = useUserSub();

    const [allPrompts, setAllPrompts] = useState<Prompt[]>([]); // Wszystkie prompty (do filtrowania)
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState<number>(10);

    
    const { sortOption, handleSortChange, sortPrompts } = useSort();
    const [isLoadingPrompts, setIsLoadingPrompts] = useState<boolean>(true);

    const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'titleAZ' | 'titleZA'>('newest');

    const handleSortChange = (option: 'newest' | 'oldest' | 'titleAZ' | 'titleZA') => {
        setSortOption(option);
        setCurrentPage(0); // Reset do pierwszej strony przy zmianie sortowania
    };

    // Funkcja pomocnicza dla sortowania (poza komponentem lub jako funkcja nazwana wewnątrz)
    const sortPromptsByOption = (prompts: Prompt[], option: 'newest' | 'oldest' | 'titleAZ' | 'titleZA') => {
        return [...prompts].sort((a, b) => {
            switch (option) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'titleAZ':
                    return a.title.localeCompare(b.title);
                case 'titleZA':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    };

// W komponencie App
    const filteredPrompts = useMemo(() => {
        // Najpierw filtrujemy dane
        const filtered = filterPrompts(allPrompts, searchFilters, selectedCategory);
        // Potem sortujemy przefiltrowane dane
        return sortPromptsByOption(filtered, sortOption);
    }, [allPrompts, searchFilters, selectedCategory, sortOption]);

    const displayedPrompts = useMemo(() => {
        const startIdx = currentPage * pageSize;
        return filteredPrompts.slice(startIdx, startIdx + pageSize);
    }, [filteredPrompts, currentPage, pageSize]);

    const totalFilteredCount = filteredPrompts.length;

    useEffect(() => {
        console.log("filteredPrompts", filteredPrompts.map(p => p.id));
        console.log("currentPage", currentPage);
        console.log("displayedPrompts", displayedPrompts.map(p => p.id));
    }, [filteredPrompts, displayedPrompts]);

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

    // Pobieranie promptów z bazy danych
    useEffect(() => {
        const subscription = client.models.Prompt.observeQuery({
            selectionSet: [
                "id",
                "title",
                "description",
                "content",
                "tags",
                "authorName",
                "creationDate",
                "lastModifiedDate",
                "latestVersion.content",
                "latestVersion.versionNumber",
                "latestVersion.creationDate",
                "versions.content",
                "versions.versionNumber",
                "versions.creationDate"
            ]
        }).subscribe({
            next: ({ items }) => {
                const transformedPrompts: Prompt[] = items.map((p: any) => {
                    const id = p.id
                    const versions = p.versions?.items || [];
                    const sortedVersions = [...versions].sort((a, b) =>
                        parseInt(b.versionNumber) - parseInt(a.versionNumber)
                    );

                    const history: PromptHistoryItem[] = sortedVersions.map(v => ({
                        version: parseInt(v.versionNumber),
                        date: new Date(p.lastModifiedDate).toISOString(),
                        changes: `Version ${v.versionNumber}`,
                        content: v.content
                    }));

                    return {
                        id: id,
                        title: p.title,
                        description: p.description || '',
                        tags: p.tags?.filter(Boolean) || [],
                        author: p.authorName,
                        date: new Date(p.lastModifiedDate).toISOString(),
                        usageCount: 0,
                        promptContent: p.content,
                        history: history.length > 0 ? history : undefined
                    };
                });


            // Sortowanie od razu po pobraniu
            const sorted = transformedPrompts.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
               
                setAllPrompts(sorted);
                setIsLoadingPrompts(false);
            },
            error: (err) => {
                console.error("Błąd observeQuery:", err);
                setError("Nie udało się połączyć z bazą danych.");
                setIsLoadingPrompts(false);
            }
        });

        return () => subscription.unsubscribe(); // Wyczyść suba przy odmontowaniu
    }, []);

    // Efekty
    useEffect(() => {
        // Sprawdź zapisany motyw
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            setIsDarkTheme(true);
            document.body.setAttribute('data-theme', 'dark');
        }
    }, []);

    useEffect(() => {
        // Ten useEffect synchronizuje selectedPrompt z aktualną listą fetchedPrompts
        if (selectedPrompt && allPrompts.length > 0) {
            // Znajdź zaktualizowaną wersję wybranego promptu na liście
            const updatedVersionInList = allPrompts.find(p => String(p.id) === String(selectedPrompt.id));
            if (updatedVersionInList) {
                // Sprawdź, czy dane faktycznie się zmieniły, aby uniknąć niepotrzebnych re-renderów
                // (proste porównanie stringów JSON, można użyć głębszego porównania, jeśli potrzebne)
                if (JSON.stringify(selectedPrompt) !== JSON.stringify(updatedVersionInList)) {
                    console.log('Aktualizowanie selectedPrompt z fetchedPrompts...');
                    setSelectedPrompt(updatedVersionInList);
                }
            } else {
                // Opcjonalnie: Obsłuż przypadek, gdy wybrany prompt został usunięty z listy
                console.log('Wybrany prompt nie znaleziony na liście, być może został usunięty.');
                setSelectedPrompt(null);
                setIsPromptDetailOpen(false);
            }
        }
        // Uruchom ponownie, gdy zmieni się lista pobranych promptów LUB gdy zmieni się ID wybranego promptu
    }, [allPrompts, selectedPrompt?.id]); // Dodano selectedPrompt?.id jako zależność

    useEffect(() => {
        if (selectedPrompt) {
            const updatedPrompt = allPrompts.find(p => p.id === selectedPrompt.id);
            if (updatedPrompt) setSelectedPrompt(updatedPrompt);
        }
    }, [allPrompts]);

    // Efekt inicjalizujący dane zespołu
    useEffect(() => {
        // W wersji produkcyjnej tutaj byłoby pobieranie danych z API
        setTeamMembers(initialTeamMembers);

        // Ustawiamy rolę bieżącego użytkownika (w produkcji pobierane z API)
        setCurrentUserRole('leader');

        // Inicjalizujemy prompty zespołu - dla przykładu używamy pierwszych dwóch standardowych promptów
        setTeamPrompts(allPrompts.slice(0, 2));
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
        // Czytelniejsze i prostsze przełączanie stanu
        setIsSidebarVisible(prevState => !prevState);
    };

    // Pokaż pasek boczny
    //const showSidebar = () => {
    //    setIsSidebarVisible(true);
    //};

    // Obsługa kliknięcia w logo
    //const handleLogoClick = () => {
    //    showSidebar();
    //};

    // Obsługa kliknięcia w logo - powrót do widoku głównego
    const handleLogoClick = () => {
        // Zamknij wszystkie otwarte modale i widoki szczegółowe
        setIsPromptDetailOpen(false);
        setIsCreatePromptOpen(false);
        setIsEditPromptOpen(false);
        setIsTeamModalOpen(false);
        setIsFilterPanelVisible(false);

        // Resetuj wybrane prompty
        setSelectedPrompt(null);
        setEditingPrompt(null);

        // Resetuj stronę do pierwszej
        setCurrentPage(0);
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



    // Obsługa otwierania formularza nowego promptu
    const openCreatePrompt = () => {

        // Zamknij inne modale, jeśli są otwarte
        if (isEditPromptOpen) setIsEditPromptOpen(false);
        if (isTeamModalOpen) setIsTeamModalOpen(false);
        if (isPromptDetailOpen) setIsPromptDetailOpen(false);

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

    const handleSavePrompt = async () => {

        if (!userSub) {
            toast.error('Nie można zapisać promptu – brak identyfikatora użytkownika.');
            return;
        }
        const userName = (await getUserName()) as string;

        await client.models.Prompt.create({
            title: newPrompt.title,
            description: newPrompt.description,
            content: newPrompt.content,
            tags: newPrompt.tags.split(',').map(tag => tag.trim()),
            authorId: userSub, // Używamy sub z Cognito jako ID autora
            authorName: userName, // Używamy preferowanego imienia lub domyślnej wartości
            creationDate: new Date().toISOString(),
            lastModifiedDate: new Date().toISOString()
        });
        console.log(userSub);

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

    const handleSaveEditedPrompt = async (editedPromptData: any) => {
        if (!editingPrompt) return;

        try {
            const tagsArray = typeof editedPromptData.tags === 'string'
                ? editedPromptData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                : [...(editedPromptData.tags || [])];

            const now = new Date().toISOString();

            // 0. Zapis oryginalnego promptu jako wersji 1
            if (!editingPrompt.history || editingPrompt.history.length === 0) {
                await client.models.Version.create({
                    content: editingPrompt.promptContent,
                    versionNumber: "1",
                    creationDate: new Date().toISOString(),
                    promptId: editingPrompt.id
                });
            }

            // 1. Aktualizacja głównego Prompt
            const updatedPromptResult = await client.models.Prompt.update({
                id: editingPrompt.id,
                title: editedPromptData.title,
                description: editedPromptData.description,
                content: editedPromptData.promptContent,
                tags: tagsArray,
                lastModifiedDate: now,
            });

            const updatedPrompt = updatedPromptResult.data;

            if (!updatedPrompt) {
                console.error("Błąd aktualizacji prompta.");
                toast.error("Nie udało się zapisać zmian.");
                return;
            }

            // 2. Tworzenie nowej wersji prompta
            const versionNumber = String((editingPrompt.history?.length || 1) + 1);

            const newVersionResult = await client.models.Version.create({
                promptId: updatedPrompt.id,
                content: editedPromptData.promptContent,
                versionNumber,
                creationDate: now,
            });

            const newVersion = newVersionResult.data;

            if (newVersion) {
                await client.models.Prompt.update({
                    id: updatedPrompt.id,
                    latestVersionId: newVersion.id,
                });
            }

            // 3. Pobranie pełnych danych prompta + wersji
            const promptListResult = await client.models.Prompt.list({
                filter: { id: { eq: updatedPrompt.id } },
            });

            const refreshed = promptListResult.data?.[0];

            const versionsResult = await refreshed.versions(); // <- to jest funkcja
            const versions = versionsResult.data ?? [];

            const history: PromptHistoryItem[] = [...versions]
                .sort((a, b) => parseInt(b.versionNumber) - parseInt(a.versionNumber))
                .map((v) => ({
                    version: parseInt(v.versionNumber),
                    date: new Date(v.creationDate).toLocaleDateString(),
                    changes: `Wersja ${v.versionNumber}`,
                    content: v.content,
                }));

            setSelectedPrompt({
                id: refreshed.id,
                title: refreshed.title,
                description: refreshed.description || '',
                tags: refreshed.tags?.filter((tag): tag is string => tag !== null) ?? [],
                author: refreshed.authorName,
                date: new Date(refreshed.lastModifiedDate).toLocaleDateString(),
                usageCount: 0,
                promptContent: refreshed.content,
                history,
            });

            //alert("Zapisano zmiany i utworzono nową wersję!");
            setIsEditPromptOpen(false);
            setIsPromptDetailOpen(true);
        } catch (error) {
            console.error("Błąd podczas zapisywania edytowanego prompta:", error);
            alert("Wystąpił błąd przy zapisie zmian.");
        }
    };


    const handleDeletePrompt = async (promptId: string) => {
        try {
            await client.models.Prompt.delete({ id: promptId });
            setAllPrompts(prev => prev.filter(p => p.id !== promptId));
            setIsPromptDetailOpen(false);
            toast.success('Prompt usunięty');
        } catch (error) {
            console.error('Błąd usuwania:', error);
            toast.error('Błąd podczas usuwania');
        }
    };

// Obsługa zamknięcia modalu zespołu
    const handleCloseTeamModal = () => {
        setIsTeamModalOpen(false);
    };

// Zbierz wartości z pól formularza i zastosuj filtry
    const collectAndApplyFilters = () => {
        // Zbierz wartości z pól formularza
        const query = (document.getElementById('filter-query') as HTMLInputElement)?.value || '';
        const author = (document.getElementById('filter-author') as HTMLInputElement)?.value || '';
        const tag = (document.getElementById('filter-tag') as HTMLInputElement)?.value || '';
        const dateFrom = (document.getElementById('filter-dateFrom') as HTMLInputElement)?.value || '';
        const dateTo = (document.getElementById('filter-dateTo') as HTMLInputElement)?.value || '';
        // Przygotuj nowy obiekt filtrów
        const newFilters = {
            query,
            author,
            tag,
            dateFrom,
            dateTo
        };

        // Aktualizuj stan i zastosuj filtry
        setSearchFilters(newFilters);
        applyFilters({ ...newFilters, closePanel: true });

        // Reset paginacji przy nowych filtrach
        setCurrentPage(0);
    };

// Obsługa resetowania filtrów
    const resetFilters = () => {
        // Resetujemy wartość wszystkich pól
        ['filter-query', 'filter-author', 'filter-tag', 'filter-dateFrom', 'filter-dateTo'].forEach(id => {
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
            dateFrom: '',
            dateTo: '',
            closePanel: true
        });
    };

    // Uniwersalna funkcja filtrująca
    const applyFilters = (options: FilterOptions = {}) => {
        const filterQuery = options.query !== undefined ? options.query : searchFilters.query;
        const filterAuthor = options.author !== undefined ? options.author : searchFilters.author;
        const filterTag = options.tag !== undefined ? options.tag : searchFilters.tag;
        const filterDateFrom = options.dateFrom !== undefined ? options.dateFrom : searchFilters.dateFrom;
        const filterDateTo = options.dateTo !== undefined ? options.dateTo : searchFilters.dateTo;
        const filterCategory = options.category !== undefined ? options.category : selectedCategory;

        const updatedFilters = {
            query: filterQuery,
            author: filterAuthor,
            tag: filterTag,
            dateFrom: filterDateFrom,
            dateTo: filterDateTo
        };

        setSearchFilters(updatedFilters);
        setSelectedCategory(filterCategory);
        setCurrentPage(0);

        if (options.closePanel) {
            setIsFilterPanelVisible(false);
        }
    };

    useEffect(() => {
        const handleClickOutsideModals = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;

            // Sprawdzamy, czy kliknięcie jest na overlay (tle) modalu, a nie na treści
            // i nie jest to kliknięcie w przycisk zamknięcia (co wywołałoby podwójne zamknięcie)
            if ((target as Element).classList?.contains('modal-overlay') &&
                !(target as Element).closest('.close-btn')) {
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


    // Efekt do inicjalizacji filtrowanych promptów przy pierwszym renderowaniu
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Efekt uruchamiany tylko przy pierwszym renderowaniu i zmianach kategorii
    useEffect(() => {
        // Inicjalizacja filtrów przy pierwszym renderowaniu
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



    // Określenie klasy dla sidebar
    const sidebarClasses = `sidebar ${isSidebarVisible ? 'visible' : ''}`;

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className={sidebarClasses}>
                <div className="sidebar-header">
                    <h3>DeloiHub</h3>
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
                        <div className="sidebar-logo" onClick={handleLogoClick}>DeloiHub</div>
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
                        {/* Przycisk do otwierania menu profilu */}
                        <ProfileMenu signOut={signOut} isDarkTheme={isDarkTheme} />
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
                        history={selectedPrompt.history || []}
                        onEdit={handleEditPrompt}
                        onDelete={handleDeletePrompt}
                        selectedPrompt={selectedPrompt}
                    />
                ) : (
                    <div className="content-container">
                        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
                            <div className="d-flex align-items-center">
                                <h3>Prompts</h3>
                                <span className="prompt-count ms-3">
      {displayedPrompts.length} z {filteredPrompts.length} wyników
    </span>

                                {/* Wskaźniki aktywnych filtrów */}
                                {/* Wskaźniki aktywnych filtrów */}
                                {(searchFilters.author || searchFilters.tag || searchFilters.dateFrom || searchFilters.dateTo) && (
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

                                        {searchFilters.dateFrom || searchFilters.dateTo && (
                                            <span className="filter-badge">
                Data: {searchFilters.dateFrom || searchFilters.dateTo}
                                                <button
                                                    className="clear-filter-btn"
                                                    onClick={() => applyFilters({ dateFrom: '', dateTo: '' })}
                                                >
                    <i className="bi bi-x"></i>
                </button>
            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="sort-controls d-flex">
                                <button
                                    className={`btn category-btn me-2 ${sortOption === 'newest' ? 'active' : ''}`}
                                    onClick={() => handleSortChange('newest')}
                                >
                                    Od najnowszych
                                </button>
                                <button
                                    className={`btn category-btn me-2 ${sortOption === 'titleAZ' ? 'active' : ''}`}
                                    onClick={() => handleSortChange('titleAZ')}
                                >
                                    Tytuł A-Z
                                </button>
                                <button
                                    className={`btn category-btn me-2 ${sortOption === 'titleZA' ? 'active' : ''}`}
                                    onClick={() => handleSortChange('titleZA')}
                                >
                                    Tytuł Z-A
                                </button>
                                <button
                                    className={`btn category-btn ${sortOption === 'oldest' ? 'active' : ''}`}
                                    onClick={() => handleSortChange('oldest')}
                                >
                                    Od najstarszych
                                </button>
                            </div>
                        </div>
                        {isLoadingPrompts ? (
                            <div className="loading-state text-center py-5">
                                <i className="bi bi-arrow-repeat spinner display-4"></i>
                                <p>Ładowanie promptów...</p>
                            </div>
                        ) : (
                        <div className="row g-4">
                            {filteredPrompts.length > 0 ? (
                                <>
                                    {displayedPrompts.map((prompt) => (
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
                                    ))}

                                    <div className="col-12 mt-4 position-relative">
                                        {/* Paginacja - wyśrodkowana */}
                                        <div className="d-flex justify-content-center">
                                            <Pagination
                                                currentPage={currentPage + 1}
                                                totalPages={Math.ceil(totalFilteredCount / pageSize)}
                                                onNext={() => setCurrentPage(prev => prev + 1)}
                                                onPrevious={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                                onChange={(newPageIndex?: number) => {
                                                    if (newPageIndex !== undefined) {
                                                        setCurrentPage(newPageIndex - 1);
                                                    }
                                                }}
                                                siblingCount={1}
                                                className="custom-pagination"
                                            />
                                        </div>

                                        {/* Selektor - w prawym rogu */}
                                        <div className="position-absolute end-0 top-0">
                                            <div className="page-size-selector d-flex align-items-center">
                                                <label htmlFor="page-size" className="me-2">Promptów na stronę:</label>
                                                <select
                                                    id="page-size"
                                                    className="form-select form-select-sm"
                                                    value={pageSize}
                                                    onChange={(e) => {
                                                        setPageSize(Number(e.target.value));
                                                        setCurrentPage(0);
                                                    }}
                                                    style={{width: 'auto'}}
                                                >
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
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
                                                dateTo: '',
                                                dateFrom: '',
                                                category: 'All'
                                            });
                                        }}>
                                            <i className="bi bi-arrow-counterclockwise"></i> Resetuj filtry
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
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
                        setIsPromptDetailOpen(true);
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
                    teamPrompts={teamPrompts}
                    currentUserRole={currentUserRole}
                />
            )}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme={isDarkTheme ? "dark" : "light"}
            />
        </div>
    );
};

export default App;