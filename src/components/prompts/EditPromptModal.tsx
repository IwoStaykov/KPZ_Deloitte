import React, { useState, useEffect } from 'react';

interface PromptHistoryItem {
  version: number;
  date: string;
  changes: string;
  content: string;
}

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

interface EditPromptProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
  onSave: (updatedPrompt: Prompt) => void;
}

const EditPrompt: React.FC<EditPromptProps> = ({
  isOpen,
  onClose,
  prompt,
  onSave
}) => {
  const [editedPrompt, setEditedPrompt] = useState({
    title: '',
    description: '',
    tags: '',
    content: ''
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
    setEditedPrompt(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!prompt) return;

    // Utworzenie obiektu historii zawierającego aktualną wersję
    const currentHistoryItem: PromptHistoryItem = {
      version: prompt.history?.length ? prompt.history.length + 1 : 1,
      date: new Date().toLocaleDateString(),
      changes: "Edycja promptu",
      content: prompt.promptContent
    };

    // Aktualizacja historii
    const updatedHistory = prompt.history 
      ? [...prompt.history, currentHistoryItem] 
      : [currentHistoryItem];

    // Utworzenie obiektu zaktualizowanego promptu
    const updatedPrompt: Prompt = {
      ...prompt,
      title: editedPrompt.title,
      description: editedPrompt.description,
      tags: editedPrompt.tags.split(',').map(tag => tag.trim()),
      promptContent: editedPrompt.content,
      date: "Teraz", // W wersji produkcyjnej użylibyśmy formatowania daty
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
          <button className="btn cancel-btn" onClick={onClose}>
            Anuluj
          </button>
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

export default EditPrompt;
