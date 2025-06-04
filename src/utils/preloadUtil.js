/**
 * Utility for preloading images to ensure they are in browser cache
 * Enhanced to handle authentication state changes
 */

// No imports needed

// Cache of already preloaded images to prevent duplicate loads
const preloadedImages = new Set();

/**
 * Add a loaded image path to local cache
 */
const addToCache = (originalPath, successfulPath) => {
  preloadedImages.add(originalPath);
  try {
    const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '{}');
    loadedImages[originalPath] = successfulPath;
    sessionStorage.setItem('loadedImages', JSON.stringify(loadedImages));
  } catch (e) {
    console.error('Error storing loaded image path:', e);
  }
};

/**
 * Get a cached image path
 */
const getFromCache = (originalPath) => {
  if (preloadedImages.has(originalPath)) {
    try {
      const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '{}');
      return loadedImages[originalPath] || null;
    } catch (e) {
      console.error('Error retrieving cached image path:', e);
    }
  }
  return null;
};

/**
 * Preloads an image and returns a promise that resolves when the image is loaded
 * @param {string} imagePath - The path to the image to preload
 * @returns {Promise} A promise that resolves when the image is loaded
 */
const preloadImage = (imagePath) => {
  return new Promise((resolve) => {
    // If image is already cached in sessionStorage, resolve immediately
    const cachedImage = getFromCache(imagePath);
    if (cachedImage) {
      console.log(`Image already cached: ${imagePath}`);
      resolve(cachedImage);
      return;
    }

    // Always try both paths (with and without MHA-React prefix)
    const tryPaths = [
      // Standard path (works in local dev)
      imagePath.startsWith('/') ? imagePath : `/${imagePath}`,
      // GitHub Pages path
      imagePath.startsWith('/') ? `/MHA-React${imagePath}` : `/MHA-React/${imagePath}`
    ];
    
    // Try loading with each path in sequence
    let pathIndex = 0;
    
    const tryNextPath = () => {
      if (pathIndex >= tryPaths.length) {
        console.warn(`Could not load image: ${imagePath}, but continuing anyway`);
        // Instead of rejecting, resolve with null to prevent app from crashing
        resolve(null);
        return;
      }
      
      const currentPath = tryPaths[pathIndex];
      const img = new Image();
      
      img.onload = () => {
        console.log(`Successfully loaded image: ${currentPath}`);
        addToCache(imagePath, currentPath);
        resolve(currentPath);
      };
      
      img.onerror = () => {
        console.log(`Failed to load image with path: ${currentPath}, trying next path...`);
        pathIndex++;
        tryNextPath();
      };
      
      img.src = currentPath;
    };
    
    // Start the loading process
    tryNextPath();
  });
};

/**
 * Preloads critical images to ensure they're cached
 * @param {string[]} imagePaths - Array of image paths to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadCriticalImages = (imagePaths) => {
  // First clear the cache to ensure fresh loading after auth changes
  clearImageCache();
  
  // Use Promise.allSettled instead of Promise.all to continue even if some images fail
  const imagePromises = imagePaths.map(path => {
    // Wrap each preload operation to catch any unexpected errors
    return preloadImage(path).catch(error => {
      console.warn(`Failed to preload image ${path}: ${error.message}`);
      return null; // Return null instead of rejecting to prevent app crashing
    });
  });
  
  return Promise.allSettled(imagePromises).then(results => {
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
    const failed = results.length - succeeded;
    console.log(`Image preloading complete. Success: ${succeeded}, Failed: ${failed}`);
    return results.map(r => r.status === 'fulfilled' ? r.value : null);
  });
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
    const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '{}');
    Object.keys(loadedImages).forEach(path => preloadedImages.add(path));
    console.log(`Restored ${preloadedImages.size} cached image paths from session`);
  } catch (e) {
    console.error('Error restoring image cache:', e);
  }
};

/**
 * Returns a list of critical images that should be preloaded for the app
 * Includes product images and UI elements
 */
export const getCriticalImages = () => {
  // Keep the critical images list minimal to reduce errors
  // Only include images that are absolutely critical for first render
  return [
    // Only include the logo used in the Header component fallback
    '/store-img/logos-img/MHA_Gold_Logo_White_Background.jpg',
    
    // Skip other preloads - individual components will handle their own images
    // and we've added proper fallbacks in the ProductCard component
  ];
};

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
    const loadedImages = JSON.parse(sessionStorage.getItem('loadedImages') || '{}');
    
    // Check if we've successfully loaded this exact path before
    if (loadedImages[originalPath]) {
      return loadedImages[originalPath];
    }
    
    // Try to match the filename part
    const filename = originalPath.split('/').pop();
    for (const [path, cachedPath] of Object.entries(loadedImages)) {
      if (path.includes(filename) || cachedPath.includes(filename)) {
        return cachedPath;
      }
    }
  } catch (e) {
    console.error('Error getting reliable image path:', e);
  }
  
  // Fall back to standard formatting - ensure leading slash
  return originalPath.startsWith('/') ? originalPath : `/${originalPath}`;
};
