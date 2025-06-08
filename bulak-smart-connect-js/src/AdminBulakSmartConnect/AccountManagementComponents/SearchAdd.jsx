import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AccountManagementComponents/SearchAdd.css';

const SearchAddUser = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (onSearch) {
            onSearch(query);
          }
        }, 300);
      };
    })(),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleAddUserClick = () => {
    navigate('/add-user');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="search-user">
        <input 
          type="text" 
          placeholder="Search User..." 
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={handleClearSearch}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#666'
            }}
            type="button"
          >
            ✕
          </button>
        )}
      <button className="add-user" onClick={handleAddUserClick}>
        Add User
      </button>
    </div>
  );
};

export default SearchAddUser;
