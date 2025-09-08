// Import the jest-dom library for custom matchers
const { configure } = require('@testing-library/dom');

// Extend expect with jest-dom matchers
require('@testing-library/jest-dom');

// Configure test environment
configure({
  testIdAttribute: 'data-testid',
});

// Mock next/navigation - using the mock we created in __mocks__
// This is now handled by the manual mock in __mocks__/next/navigation.js

// Mock any other global objects if needed
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
