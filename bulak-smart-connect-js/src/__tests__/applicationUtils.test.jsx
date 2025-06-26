import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock utility functions based on your codebase patterns
const applicationUtils = {
  generateApplicationId: () => `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  
  saveApplication: (applicationData) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push({
      ...applicationData,
      id: applicationUtils.generateApplicationId(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('applications', JSON.stringify(applications));
    return applications[applications.length - 1];
  },

  updateApplication: (id, applicationData) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...applicationData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('applications', JSON.stringify(applications));
      return applications[index];
    }
    return null;
  },

  getApplication: (id) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    return applications.find(app => app.id === id);
  }
};

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('applicationUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('[]');
  });

  describe('generateApplicationId', () => {
    it('generates unique application IDs', () => {
      const id1 = applicationUtils.generateApplicationId();
      const id2 = applicationUtils.generateApplicationId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^app-\d+-[a-z0-9]+$/);
    });
  });

  describe('saveApplication', () => {
    it('saves application to localStorage', () => {
      const applicationData = {
        formData: { name: 'Test User' },
        certificateType: 'birth'
      };

      const savedApp = applicationUtils.saveApplication(applicationData);

      expect(savedApp).toHaveProperty('id');
      expect(savedApp).toHaveProperty('submittedAt');
      expect(savedApp.status).toBe('pending');
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('updateApplication', () => {
    it('updates existing application', () => {
      const existingApps = [
        { id: 'app-123', formData: { name: 'Old Name' } }
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingApps));

      const updatedApp = applicationUtils.updateApplication('app-123', {
        formData: { name: 'New Name' }
      });

      expect(updatedApp.formData.name).toBe('New Name');
      expect(updatedApp).toHaveProperty('lastUpdated');
    });

    it('returns null for non-existent application', () => {
      const result = applicationUtils.updateApplication('non-existent', {});
      
      expect(result).toBeNull();
    });
  });

  describe('getApplication', () => {
    it('retrieves application by ID', () => {
      const existingApps = [
        { id: 'app-123', formData: { name: 'Test User' } }
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingApps));

      const app = applicationUtils.getApplication('app-123');

      expect(app).toEqual(existingApps[0]);
    });

    it('returns undefined for non-existent application', () => {
      const app = applicationUtils.getApplication('non-existent');
      
      expect(app).toBeUndefined();
    });
  });
});