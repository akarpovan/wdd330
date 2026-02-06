// home page module
const QUOTABLE_API = 'https://api.quotable.io/random';

export function initHomePage() {
    console.log('Initializing home page...');

    // 1. DOM elements from the "index.html" page
    const elements = {
        quoteContent: document.getElementById('quote-content'),
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
        if (elements.quoteContent) {
            elements.quoteContent.textContent = 'Error: page not configured correctly';
        }
        return; // leave
    }

    //3. Declare variables 
    let actualQuote = null;
    let actualCategory = 'inspirational';

    // 4. Categories array
    const categories = [
        { id: 'inspirational', name: 'Inspirational' },
        { id: 'wisdom', name: 'Wisdom' },
        { id: 'famous-quotes', name: 'Famous' },
        { id: 'success', name: 'Success' },
        { id: 'life', name: 'Life' }
    ];

    function getCategoryName(categoryId) {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    }

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
                    elements.actualCategory.textContent = getCategoryName(actualCategory);
                }
                fetchNewQuote();
            }
        });
    }

    // 3. Configure events
    elements.newQuoteButton.addEventListener('click', fetchNewQuote);
    elements.saveQuoteButton.addEventListener('click', saveQuote);

    // 6. Load first appoinments
    fetchNewQuote();

    // local funcions
    async function fetchNewQuote() {
        try {
            showLoading(true);

            // Build API URL
            let apiUrl = QUOTABLE_API;
            if (actualCategory && actualCategory !== 'random') {
                apiUrl = `${QUOTABLE_API}?tags=${actualCategory}`;
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

            // Reset save button
            elements.saveQuoteButton.textContent = 'Save quote to favorites';
            elements.saveQuoteButton.disabled = false;

            showMessage('New quote loaded!', 'success');

        } catch (error) {
            console.error('Error:', error);
            showMessage('Failed to load quote', 'error');
            // Show supporting quote
            if (elements.quoteContent && elements.quoteAuthor) {
                elements.quoteContent.textContent = '"The journey of learning a language begins with a single word."';
                elements.quoteAuthor.textContent = 'Author: Language Learning Companion';
            }
        } finally {
            showLoading(false);
        }
    }

    function displayQuote(quote) {
        // Update all quote details
        if (elements.quoteContent) {
            elements.quoteContent.textContent = `"${quote.content}"`;
        }
        if (elements.quoteAuthor) {
            elements.quoteAuthor.textContent = `Author: ${quote.author}`;
        }
        if (elements.quoteTags) {
            elements.quoteTags.textContent = `Tags: ${quote.tags.join(', ')}`;
        }
        if (elements.quoteAuthorSlug) {
            elements.quoteAuthorSlug.textContent = `AuthorSlug: ${quote.authorSlug}`;
        }
        if (elements.quoteLength) {
            elements.quoteLength.textContent = `Length: ${quote.length}`;
        }
        if (elements.quoteDateAdded) {
            elements.quoteDateAdded.textContent = `Date added: ${quote.dateAdded}`;
        }
        if (elements.quoteDateModified) {
            elements.quoteDateModified.textContent = `Date modified: ${quote.dateModified}`;
        }
        if (elements.quoteDateNow) {
            elements.quoteDateNow.textContent = `Current date: ${quote.dateNow}`;
        }
        if (elements.actualCategory) {
            elements.actualCategory.textContent = getCategoryName(quote.category);
        }
    }

    function saveQuote() {
        if (!actualQuote) return;

        /// Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');

        // Create new favorite quote
        const newFavorite = {
            content: actualQuote.content,
            author: actualQuote.author,
            tags: actualQuote.tags,
            authorSlug: actualQuote.authorSlug,
            length: actualQuote.length,
            dateAdded: actualQuote.dateAdded,
            dateModified: actualQuote.dateModified,
            category: actualQuote.category,
            id: Date.now(),
            savedAt: new Date().toISOString()
        };

        favorites.push(newFavorite);
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
        document.body.appendChild(msg);

        // Auto-remove after 3 seconds
        setTimeout(() => msg.remove(), 3000);
    }
}