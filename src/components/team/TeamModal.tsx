import React, { useState } from 'react';
import { TeamMember } from '../../types/interfaces';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onRemoveMember: (id: number) => void;
  onUpdateMemberRole: (id: number, role: string) => void;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  teamMembers,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole
}) => {
  // Stan dla nowego członka zespołu
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'member'
  });

  // Stan dla trybu edycji
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Obsługa zmiany danych nowego członka
  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Dodanie nowego członka
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;
    
    onAddMember({
      ...newMember,
      avatar: "https://via.placeholder.com/40",
      joinDate: "Teraz"
    });
    
    // Reset formularza
    setNewMember({
      name: '',
      email: '',
      role: 'member'
    });
    
    setIsAddingMember(false);
  };

  // Zmiana roli członka zespołu
  const handleRoleChange = (id: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateMemberRole(id, e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="team-modal">
        <div className="modal-header">
          <h3>Zarządzanie zespołem</h3>
          <button className="btn close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="team-list">
            <div className="team-header">
              <h4>Członkowie zespołu ({teamMembers.length})</h4>
              {!isAddingMember && (
                <button 
                  className="btn add-member-btn" 
                  onClick={() => setIsAddingMember(true)}
                >
                  <i className="bi bi-plus-lg"></i> Dodaj członka
                </button>
              )}
            </div>
            
            {isAddingMember && (
              <div className="add-member-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="member-name">Imię i nazwisko</label>
                    <input
                      type="text"
                      id="member-name"
                      name="name"
                      className="form-control"
                      value={newMember.name}
                      onChange={handleNewMemberChange}
                      placeholder="Imię i nazwisko"
                      autoFocus
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="member-email">Email</label>
                    <input
                      type="email"
                      id="member-email"
                      name="email"
                      className="form-control"
                      value={newMember.email}
                      onChange={handleNewMemberChange}
                      placeholder="Email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="member-role">Rola</label>
                    <select
                      id="member-role"
                      name="role"
                      className="form-select"
                      value={newMember.role}
                      onChange={handleNewMemberChange}
                    >
                      <option value="member">Członek</option>
                      <option value="editor">Edytor</option>
                      <option value="admin">Administrator</option>
                      <option value="leader">Lider zespołu</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="btn cancel-btn" 
                    onClick={() => setIsAddingMember(false)}
                  >
                    Anuluj
                  </button>
                  <button
                    className="btn save-btn"
                    onClick={handleAddMember}
                    disabled={!newMember.name || !newMember.email}
                  >
                    Dodaj
                  </button>
                </div>
              </div>
            )}
            
            <div className="members-list">
              {teamMembers.map(member => (
                <div key={member.id} className="member-item">
                  <div className="member-info">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="member-avatar" 
                    />
                    <div className="member-details">
                      <h5>{member.name}</h5>
                      <p>{member.email}</p>
                      <small>Dołączył(a): {member.joinDate}</small>
                    </div>
                  </div>
                  
                  <div className="member-actions">
                    <select
                      className="form-select role-select"
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e)}
                    >
                      <option value="member">Członek</option>
                      <option value="editor">Edytor</option>
                      <option value="admin">Administrator</option>
                      <option value="leader">Lider zespołu</option>
                    </select>
                    
                    <button 
                      className="btn remove-btn"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn close-btn" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
