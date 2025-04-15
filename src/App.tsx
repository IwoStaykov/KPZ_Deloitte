import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import komponentów
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PromptCard from './components/prompts/PromptCard';
import PromptDetail from './components/prompts/PromptDetail';
import CreatePromptModal from './components/prompts/CreatePromptModal';
import EditPromptModal from './components/prompts/EditPromptModal';
import FilterPanel from './components/filters/FilterPanel';
import TeamModal from './components/team/TeamModal';
import ProfileMenu from './components/layout/ProfileMenu';

// Import danych
import { prompts as initialPrompts, initialTeamMembers } from './data/mockData';
import { sidebarCategories } from './data/sidebarData';

// Import typów
import { Prompt, TeamMember, FilterOptions } from './types/interfaces';

// Import funkcji pomocniczych
import { applyFilters, getUniqueTags, getUniqueAuthors } from './utils/filterUtils';
import { createPromptFromForm, updatePromptWithHistory } from './utils/promptUtils';

const App: React.FC = () => {
  // Stany dla motywu
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // Stany dla menu bocznego
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);

  // Stany dla promptów
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(initialPrompts);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isPromptDetailOpen, setIsPromptDetailOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Stany dla filtrów
  const [searchFilters, setSearchFilters] = useState<FilterOptions>({
    query: '',
    author: '',
    tag: '',
    date: '',
    category: 'All'
  });
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState<boolean>(false);

  // Stany dla modali
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState<boolean>(false);
  const [isEditPromptOpen, setIsEditPromptOpen] = useState<boolean>(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  // Stany dla zespołu
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  // Stany dla formularzy
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    tags: '',
    content: ''
  });

  // Referencje
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    // Aktualizacja filtrowanych promptów przy zmianie filtrów lub kategorii
    const filtered = applyFilters(prompts, searchFilters, searchFilters, selectedCategory);
    setFilteredPrompts(filtered);
  }, [prompts, searchFilters, selectedCategory]);

  useEffect(() => {
    // Obsługa kliknięć poza panelem filtrów
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isFilterPanelVisible &&
        filterPanelRef.current &&
        !filterPanelRef.current.contains(target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(target)
      ) {
        setIsFilterPanelVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterPanelVisible]);

  useEffect(() => {
    // Obsługa kliknięć poza menu profilu
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Funkcje dla motywu
  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  // Funkcje dla menu bocznego
  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const handleLogoClick = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarItemClick = (index: number) => {
    if (sidebarCategories[index].items) {
      setOpenCategoryIndex(prev => (prev === index ? null : index));
    }
  };

  const handleSubmenuItemClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
    
    // Obsługa elementów podmenu Team
    if (path === 'teammembers' || path === 'teamprompts' || path === 'teamadd') {
      setIsTeamModalOpen(true);
    }
    
    // Można dodać więcej obsługi dla innych ścieżek
  };

  // Funkcje dla promptów
  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsPromptDetailOpen(true);
  };

  const closePromptDetail = () => {
    setIsPromptDetailOpen(false);
    setSelectedPrompt(null);
  };

  // Funkcje dla formularza nowego promptu
  const openCreatePrompt = () => {
    setIsCreatePromptOpen(true);
  };

  const closeCreatePrompt = () => {
    setIsCreatePromptOpen(false);
    setNewPrompt({
      title: '',
      description: '',
      tags: '',
      content: ''
    });
  };

  const handleNewPromptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPrompt(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePrompt = () => {
    const newPromptObject = createPromptFromForm(newPrompt, "Current User");
    setPrompts(prev => [...prev, newPromptObject]);
    closeCreatePrompt();
  };

  // Funkcje dla edycji promptu
  const handleEditPrompt = () => {
    setIsEditPromptOpen(true);
    setIsPromptDetailOpen(false);
  };

  const closeEditPrompt = () => {
    setIsEditPromptOpen(false);
  };

  const handleSaveEditedPrompt = (updatedPrompt: Prompt) => {
    setPrompts(prev => 
      prev.map(p => p.id === updatedPrompt.id ? updatedPrompt : p)
    );
    setSelectedPrompt(updatedPrompt);
    closeEditPrompt();
    setIsPromptDetailOpen(true);
  };

  // Funkcje dla filtrów
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchFilters(prev => ({ ...prev, query }));
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelVisible(prev => !prev);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setSearchFilters(filters);
    setIsFilterPanelVisible(false);
  };

  const resetFilters = () => {
    setSearchFilters({
      query: '',
      author: '',
      tag: '',
      date: '',
      category: selectedCategory
    });
    
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  // Funkcje dla menu profilu
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(prev => !prev);
  };

  const handleSignOut = () => {
    console.log("Wylogowanie - tryb lokalny");
    alert("Wylogowanie w trybie lokalnym - funkcja symulowana");
    setIsProfileMenuOpen(false);
  };

  // Funkcje dla zespołu
  const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleRemoveTeamMember = (id: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleUpdateMemberRole = (id: number, role: string) => {
    setTeamMembers(prev => 
      prev.map(member => member.id === id ? { ...member, role } : member)
    );
  };

  // Obliczanie dostępnych tagów i autorów
  const availableTags = getUniqueTags(prompts);
  const availableAuthors = getUniqueAuthors(prompts);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar 
        categories={sidebarCategories}
        isVisible={isSidebarVisible}
        openCategoryIndex={openCategoryIndex}
        toggleSidebar={toggleSidebar}
        handleSidebarItemClick={handleSidebarItemClick}
        handleSubmenuItemClick={handleSubmenuItemClick}
      />

      {/* Main Content */}
      <div className={`main-content ${isSidebarVisible ? 'with-sidebar' : ''}`}>
        <Header 
          isSidebarVisible={isSidebarVisible}
          handleLogoClick={handleLogoClick}
          searchFilters={searchFilters}
          handleSearchInputChange={handleSearchInputChange}
          searchInputRef={searchInputRef}
          isFilterPanelVisible={isFilterPanelVisible}
          toggleFilterPanel={toggleFilterPanel}
          isDarkTheme={isDarkTheme}
          toggleTheme={toggleTheme}
          openCreatePrompt={openCreatePrompt}
          toggleProfileMenu={toggleProfileMenu}
          isProfileMenuOpen={isProfileMenuOpen}
          handleSignOut={handleSignOut}
        />

        {/* Filter Panel */}
        {isFilterPanelVisible && (
          <div ref={filterPanelRef}>
            <FilterPanel 
              isVisible={isFilterPanelVisible}
              currentFilters={searchFilters}
              onFilterChange={handleFilterChange}
              onClose={() => setIsFilterPanelVisible(false)}
              availableTags={availableTags}
              availableAuthors={availableAuthors}
            />
          </div>
        )}

        {/* Category Tabs */}
        <div className="category-tabs">
          {["All", "SEO", "Content", "Coding", "Design", "Business"].map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Prompts Grid */}
        <div className="prompts-container">
          {filteredPrompts.length > 0 ? (
            <div className="prompts-grid">
              {filteredPrompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  tags={prompt.tags}
                  author={prompt.author}
                  date={prompt.date}
                  onClick={() => handlePromptClick(prompt)}
                />
              ))}
            </div>
          ) : (
            <div className="no-prompts">
              <p>No prompts found matching your criteria.</p>
              <button className="btn reset-filters-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Detail Modal */}
      {isPromptDetailOpen && selectedPrompt && (
        <div className="modal-overlay">
          <PromptDetail
            isOpen={isPromptDetailOpen}
            onClose={closePromptDetail}
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
        </div>
      )}

      {/* Create Prompt Modal */}
      {isCreatePromptOpen && (
        <CreatePromptModal
          newPrompt={newPrompt}
          handleNewPromptChange={handleNewPromptChange}
          handleSavePrompt={handleSavePrompt}
          closeCreatePrompt={closeCreatePrompt}
        />
      )}

      {/* Edit Prompt Modal */}
      {isEditPromptOpen && selectedPrompt && (
        <EditPromptModal
          isOpen={isEditPromptOpen}
          onClose={closeEditPrompt}
          prompt={selectedPrompt}
          onSave={handleSaveEditedPrompt}
        />
      )}

      {/* Team Modal */}
      {isTeamModalOpen && (
        <TeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          teamMembers={teamMembers}
          onAddMember={handleAddTeamMember}
          onRemoveMember={handleRemoveTeamMember}
          onUpdateMemberRole={handleUpdateMemberRole}
        />
      )}
    </div>
  );
};

export default App;
