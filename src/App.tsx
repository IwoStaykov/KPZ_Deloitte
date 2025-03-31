import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
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

    // Efekty
    useEffect(() => {
        // Sprawdź zapisany motyw
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            setIsDarkTheme(true);
            document.body.setAttribute('data-theme', 'dark');
        }
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
                            {prompts.map((prompt) => (
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
                        </div>
                    </div>
                )}
            </div>
            <button onClick={signOut}>Sign out</button>
        </div>
    );
};

export default App;
