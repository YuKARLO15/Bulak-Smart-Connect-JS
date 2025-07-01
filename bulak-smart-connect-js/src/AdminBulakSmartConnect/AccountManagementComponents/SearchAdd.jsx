import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../AccountManagementComponents/SearchAdd.css';

const SearchAddUser = ({ onSearch }) => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = hasRole('super_admin');

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
    if (!isSuperAdmin) {
      alert('Only super administrators can add users');
      return;
    }
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
      {isSuperAdmin && (
        <button className="add-user" onClick={handleAddUserClick}>
          Add User
        </button>
      )}
    </div>
  );
};

export default SearchAddUser;
