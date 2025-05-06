import React from 'react';

// Create a mock for react-router-dom hooks
export const mockedNavigate = jest.fn();
export const mockedUseNavigate = () => mockedNavigate;

// Mock the entire react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));