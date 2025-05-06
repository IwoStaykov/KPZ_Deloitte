import React, { useEffect, useRef, useState } from 'react';
import { PromptDetailProps} from '../types/interfaces';
import DiffEditor, { DiffMethod } from 'react-diff-viewer-continued';

const PromptDetail: React.FC<PromptDetailProps> = ({
    isOpen, onClose, title, tags, description, author, date, usageCount,
    promptContent, history = [], onEdit
}) => {
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const historyMenuRef = useRef<HTMLDivElement>(null);
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [oldContent, setOldContent] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        if (selectedVersion !== null && history) {
            const selected = history.find(item => item.version === selectedVersion)?.content || '';
            const next = history.find(item => item.version === selectedVersion + 1)?.content || promptContent;
            setOldContent(selected);
            setNewContent(next);
        }
    }, [selectedVersion, history, promptContent]);

    if (!isOpen) return null;

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
                    <span key={index} className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}>{tag}</span>
                ))}
            </div>

            <div className="prompt-info">
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Created by:</strong> {author}</p>
                <p><strong>Last updated:</strong> {new Date(date).toLocaleString("pl-PL", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
            })}</p>
                <p><strong>Usage count:</strong> {usageCount.toLocaleString()}</p>
            </div>

            <div className="prompt-content-section">
                <div className="prompt-header">
                    <h4>Prompt:</h4>
                    {selectedVersion !== null && history && (
                        <button
                            className={`btn compare-btn ${isCompareMode ? 'active' : ''}`}
                            onClick={() => setIsCompareMode(!isCompareMode)}
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
                            splitView
                            useDarkTheme={document.body.getAttribute('data-theme') === 'dark'}
                            disableWordDiff={false}
                            showDiffOnly={false}
                            extraLinesSurroundingDiff={3}
                            compareMethod={DiffMethod.WORDS}
                            styles={{ contentText: { fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.85rem' } }}
                        />
                    ) : (
                        displayContent
                    )}
                </div>
            </div>

            <div className="prompt-actions">
                {history?.length > 0 && (
                    <div className="history-dropdown">
                        <button
                            className="btn history-btn"
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        >
                            <i className="bi bi-clock-history"></i>
                            {selectedVersion ? `Version ${selectedVersion}` : 'History'}
                        </button>
                        {isHistoryOpen && (
                            <div className="history-menu" ref={historyMenuRef}>
                                <div className={`history-item ${selectedVersion === null ? 'active' : ''}`} onClick={() => setSelectedVersion(null)}>
                                    <span>Current Version</span><span>{date}</span>
                                </div>
                                {history.slice().reverse().map(item => (
                                    <div
                                        key={item.version}
                                        className={`history-item ${selectedVersion === item.version ? 'active' : ''}`}
                                        onClick={() => setSelectedVersion(item.version)}
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
                    <button className="btn copy-btn" onClick={() => navigator.clipboard.writeText(promptContent)}>
                        <i className="bi bi-clipboard"></i> Copy
                    </button>
                    <button className="btn edit-btn" onClick={onEdit}>
                        <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button className="btn use-btn">Use This Prompt</button>
                </div>
            </div>
        </div>
    );
};

export default PromptDetail;