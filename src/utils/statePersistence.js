/**
 * State Persistence Service
 * Handles saving and restoring application state across page reloads
 */

// Keys for localStorage
const STATE_KEY = 'mha_app_state';
const MODAL_STATE_KEY = 'mha_modal_state';
const SCROLL_POSITION_KEY = 'mha_scroll_position';

/**
 * Save the current modal state
 * @param {Object} modalState - The modal state to save
 */
export const saveModalState = (modalState) => {
  if (!modalState) return;
  
  try {
    localStorage.setItem(MODAL_STATE_KEY, JSON.stringify(modalState));
    console.log('Modal state saved:', modalState);
  } catch (error) {
    console.error('Error saving modal state:', error);
  }
};

/**
 * Get the saved modal state
 * @returns {Object|null} The saved modal state or null if none exists
 */
export const getModalState = () => {
  try {
    const state = localStorage.getItem(MODAL_STATE_KEY);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error loading modal state:', error);
    return null;
  }
};

/**
 * Clear the saved modal state
 */
export const clearModalState = () => {
  localStorage.removeItem(MODAL_STATE_KEY);
};

/**
 * Save the current page scroll position
 * @param {string} pathname - The current page path
 * @param {number} position - The scroll position to save
 */
export const saveScrollPosition = (pathname, position) => {
  try {
    const positions = JSON.parse(localStorage.getItem(SCROLL_POSITION_KEY) || '{}');
    positions[pathname] = position;
    localStorage.setItem(SCROLL_POSITION_KEY, JSON.stringify(positions));
  } catch (error) {
    console.error('Error saving scroll position:', error);
  }
};

/**
 * Get the saved scroll position for a page
 * @param {string} pathname - The page path to get the scroll position for
 * @returns {number|null} The saved scroll position or null if none exists
 */
export const getScrollPosition = (pathname) => {
  try {
    const positions = JSON.parse(localStorage.getItem(SCROLL_POSITION_KEY) || '{}');
    return positions[pathname] || 0;
  } catch (error) {
    console.error('Error loading scroll position:', error);
    return 0;
  }
};

/**
 * Save general application state
 * @param {string} key - The state key
 * @param {any} value - The state value
 */
export const saveAppState = (key, value) => {
  try {
    const state = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    state[key] = value;
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error(`Error saving app state for key ${key}:`, error);
  }
};

/**
 * Get saved application state
 * @param {string} key - The state key to retrieve
 * @param {any} defaultValue - Default value if state doesn't exist
 * @returns {any} The saved state or defaultValue if none exists
 */
export const getAppState = (key, defaultValue = null) => {
  try {
    const state = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    return state[key] !== undefined ? state[key] : defaultValue;
  } catch (error) {
    console.error(`Error loading app state for key ${key}:`, error);
    return defaultValue;
  }
};
