import React, { useState } from 'react';
import { TeamModalProps } from '../types/interfaces';

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, members, teamPrompts }) => {
    const [activeTab, setActiveTab] = useState<'members' | 'prompts'>('members');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="create-prompt-modal team-modal">
                <div className="modal-header">
                    <h3>Team Management</h3>
                    <button className="btn close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="team-tabs">
                    {['members', 'prompts'].map(tab => (
                        <button
                            key={tab}
                            className={`btn category-btn me-2 ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab as 'members' | 'prompts')}
                        >
                            <i className={`bi bi-${tab === 'members' ? 'people' : 'collection'} me-1`}></i>
                            {tab === 'members' ? 'Team Members' : 'Team Prompts'}
                        </button>
                    ))}
                </div>
                <div className="modal-body">
                    {activeTab === 'members' ? (
                        <div>
                            <h4>Team Members</h4>
                            {members.map(member => (
                                <div key={member.id} className="team-member-item">
                                    <div className="member-info">
                                        <img src={member.avatar} alt={member.name} className="member-avatar" />
                                        <div className="member-details">
                                            <h5>{member.name} {member.role === 'leader' && <span className="leader-badge">Leader</span>}</h5>
                                            <p>{member.email}</p>
                                            <small>Joined {member.joinDate}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <h4>Team Prompts</h4>
                            {teamPrompts.map(prompt => (
                                <div key={prompt.id} className="card prompt-card">
                                    <div className="card-body">
                                        <h5 className="card-title">{prompt.title}</h5>
                                        <p className="card-text">{prompt.description}</p>
                                    </div>
                                    <div className="card-footer py-3">
                                        <small className="text-muted">By {prompt.author} • {prompt.date}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;
