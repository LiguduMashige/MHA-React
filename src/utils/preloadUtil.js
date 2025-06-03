/**
 * Utility for preloading images to ensure they are in browser cache
 * Enhanced to handle authentication state changes
 */

import { formatImagePath } from './pathUtils';

// Cache of already preloaded images to prevent duplicate loads
const preloadedImages = new Set();

/**
 * Preloads critical images to ensure they're cached
 * Uses multiple strategies to maximize image loading success
 * @param {string[]} imagePaths - Array of image paths to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadCriticalImages = (imagePaths) => {
  // First clear the cache to ensure fresh loading after auth changes
  clearImageCache();
  
  // Check if we're on GitHub Pages
  const isGitHub = window.location.hostname.includes('github.io');
  const baseUrl = isGitHub ? '/MHA-React' : '';
  
  const imagePromises = imagePaths.map(path => {
    // Skip already preloaded images in same session
    if (preloadedImages.has(path)) {
      return Promise.resolve(path);
    }

    return new Promise((resolve) => {
      // Format path with baseUrl for GitHub Pages
      const directPath = path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
      
      // Try multiple path formats to ensure loading success
      const tryLoad = (imgPath, attemptsLeft = 3) => {
        if (attemptsLeft <= 0) {
          console.warn(`Failed to preload image after multiple attempts: ${path}`);
          resolve(null);
          return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Allow cross-origin loading
        
        img.onload = () => {
          console.log(`Successfully preloaded image: ${imgPath}`);
          preloadedImages.add(path); // Mark as preloaded
          
          // Store successfully loaded URLs in sessionStorage for persistence across page refreshes
          try {
            const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '[]');
            if (!loadedImages.includes(path)) {
              loadedImages.push(path);
              sessionStorage.setItem('loadedImages', JSON.stringify(loadedImages));
            }
          } catch (e) {
            console.error('Error storing loaded image paths:', e);
          }
          
          resolve(path);
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${imgPath}, attempts left: ${attemptsLeft-1}`);
          
          let alternativePath;
          if (attemptsLeft === 3) {
            // First fallback: try without baseUrl if we started with it, or with it if we didn't
            alternativePath = isGitHub ? 
              (path.startsWith('/') ? path.substring(1) : `/${path}`) : 
              directPath;
          } else if (attemptsLeft === 2) {
            // Second fallback: try with filename only in various directory patterns
            const filename = path.split('/').pop();
            alternativePath = `${baseUrl}/store-img/${filename}`;
          } else {
            // Final attempt: try direct images folder
            const filename = path.split('/').pop();
            alternativePath = `${baseUrl}/images/${filename}`;
          }
          
          setTimeout(() => tryLoad(alternativePath, attemptsLeft - 1), 300);
        };
        
        img.src = imgPath;
      };
      
      tryLoad(directPath);
    });
  });

  return Promise.all(imagePromises);
};

/**
 * Clears the preloaded images cache on logout/login to force fresh loading
 */
export const clearImageCache = () => {
  preloadedImages.clear();
  // Don't clear sessionStorage to maintain across refreshes
  console.log('Image cache cleared for fresh loading');
};

/**
 * Initialize image cache from sessionStorage if available
 * Call this when the app first loads
 */
export const initImageCache = () => {
  try {
    const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '[]');
    loadedImages.forEach(path => preloadedImages.add(path));
    console.log(`Restored ${preloadedImages.size} cached image paths from session`);
  } catch (e) {
    console.error('Error restoring image cache:', e);
  }
};

/**
 * Returns a list of critical images that should be preloaded for the app
 * Includes product images and UI elements
 */
export const getCriticalImages = () => [
  // Logos and branding
  '/store-img/logos-img/MHA_Black_Logo_Transparent.png',
  '/store-img/logos-img/MHA_Gold_Logo_White_Background.jpg',
  
  // Hero images
  '/store-img/hero-img/Luxury_Candle_Collection.jpg',
  '/store-img/hero-img/Reed_Diffuser_Collection.jpg',
  '/store-img/hero-img/Statement_Furniture.jpg',
  
  // Common product images - add all variations and path types for maximum compatibility
  '/store-img/candles/candle-1.jpg',
  'store-img/candles/candle-1.jpg',
  '/store-img/candles/candle-2.jpg',
  'store-img/candles/candle-2.jpg',
  '/store-img/candles/candle-3.jpg',
  '/store-img/diffusers/diffuser-1.jpg',
  'store-img/diffusers/diffuser-1.jpg',
  '/store-img/diffusers/diffuser-2.jpg',
  '/store-img/gift-cards/gift-card-1.jpg',
  'store-img/gift-cards/gift-card-1.jpg',
  '/store-img/furniture/furniture-1.jpg',
  'store-img/furniture/furniture-1.jpg',
  '/store-img/wall-art/wall-art-1.jpg',
  '/store-img/incense/incense-1.jpg'
];

/**
 * Force reload all critical images after auth state changes
 */
export const reloadImagesAfterAuthChange = () => {
  clearImageCache();
  console.log('Forcing reload of all images after auth change');
  return preloadCriticalImages(getCriticalImages());
};

/**
 * Get an image URL that will work reliably based on past loading successes
 * This can be used by components to get the most reliable path format
 * @param {string} originalPath - The original image path
 * @returns {string} The formatted path that is most likely to work
 */
export const getReliableImagePath = (originalPath) => {
  try {
    const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '[]');
    
    // Check if we've successfully loaded this exact path before
    if (loadedImages.includes(originalPath)) {
      return formatImagePath(originalPath);
    }
    
    // Try to match the filename part
    const filename = originalPath.split('/').pop();
    const matchingPath = loadedImages.find(path => path.includes(filename));
    
    if (matchingPath) {
      return formatImagePath(matchingPath);
    }
  } catch (e) {
    console.error('Error getting reliable image path:', e);
  }
  
  // Fall back to standard formatting
  return formatImagePath(originalPath);
};
