/**
 * Utility for handling paths correctly in both local and GitHub Pages environments
 */

/**
 * Gets the base URL for the current environment
 * @returns {string} The base URL, including the repository name for GitHub Pages
 */
export const getBaseUrl = () => {
  // Check if we're on GitHub Pages
  const isGitHub = window.location.hostname.includes('github.io');
  
  if (isGitHub) {
    // Extract the repository name from the pathname
    // GitHub Pages URL format: username.github.io/repository-name/...
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 2) {
      // The repository name is the first part of the path
      const repoName = pathParts[1];
      return `/${repoName}`;
    }
  }
  
  // For local development or if we can't determine repo name
  return '';
};

/**
 * Formats an image path to work in both local and GitHub Pages environments
 * @param {string} imagePath - The original image path
 * @returns {string} The correctly formatted image path
 */
export const formatImagePath = (imagePath) => {
  if (!imagePath) return '';
  
  // Handle absolute URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove 'public/' prefix if it exists
  const cleanedPath = imagePath.replace(/^public\/?/, '');
  
  // Check if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    // Add GitHub Pages prefix with repo name
    return cleanedPath.startsWith('/') ? `/MHA-React${cleanedPath}` : `/MHA-React/${cleanedPath}`;
  }
  
  // For local development, just ensure a leading slash
  return cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`;
};

/**
 * Preloads an image to ensure it's in the browser cache
 * @param {string} src - The image source URL
 * @returns {Promise} A promise that resolves when the image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Creates a properly formatted navigation URL that works in both local and GitHub Pages environments
 * @param {string} path - The path to navigate to (e.g., '/cart', '/products')
 * @returns {string} A properly formatted URL for the current environment
 */
export const formatNavPath = (path) => {
  if (!path) return '/';
  
  // For GitHub Pages, we need to handle navigation paths differently
  if (window.location.hostname.includes('github.io')) {
    const baseUrl = getBaseUrl();
    
    // If the path is just '/' (home), return the base URL
    if (path === '/') {
      return baseUrl || '/';
    }
    
    // For other paths, combine the base URL with the path
    // Make sure we don't double up on slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${cleanPath}`;
  }
  
  // For local development, use the path as is
  return path;
};
