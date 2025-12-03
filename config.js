// Configuration loader for GitHub Pages environment variables
// This script loads Firebase configuration from GitHub Pages environment variables

(function() {
  // Check if we're in GitHub Pages environment
  const isGitHubPages = window.location.hostname.includes('github.io') || 
                       window.location.hostname.includes('pages.dev');
  
  if (isGitHubPages) {
    // In production (GitHub Pages), these values will be replaced during build
    window.FIREBASE_CONFIG = {
      apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
      authDomain: "FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
      databaseURL: "FIREBASE_DATABASE_URL_PLACEHOLDER",
      projectId: "FIREBASE_PROJECT_ID_PLACEHOLDER",
      storageBucket: "FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
      messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
      appId: "FIREBASE_APP_ID_PLACEHOLDER",
      measurementId: "FIREBASE_MEASUREMENT_ID_PLACEHOLDER"
    };
  } else {
    // In development, config will be loaded from .env.local via a local server
    // or you can set these values directly for client-side only apps
    window.FIREBASE_CONFIG = null; // Will be set by local development setup
  }
})();