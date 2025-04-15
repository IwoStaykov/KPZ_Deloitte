import React from 'react';

interface CreatePromptModalProps {
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

const CreatePromptModal: React.FC<CreatePromptModalProps> = ({
  newPrompt,
  handleNewPromptChange,
  handleSavePrompt,
  closeCreatePrompt
}) => {
  return (
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
          <button className="btn cancel-btn" onClick={closeCreatePrompt}>
            Anuluj
          </button>
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
  );
};

export default CreatePromptModal;
