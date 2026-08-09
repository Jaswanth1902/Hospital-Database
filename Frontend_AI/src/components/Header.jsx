import React from 'react';
import { Search, UserCheck } from 'lucide-react';

export default function Header({ title, searchTerm, setSearchTerm }) {
  return (
    <header className="top-header">
      <div className="header-title-section">
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search patients or records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-profile">
          <div className="avatar">
            <UserCheck size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">Dr. Robert Smith</span>
            <span className="user-role">Chief Physician</span>
          </div>
        </div>
      </div>
    </header>
  );
}
