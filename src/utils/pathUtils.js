/**
 * Utility for handling paths correctly in both local and GitHub Pages environments
 */

/**
 * Determines if the app is running on GitHub Pages
 * @returns {boolean} True if running on GitHub Pages, false otherwise
 */
export const isGitHubPages = () => {
  return window.location.hostname.includes('github.io');
};

/**
 * Formats an image path to work in both local and GitHub Pages environments
 * @param {string} imagePath - The original image path (starting with /)
 * @returns {string} The correctly formatted image path
 */
export const formatImagePath = (imagePath) => {
  if (!imagePath) return '';
  
  // If we're on GitHub Pages and the path is absolute, make it relative
  // GitHub Pages serves the content from a repository subfolder
  if (isGitHubPages() && imagePath.startsWith('/')) {
    return imagePath.substring(1); // Remove leading slash to make it relative
  }
  
  return imagePath;
};
