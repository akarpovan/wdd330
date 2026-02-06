// main module
import { loadHeaderFooter } from './headerFooter.mjs';
import { initHomePage } from './home.mjs';

async function initializeApp() {
    // Load header and footer on every page
    await loadHeaderFooter();

    // Get current page name
    const currentPage = window.location.pathname.split('/').pop();

    // Initialize page functionality based on current page
    switch (currentPage) {
        case 'search.html':
            //initDictionaryPage();
            break;
        case 'favorites.html':
            //initFavoritesPage();
            break;
        case 'contact.html':
            //initContactPage();
            break;
        default:
            initHomePage(); // home page
    }

    console.log('Language Learning Companion initialized');
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);