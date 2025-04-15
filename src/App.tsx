import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './App.css';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();


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
    // Dodajemy historię wersji do promptu
    history?: PromptHistoryItem[];
}

// Nowy interfejs dla elementu historii promptu
interface PromptHistoryItem {
    version: number;
    date: string;
    changes: string;
    content: string;
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

const App: React.FC = () => {

    // Stany
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
    const [, setIsSidebarCollapsed] = useState<boolean>(true); // Domyślnie zwinięty
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false); // Domyślnie ukryty
    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
    const [isPromptDetailOpen, setIsPromptDetailOpen] = useState<boolean>(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [fetchedPrompts, setFetchedPrompts] = useState<Prompt[]>([]);
    // Removed unused isLoading state
    const [, setError] = useState<string | null>(null);
    const { signOut } = useAuthenticator();


    // Przykładowe dane
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

    

    // Efekty
    useEffect(() => {
        // Sprawdź zapisany motyw
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            setIsDarkTheme(true);
            document.body.setAttribute('data-theme', 'dark');
        }
    }, []);

 // Pobieranie promptów z bazy danych
 useEffect(() => {
    const subscription = client.models.Prompt.observeQuery({
        selectionSet: [
            "id",
            "title",
            "description",
            "tags",
            "authorId",
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
                const id = parseInt(p.id, 10);
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
                    author: p.authorId,
                    date: new Date(p.lastModifiedDate).toLocaleDateString(),
                    usageCount: 0,
                    promptContent: p.latestVersion?.content || '',
                    history: history.length > 0 ? history : undefined
                };
            });

            setFetchedPrompts(transformedPrompts);
        },
        error: (err) => {
            console.error("Błąd observeQuery:", err);
            setError("Nie udało się połączyć z bazą danych.");
        }
    });

    return () => subscription.unsubscribe(); // Wyczyść suba przy odmontowaniu
}, []);


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
        setIsSidebarCollapsed(false); // Zapewniamy, że pasek jest rozwinięty
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
                                                           history
                                                       }) => {
        // Stan dla aktualnie wybranej wersji
        const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
        // Stan dla kontroli widoczności historii
        const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

        // Przywrócenie do aktualnej wersji przy zamknięciu
        useEffect(() => {
            if (isOpen) {
                setSelectedVersion(null);
                setIsHistoryOpen(false);
            }
        }, [isOpen]);

        if (!isOpen) return null;

        // Funkcja do wyświetlenia wersji z historii
        const showHistoryVersion = (version: number) => {
            setSelectedVersion(version);
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
                    <h4>Prompt:</h4>
                    <div className="prompt-content-box">
                        {displayContent}
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
                                <div className="history-menu">
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
                        <button className="btn use-btn">
                            Use This Prompt
                        </button>
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
                                        <div className="submenu-item" key={itemIndex}>
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
                        <input type="text" className="form-control" placeholder="Search prompts..." />
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
                        <button className="btn create-prompt-btn">
                            <i className="bi bi-plus-lg"></i> Create New
                        </button>
                        <img src="https://via.placeholder.com/40" alt="Profile" className="profile-img" />
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
                    />
                ) : (
                    <div className="content-container">
                        <div className="mb-4 d-flex justify-content-between align-items-center">
                            <h3>Popular Prompts</h3>
                            <div>
                                <button className="btn category-btn me-2">All</button>
                                <button className="btn category-btn me-2">Writing</button>
                                <button className="btn category-btn me-2">Programming</button>
                                <button className="btn category-btn">Design</button>
                            </div>
                        </div>

                        <div className="row g-4">
                            {fetchedPrompts.map((prompt) => (
                                <div className="col-lg-4 col-md-6" key={prompt.id}>
                                <PromptCard {...prompt} onClick={() => handlePromptClick(prompt)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button onClick={signOut}>Sign out</button>
        </div>
    );
};

export default App;
