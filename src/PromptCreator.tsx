import React, { useState, useRef } from 'react';

// Interfejs dla komponentu tworzenia promptu
interface CreatePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (promptData: PromptFormData) => void;
}

// Dane formularza promptu
export interface PromptFormData {
    title: string;
    description: string;
    tags: string[];
    promptContent: string;
    category?: string;
}

// Komponent modalu tworzenia promptu
export const CreatePromptModal: React.FC<CreatePromptModalProps> = ({ isOpen, onClose, onSave }) => {
    // Stany formularza
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [promptContent, setPromptContent] = useState('');
    const [category, setCategory] = useState('');
    const [activeTab, setActiveTab] = useState('basic'); // 'basic' lub 'content'
    
    // Referencja do inputu tagów
    const tagInputRef = useRef<HTMLInputElement>(null);
    
    // Kategorie do wyboru
    const categories = ['Writing', 'Programming', 'Design', 'Business', 'Other'];
    
    // Reset formularza
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setTagInput('');
        setTags([]);
        setPromptContent('');
        setCategory('');
        setActiveTab('basic');
    };
    
    // Obsługa zamknięcia
    const handleClose = () => {
        resetForm();
        onClose();
    };
    
    // Dodawanie tagu
    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
            // Skupienie z powrotem na input
            if (tagInputRef.current) {
                tagInputRef.current.focus();
            }
        }
    };
    
    // Obsługa klawisza Enter dla tagów
    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };
    
    // Usuwanie tagu
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    
    // Zapisywanie promptu
    const handleSave = () => {
        // Walidacja
        if (!title.trim() || !promptContent.trim()) {
            alert('Title and prompt content are required!');
            return;
        }
        
        // Przygotowanie danych
        const promptData: PromptFormData = {
            title,
            description,
            tags,
            promptContent,
            category: category || undefined
        };
        
        // Wywołanie callbacku zapisywania
        onSave(promptData);
        
        // Reset i zamknięcie
        resetForm();
        onClose();
    };
    
    // Jeśli modal nie jest otwarty, nie renderuj nic
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Create New Prompt</h2>
                    <button className="btn close-btn" onClick={handleClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div className="modal-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        Basic Info
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                        onClick={() => setActiveTab('content')}
                    >
                        Prompt Content
                    </button>
                </div>
                
                <div className="modal-body">
                    {activeTab === 'basic' ? (
                        <div className="form-basic-info">
                            <div className="form-group">
                                <label>Title *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter a descriptive title for your prompt"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="form-control" 
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what your prompt does"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Tags</label>
                                <div className="tag-input-container">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        ref={tagInputRef}
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="Add tags and press Enter"
                                    />
                                    <button 
                                        className="btn btn-sm add-tag-btn"
                                        onClick={addTag}
                                        type="button"
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                                
                                {tags.length > 0 && (
                                    <div className="tags-container mt-2">
                                        {tags.map((tag, index) => (
                                            <div key={index} className="tag-item">
                                                <span>{tag}</span>
                                                <button 
                                                    className="tag-remove-btn"
                                                    onClick={() => removeTag(tag)}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="form-prompt-content">
                            <div className="form-group">
                                <label>Prompt Content *</label>
                                <textarea 
                                    className="form-control prompt-textarea" 
                                    rows={15}
                                    value={promptContent}
                                    onChange={(e) => setPromptContent(e.target.value)}
                                    placeholder="Write your prompt here. Use [PLACEHOLDERS] for variables the user can customize."
                                />
                            </div>
                            
                            <div className="prompt-tips">
                                <h5><i className="bi bi-lightbulb"></i> Tips for Effective Prompts</h5>
                                <ul>
                                    <li>Use clear instructions and specific details</li>
                                    <li>Add placeholders like [KEYWORD] for customization</li>
                                    <li>Structure your prompt with numbered lists when appropriate</li>
                                    <li>Consider the AI's perspective and capabilities</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="modal-footer">
                    <button className="btn cancel-btn" onClick={handleClose}>Cancel</button>
                    {activeTab === 'basic' ? (
                        <button 
                            className="btn next-btn"
                            onClick={() => setActiveTab('content')}
                        >
                            Next <i className="bi bi-arrow-right"></i>
                        </button>
                    ) : (
                        <div className="content-buttons">
                            <button 
                                className="btn back-btn"
                                onClick={() => setActiveTab('basic')}
                            >
                                <i className="bi bi-arrow-left"></i> Back
                            </button>
                            <button 
                                className="btn save-btn"
                                onClick={handleSave}
                            >
                                Save Prompt
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Komponent rozwijanego menu użytkownika
export interface UserMenuProps {
    isOpen: boolean;
    onSignOut: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onSignOut }) => {
    if (!isOpen) return null;
    
    return (
        <div className="user-menu">
            <div className="user-menu-header">
                <div className="user-info">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="profile-img" />
                    <div>
                        <div className="user-name">User Name</div>
                        <div className="user-email">user@example.com</div>
                    </div>
                </div>
            </div>
            <div className="user-menu-items">
                <div className="user-menu-item">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                </div>
                <div className="user-menu-item">
                    <i className="bi bi-gear"></i>
                    <span>Settings</span>
                </div>
                <div className="user-menu-item">
                    <i className="bi bi-question-circle"></i>
                    <span>Help & Support</span>
                </div>
                <div className="user-menu-divider"></div>
                <div className="user-menu-item" onClick={onSignOut}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    );
};