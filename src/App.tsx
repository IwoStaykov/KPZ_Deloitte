import React, {useState, useEffect, useRef, useMemo} from 'react';
import './App.css';
import { initialTeamMembers } from './data/mockPrompts';
import { filterPrompts } from './utils/filterUtils';
import type { Schema } from '../amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data'
import { useUserSub } from './hooks/useUserSub'; 
import { Pagination } from '@aws-amplify/ui-react';
import { getUserName } from './utils/client-utils';
import { useSort } from './hooks/useSort';
import { SortButton} from './components/SortControls/SortButton';
import { SortDropdown } from './components/SortControls/SortDropdown';


const client = generateClient<Schema>();

// Komponenty
import PromptCard from './components/PromptCard';
import PromptDetail from './components/PromptDetail';
import EditPrompt from './components/EditPrompt';
import FilterPanel from './components/FilterPanel';
import TeamModal from './components/TeamModal';


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

    const { signOut} = useAuthenticator();
    const { sub: userSub} = useUserSub();

    const [allPrompts, setAllPrompts] = useState<Prompt[]>([]); // Wszystkie prompty (do filtrowania)
    const [currentPage, setCurrentPage] = useState(0);
    const PAGE_SIZE = 10;
    
    const { sortOption, handleSortChange, sortPrompts } = useSort();

    const filteredPrompts = useMemo(() => {
        const filtered = filterPrompts(allPrompts, searchFilters, selectedCategory);
        return sortPrompts(filtered);
      }, [allPrompts, searchFilters, selectedCategory, sortOption]);
    
    const displayedPrompts = useMemo(() => {
        const startIdx = currentPage * PAGE_SIZE;
        return filteredPrompts.slice(startIdx, startIdx + PAGE_SIZE);
    }, [filteredPrompts, currentPage]);
    
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
                        date: new Date(v.creationDate).toLocaleDateString(),
                        changes: `Version ${v.versionNumber}`,
                        content: v.content
                    }));

                    return {
                        id: id,
                        title: p.title,
                        description: p.description || '',
                        tags: p.tags?.filter(Boolean) || [],
                        author: p.authorName,
                        date: new Date(p.lastModifiedDate).toLocaleDateString(),
                        usageCount: 0,
                        promptContent: p.content,
                        history: history.length > 0 ? history : undefined
                    };
                });

              
                setAllPrompts(transformedPrompts);
            },
            error: (err) => {
                console.error("Błąd observeQuery:", err);
                setError("Nie udało się połączyć z bazą danych.");
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

    const handleSavePrompt = async () => {

        if (!userSub) {
            alert('Nie można zapisać promptu – brak identyfikatora użytkownika.');
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
        alert('Prompt został zapisany!');
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

// Obsługa zapisania zmian w promptcie
    const handleSaveEditedPrompt = (updatedPrompt: Prompt) => {
        // W wersji produkcyjnej tutaj byłoby wywołanie API do aktualizacji promptu
        console.log('Aktualizacja promptu:', updatedPrompt);
        alert('Prompt został zaktualizowany! (symulacja w trybie lokalnym)');


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

        // Reset paginacji przy nowych filtrach
        setCurrentPage(0);
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
        const filterQuery = options.query !== undefined ? options.query : searchFilters.query;
        const filterAuthor = options.author !== undefined ? options.author : searchFilters.author;
        const filterTag = options.tag !== undefined ? options.tag : searchFilters.tag;
        const filterDate = options.date !== undefined ? options.date : searchFilters.date;
        const filterCategory = options.category !== undefined ? options.category : selectedCategory;
      
        const updatedFilters = {
          query: filterQuery,
          author: filterAuthor,
          tag: filterTag,
          date: filterDate
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
                        <div className="dropdown">
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                className="profile-img dropdown-toggle"
                                role="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            />
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li>
                                <a className="dropdown-item" href="#">
                                    <i className="bi bi-person me-2"></i> Profil
                                </a>
                                </li>
                                <li>
                                <a className="dropdown-item" href="#">
                                    <i className="bi bi-sliders me-2"></i> Preferencje
                                </a>
                                </li>
                                <li>
                                <button
                                    className="dropdown-item"
                                    onClick={signOut}
                                    aria-label="Wyloguj"
                                    title="Wyloguj"
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i> Wyloguj
                                </button>
                                </li>
                            </ul>
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
      {displayedPrompts.length} z {filteredPrompts.length} wyników
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

                            <div className="sort-controls">
                                <div className="dropdown">
                                    <SortButton 
                                    currentSort={sortOption} 
                                    onClick={() => {}} 
                                    />
                                    <SortDropdown 
                                    onSortChange={(option) => {
                                        handleSortChange(option);
                                    }} 
                                    currentSort={sortOption} 
                                    />
                                </div>
                            </div>
                        </div>
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
                                
                                <div className="col-12 mt-4">
                                    <Pagination
                                        currentPage={currentPage + 1}
                                        totalPages={Math.ceil(totalFilteredCount / PAGE_SIZE)}
                                        onNext={() => setCurrentPage(prev => prev + 1)}
                                        onPrevious={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        onChange={(newPageIndex?: number) => {
                                            if (newPageIndex !== undefined) {
                                            setCurrentPage(newPageIndex - 1); // Konwersja z 1-based
                                            }
                                        }}
                                        siblingCount={1}
                                    />
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