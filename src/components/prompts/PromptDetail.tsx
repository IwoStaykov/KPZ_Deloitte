import React, { useState, useEffect } from 'react';
import DiffEditor, { DiffMethod } from 'react-diff-viewer-continued';

interface PromptHistoryItem {
  version: number;
  date: string;
  changes: string;
  content: string;
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
  history?: PromptHistoryItem[];
  onEdit: () => void;
}

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
      const selectedContent = history.find(item => item.version === selectedVersion)?.content;
      setOldContent(selectedContent || '');
      
      const nextVersionItem = history.find(item => item.version === selectedVersion + 1);
      const nextContent = nextVersionItem ? nextVersionItem.content : promptContent;
      setNewContent(nextContent);
    }
  }, [selectedVersion, history, promptContent]);

  // Jeśli modal nie jest otwarty, nie renderujemy nic
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
    ? history.find(item => item.version === selectedVersion)?.content
    : promptContent;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(promptContent)
      .then(() => alert("Prompt copied to clipboard!"))
      .catch(err => console.error("Failed to copy", err));
  };

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
          <span 
            key={index} 
            className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}
          >
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
          <h4>Prompt</h4>
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
                  fontFamily: 'Consolas, Monaco, Andale Mono, monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
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
              {selectedVersion ? `Version ${selectedVersion}` : 'History'}
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

export default PromptDetail;
