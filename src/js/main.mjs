// main module
import { loadHeaderFooter } from './headerFooter.mjs';
import { initHomePage } from './home.mjs';

async function initializeApp() {
    // Load header and footer on every page
    await loadHeaderFooter();

    // Initialize page functionality
    const path = window.location.pathname;

    if (path.includes('search.html')) {
        initDictionaryPage();
    } else if (path.includes('favorites.html')) {
        initFavoritesPage();
    } else if (path.includes('contact.html')) {
        initContactPage();
    } else {
        initHomePage(); // home page
    }

    console.log('Language Learning Companion initialized');
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);