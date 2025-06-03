// PromptDetail.tsx
import React, { useEffect, useRef, useState } from 'react';
import { PromptDetailProps} from '../types/interfaces'; // Upewnij się, że PromptHistoryItem ma pole 'date' 
import DiffEditor, { DiffMethod } from 'react-diff-viewer-continued';

const PromptDetail: React.FC<PromptDetailProps> = ({
    isOpen, onClose, title, tags, description, author, date, usageCount,
    promptContent, history = [], onEdit, // 'history' jest propem, domyślnie pusta tablica
    onDelete, selectedPrompt, currentUserId
}) => {
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const historyMenuRef = useRef<HTMLDivElement>(null);
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [oldContent, setOldContent] = useState('');
    const [newContent, setNewContent] = useState('');
    const [context, setContext] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ type: 'system' | 'user' | 'bot', content: string }>>([]);
    const [userMessage, setUserMessage] = useState('');

    // NOWE STANY DLA DAT PORÓWNYWANYCH WERSJI
    const [oldVersionDate, setOldVersionDate] = useState<string | null>(null);
    const [newVersionDate, setNewVersionDate] = useState<string | null>(null);

    const isOwner = selectedPrompt && currentUserId && selectedPrompt.authorId === currentUserId;

    // EFEKT DO USTAWIANIA ZAWARTOŚCI I DAT DLA DIFF EDITOR
    useEffect(() => {
        if (isCompareMode && selectedPrompt) {
            let newVContent = '';
            let newVDate: string | null = null;
            let oldVContent = '';
            let oldVDate: string | null = null;

            // Używamy propu 'history', który jest selectedPrompt.history przekazanym z App.tsx
            // i ma już zastosowany domyślny []
            // selectedPrompt.promptContent i selectedPrompt.date są dla "Aktualnej Wersji"

            if (selectedVersion !== null) {
                // Wybrano konkretną wersję historyczną jako "nową" stronę porównania
                const newVersionItem = history.find(item => item.version === selectedVersion);
                if (newVersionItem) {
                    newVContent = newVersionItem.content;
                    newVDate = newVersionItem.date; // Data tej wybranej wersji historycznej

                    // Znajdź wersję bezpośrednio ją poprzedzającą
                    const previousVersionItem = history.find(item => item.version === selectedVersion - 1);
                    if (previousVersionItem) {
                        oldVContent = previousVersionItem.content;
                        oldVDate = previousVersionItem.date; // Data wersji poprzedzającej
                    } else {
                        oldVContent = ''; // Brak poprzedniej wersji (to najstarsza wersja w historii)
                        oldVDate = null;
                    }
                } else {
                    // Na wszelki wypadek, jeśli nie znaleziono wersji (nie powinno się zdarzyć)
                    newVContent = ''; newVDate = null;
                    oldVContent = ''; oldVDate = null;
                }
            } else {
                // "Aktualna Wersja" (główny prompt) jest "nową" stroną porównania
                newVContent = selectedPrompt.promptContent;
                newVDate = selectedPrompt.date; // Data ostatniej modyfikacji głównego promptu

                if (history.length > 0) {
                    // "Starą" stroną jest najnowszy element z historii
                    // Zakładamy, że historia jest już posortowana malejąco wg wersji (z App.tsx)
                    const latestHistoricalVersionItem = history[0];
                    if (latestHistoricalVersionItem) {
                        oldVContent = latestHistoricalVersionItem.content;
                        oldVDate = latestHistoricalVersionItem.date; // Data najnowszej wersji w historii
                    }
                } else {
                    oldVContent = ''; // Brak historii do porównania
                    oldVDate = null;
                }
            }
            setNewContent(newVContent);
            setNewVersionDate(newVDate);
            setOldContent(oldVContent);
            setOldVersionDate(oldVDate);
        } else {
            // Opcjonalnie czyść daty, gdy nie jesteśmy w trybie porównania
            setNewVersionDate(null);
            setOldVersionDate(null);
        }
    }, [isCompareMode, selectedVersion, selectedPrompt, history]); // 'history' jako prop

    // ... (reszta useEffects i funkcji bez zmian) ...
    useEffect(() => {
        if (isChatOpen && chatMessages.length === 0) {
            setChatMessages([{ type: 'system', content: 'New conversation started using the prompt.' }]);
        }
    }, [isChatOpen, chatMessages.length]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (historyMenuRef.current && !historyMenuRef.current.contains(event.target as Node)) {
                setIsHistoryOpen(false);
            }
        };

        if (isHistoryOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isHistoryOpen]);

    const handleSendMessage = () => {
        if (!userMessage.trim()) return;
        setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setTimeout(() => {
            setChatMessages(prev => [
                ...prev,
                { type: 'bot', content: `This is a simulated response to: "${userMessage}". ...` }
            ]);
        }, 1000);
        setUserMessage('');
    };


    if (!isOpen) return null;

    const displayContent = selectedVersion !== null && history
        ? history.find(item => item.version === selectedVersion)?.content || promptContent
        : promptContent;
    
    const currentVersionForDisplay = selectedPrompt?.history && selectedPrompt.history.length > 0 
        ? Math.max(...selectedPrompt.history.map(h => h.version)) 
        : 1;

    return (
        <div className={`prompt-detail-view ${isChatOpen ? 'with-chat-open' : ''}`}>
            <div className="prompt-detail-header">
                <h2>{title}</h2>
                <button className="btn close-btn" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div className="tags-container prompt-tags">
                {tags.map((tag, index) => (
                    <span key={index} className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}>{tag}</span>
                ))}
            </div>

            <div className="prompt-info">
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Created by:</strong> {author}</p>
                <p><strong>Last updated:</strong> {new Date(date).toLocaleString("en-US", {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
                </p>
                <p><strong>Usage count:</strong> {usageCount.toLocaleString()}</p>
            </div>

            <div className="prompt-content-section">
                <div className="prompt-header">
                    <h4>Prompt: 
                        {selectedVersion !== null && history.find(h => h.version === selectedVersion) 
                            ? ` (Version ${selectedVersion})` 
                            : ` (Current Version - V${currentVersionForDisplay})`}
                    </h4>
                    {history?.length > 0 && (
                        <button
                            className={`btn compare-btn ${isCompareMode ? 'active' : ''}`}
                            onClick={() => setIsCompareMode(!isCompareMode)}
                            disabled={
                                !isCompareMode && // Gdy chcemy wejść w tryb porównania
                                (
                                    (selectedVersion !== null && selectedVersion === Math.min(...history.map(h => h.version).concat(Infinity))) || // Wybrana najstarsza wersja
                                    (selectedVersion === null && history.length === 0) // Wybrana aktualna, ale brak historii
                                )
                            }
                        >
                            <i className={`bi ${isCompareMode ? 'bi-code-slash' : 'bi-git'}`}></i>
                            {isCompareMode ? 'Show Selected Version' : 'Compare with Previous'}
                        </button>
                    )}
                </div>

                <div className="prompt-content-box">
                    {isCompareMode && selectedPrompt ? ( // Dodano selectedPrompt, aby mieć pewność, że jest dostępny
                        <>
                            {/* WYŚWIETLANIE DAT PORÓWNYWANYCH WERSJI */}
                            <div className="diff-version-info mb-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted-color)'}}>
                                {oldVersionDate ? (
                                    <div><strong>Old:</strong> {new Date(oldVersionDate).toLocaleString()}</div>
                                ) : (
                                    <div><strong>Old:</strong> (No previous version)</div>
                                )}
                                {newVersionDate ? (
                                    <div><strong>New:</strong> {new Date(newVersionDate).toLocaleString()} {selectedVersion === null ? '(Current)' : `(Version ${selectedVersion})`}</div>
                                ) : (
                                    selectedPrompt && selectedVersion === null && <div><strong>New:</strong> {new Date(selectedPrompt.date).toLocaleString()} (Current)</div>
                                )}
                            </div>
                            <DiffEditor
                                oldValue={oldContent}
                                newValue={newContent}
                                splitView
                                useDarkTheme={document.body.getAttribute('data-theme') === 'dark'}
                                disableWordDiff={false}
                                showDiffOnly={false}
                                extraLinesSurroundingDiff={3}
                                compareMethod={DiffMethod.WORDS}
                                styles={{ contentText: { fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.85rem' } }}
                            />
                        </>
                    ) : (
                        displayContent
                    )}
                </div>
            </div>

            {/* Sekcja kontekstu (bez zmian) */}
            <div className="prompt-content-section">
                <div className="prompt-header">
                    <h4>Context:</h4>
                </div>
                <div className="prompt-content-box" style={{ minHeight: '200px', height: 'auto' }}>
                    <textarea
                        className="prompt-content-box"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: 'transparent',
                            resize: 'none',
                            outline: 'none'
                        }}
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Enter context for the prompt..."
                    ></textarea>
                </div>
            </div>

            {/* Akcje promptu (bez zmian w logice, tylko w JSX dla dat) */}
            <div className="prompt-actions">
                {history?.length >= 0 && (
                    <div className="history-dropdown">
                        <button
                            className="btn history-btn"
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        >
                            <i className="bi bi-clock-history"></i>
                            {selectedVersion !== null
                                ? `Version  ${selectedVersion}`
                                : 'Current Version'}
                        </button>

                        {isHistoryOpen && (
                            <div className="history-menu" ref={historyMenuRef}>
                                <div className={`history-item ${selectedVersion === null ? 'active' : ''}`} onClick={() => { setSelectedVersion(null); setIsHistoryOpen(false); }}>
                                    <span>Current Version</span><span>{new Date(date).toLocaleDateString()}</span>
                                </div>
                                {history.slice().reverse().map(item => ( // reverse(), aby wyświetlić od najnowszej do najstarszej jeśli potrzeba
                                    <div
                                        key={item.version}
                                        className={`history-item ${selectedVersion === item.version ? 'active' : ''}`}
                                        onClick={() => { setSelectedVersion(item.version); setIsHistoryOpen(false);}}
                                    >
                                        <span>Version {item.version}</span>
                                        <span>{new Date(item.date).toLocaleDateString("pl-PL", {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</span>
                                        <small>{item.changes}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <div className="action-buttons">
                    <button className="btn copy-btn" onClick={() => navigator.clipboard.writeText(displayContent)}>
                        <i className="bi bi-clipboard"></i> Copy
                    </button>
                    {isOwner && (
                        <button className="btn edit-btn" onClick={onEdit}>
                            <i className="bi bi-pencil"></i> Edit
                        </button>
                    )}
                    {isOwner && (
                        <button
                            className="btn delete-btn"
                            onClick={() => onDelete(selectedPrompt.id)}
                        >
                            <i className="bi bi-trash"></i> Delete
                        </button>
                    )}
                    <button
                        className="btn use-btn"
                        onClick={() => setIsChatOpen(true)}
                    >
                        <i className="bi bi-chat-text"></i> Use This Prompt
                    </button>
                </div>
            </div>

            {/* Panel chatu (bez zmian) */}
            {isChatOpen && (
                <div className="chat-panel">
                    <div className="chat-header">
                        <h3>Konwersacja z Bedrock</h3>
                        <button className="btn close-btn" onClick={() => setIsChatOpen(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="chat-messages">
                        <div className="message system-message">
                            <div className="message-content">
                                Rozpoczęta nowa konwersacja z wykorzystaniem:
                                <div className="prompt-info-snippet">
                                    <strong>Prompt:</strong> {promptContent.length > 100
                                    ? promptContent.substring(0, 100) + '...'
                                    : promptContent}
                                    {context && (
                                        <>
                                            <br />
                                            <strong>Context:</strong> {context.length > 100
                                            ? context.substring(0, 100) + '...'
                                            : context}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {chatMessages.filter(msg => msg.type !== 'system').map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                            >
                                <div className="message-content">{message.content}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-area">
                        <textarea
                            className="chat-input"
                            placeholder="Write a message..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        ></textarea>
                        <button className="btn send-btn" onClick={handleSendMessage}>
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptDetail;