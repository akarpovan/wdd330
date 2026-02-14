// Favorites page
export function initFavoritesPage() {
    console.log('Start favorites page...');

    // DOM elements
    const elements = {
        favoritesContainer: document.getElementById('favorites-container'),
        favoritesCount: document.getElementById('favorites-count'),
        exportButton: document.getElementById('export-button'),
        emptyState: document.getElementById('empty-state')
    };

    let favorites = [];

    // Event listeners
    if (elements.exportButton) {
        elements.exportButton.addEventListener('click', exportFavorites);
    }

    // Event listener for delete button
    elements.favoritesContainer.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.button-delete');
        if (deleteButton) {
            const id = deleteButton.dataset.id;
            deleteFavorite(id);
        }
    });

    // Load favorites
    loadFavorites();
    displayFavorites();

    // Function to load favorites from localStorage
    function loadFavorites() {
        const saved = localStorage.getItem('favoriteQuotes');
        favorites = saved ? JSON.parse(saved) : [];
    }

    // Function to display favorites
    function displayFavorites() {
        if (favorites.length === 0) {
            showEmptyState();
            return;
        }

        // Hide empty state when there are favorites
        if (elements.emptyState) {
            elements.emptyState.classList.add('hidden');
        }

        updateCount(favorites.length);
        elements.favoritesContainer.innerHTML = favorites
            .map((fav, index) => createFavoriteHTML(fav, index))
            .join('');
    }

    // Function to create favorite element
    function createFavoriteHTML(favorite, index) {
        return `
             <div class="favorite-item" style="animation-delay: ${index * 0.1}s">
                 <div class="favorite-content">
                     <p class="favorite-quote">"${escapeHtml(favorite.content)}"</p>
                     <p class="favorite-author">— ${escapeHtml(favorite.author)}</p>
                 </div>
                 <div class="favorite-data">
                     <span class="category-badge">Category: ${favorite.category || 'General'}</span>
                     <span class="favorite-date">${formatDate(favorite.date || favorite.savedAt)}</span>
                     <button class="button-delete button" data-id="${favorite.id}">Delete</button>
                 </div>
             </div>
         `;
    }

    // Function to delete a favorite
    function deleteFavorite(id) {
        if (!confirm('Are you sure you want to delete this favorite?')) {
            return;
        }

        // Convertir id a número si es necesario
        const numericId = Number(id);
        favorites = favorites.filter(fav => fav.id !== numericId);
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));

        displayFavorites();
        showMessage('Favorite deleted.', 'success');
    }

    // Function to export favorites
    function exportFavorites() {
        // Verificar si hay favoritos
        if (favorites.length === 0) {
            showMessage('No favorites to export.', 'warning');
            return;
        }

        // Crear el encabezado del archivo
        let exportContent = 'MY FAVORITE QUOTES\n';
        exportContent += 'Exported: ' + new Date().toLocaleDateString() + '\n';
        exportContent += 'Total: ' + favorites.length + ' quotes\n';
        exportContent += '\n';

        // Agregar cada favorito al contenido
        for (let i = 0; i < favorites.length; i++) {
            const fav = favorites[i];
            const number = i + 1;

            exportContent += number + '. "' + fav.content + '"\n';
            exportContent += '   — ' + fav.author + '\n';
            exportContent += '   Category: ' + (fav.category || 'General') + '\n';
            exportContent += '   Date: ' + formatDate(fav.date || fav.savedAt) + '\n';
            exportContent += '\n';
        }

        // Crear el nombre del archivo con la fecha actual
        const today = new Date().toISOString().split('T')[0];
        const filename = 'my-quotes-' + today + '.txt';

        // Descargar el archivo
        downloadFile(exportContent, filename);

        // Mostrar mensaje de éxito
        showMessage('Exported ' + favorites.length + ' quotes.', 'success');
    }

    // Function to show empty state
    function showEmptyState() {
        elements.emptyState?.classList.remove('hidden');
        elements.favoritesContainer.innerHTML = '';
        updateCount(0);
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // aditional functions
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `notification ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => messageDiv.remove(), 3000);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateCount(count) {
        if (elements.favoritesCount) {
            elements.favoritesCount.textContent = count;
        }
    }
}