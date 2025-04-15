import React from 'react';

interface PromptCardProps {
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  onClick: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ 
  title, 
  description, 
  tags, 
  author, 
  date, 
  onClick 
}) => {
  return (
    <div className="card prompt-card" onClick={onClick}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className={`badge ${index % 2 === 0 ? 'badge-primary' : 'badge-accent'}`}
            >
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

export default PromptCard;
