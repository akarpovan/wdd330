// home page module
const QUOTABLE_API = 'https://api.quotable.io/random';

export function initHomePage() {
    console.log('Initializing home page...');

    // 1. DOM elements from the "index.html" page
    const elements = {
        quoteText: document.getElementById('quote-text'),
        quoteAuthor: document.getElementById('quote-author'),
        quoteTags: document.getElementById('quote-tags'),
        quoteAuthorSlug: document.getElementById('quote-authorSlug'),
        quoteLength: document.getElementById('quote-length'),
        quoteDateAdded: document.getElementById('quote-dateAdded'),
        quoteDateModified: document.getElementById('quote-dateModified'),
        quoteDateNow: document.getElementById('quote-dateNow'),
        actualCategory: document.getElementById('actual-category'),
        newQuoteButton: document.getElementById('new-quote'),
        saveQuoteButton: document.getElementById('save-quote'),
        categoryButtons: document.querySelector('.category-buttons')
    };

    // 2. Check elements
    if (!elements.newQuoteButton || !elements.saveQuoteButton) {
        console.error('Error: elements are missing from the page.');
        // Message to the user
        if (elements.quoteText) {
            elements.quoteText.textContent = 'Error: page not configured correctly';
        }
        return; // leave
    }

    let actualQuote = null;
    let actualCategory = 'inspirational'; //default

    // 3. Configure events
    elements.newQuoteButton.addEventListener('click', fetchNewQuote);
    elements.saveQuoteButton.addEventListener('click', saveQuote);

    // 4. Categories array
    const categories = [
        { id: 'inspirational', name: 'Inspirational' },
        { id: 'wisdom', name: 'Wisdom' },
        { id: 'famous-quotes', name: 'Famous' },
        { id: 'success', name: 'Success' },
        { id: 'life', name: 'Life' }
    ];

    // 5. Create category buttons
    if (elements.categoryButtons) {
        elements.categoryButtons.innerHTML = categories.map(cat => `
            <button class="button-category ${cat.id === actualCategory ? 'active' : ''}"
                    data-category="${cat.id}">
                ${cat.name}
            </button>
        `).join('');

        // Event for categories
        elements.categoryButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('button-category')) {
                // Update active button
                document.querySelectorAll('.button-category').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Change category and search for a new appointment
                actualCategory = e.target.dataset.category;
                if (elements.actualCategory) {
                    const catName = categories.find(categ => categ.id === actualCategory)?.name || actualCategory;
                    elements.actualCategory.textContent = catName;
                }
                fetchNewQuote();
            }
        });
    }

    // 6. Load first appoinments
    fetchNewQuote();

    // local funcions
    async function fetchNewQuote() {
        try {
            showLoading(true);

            // Category API URL
            let apiUrl = QUOTABLE_API;
            if (actualCategory && actualCategory !== 'random') {
                apiUrl = `https://api.quotable.io/random?tags=${actualCategory}`;
            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            actualQuote = {
                content: data.content,
                author: data.author,
                tags: data.tags,
                authorSlug: data.authorSlug,
                length: data.length,
                dateAdded: data.dateAdded,
                dateModified: data.dateModified,
                category: actualCategory,
                dateNow: new Date().toISOString().split('T')[0]
            };

            displayQuote(actualQuote);
            showMessage('New quote loaded!', 'success');

        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to load quote', 'error');
            // Show supporting quote
            if (elements.quoteText && elements.quoteAuthor) {
                elements.quoteText.textContent = '"The journey of learning a language begins with a single word."';
                elements.quoteAuthor.textContent = 'Author: Language Learning Companion';
            }
        } finally {
            showLoading(false);
        }
    }

    function displayQuote(quote) {
        if (elements.quoteText) elements.quoteText.textContent = `"${quote.content}"`;
        if (elements.quoteAuthor) elements.quoteAuthor.textContent = `Author: ${quote.author}`;
        if (elements.quoteTags) elements.quoteTags.textContent = `Tags: ${quote.tags}`;
        if (elements.quoteAuthorSlug) elements.quoteAuthorSlug.textContent = `AuthorSlug: ${quote.authorSlug}`;
        if (elements.quoteLength) elements.quoteLength.textContent = `Length: ${quote.length}`;
        if (elements.quoteDateAdded) elements.quoteDateAdded.textContent = `Date added: ${quote.dateAdded}`;
        if (elements.quoteDateModified) elements.quoteDateModified.textContent = `Date modified: ${quote.dateModified}`;
        if (elements.quoteDateNow) elements.quoteDateNow.textContent = `Current date: ${quote.dateNow}`;

        if (elements.actualCategory) {
            const catName = categories.find(categ => categ.id === quote.category)?.name || quote.category;
            elements.actualCategory.textContent = catName;
        }
    }

    function saveQuote() {
        if (!actualQuote) return;

        // Save to localStorage
        const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');
        favorites.push({
            ...actualQuote,
            id: Date.now(),
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));

        // Update button
        elements.saveQuoteButton.textContent = 'Saved!';
        elements.saveQuoteButton.disabled = true;

        showMessage('Quote saved to favorites!', 'success');
    }

    function showLoading(show) {
        const section = document.querySelector('.quote-section');
        if (!section) return;

        if (show) {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
            spinner.id = 'temp-spinner';
            section.appendChild(spinner);
        } else {
            const spinner = document.getElementById('temp-spinner');
            if (spinner) spinner.remove();
        }
    }

    function showMessage(text, type = 'info') {
        // Remover notification
        document.querySelectorAll('.notification').forEach(el => el.remove());

        // Create new notification
        const msg = document.createElement('div');
        msg.className = `notification ${type}`;
        msg.textContent = text;

        // Remove
        document.body.appendChild(msg);

        // Delete
        setTimeout(() => msg.remove(), 3000);
    }
}