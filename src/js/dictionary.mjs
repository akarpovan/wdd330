// Dictionary search
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export function initDictionaryPage() {
    console.log('Start dictionary page...');

    // DOM elements
    const elements = {
        dictInput: document.getElementById('dict-input'),
        dictButton: document.getElementById('dict-button'),
        dictResults: document.getElementById('dict-results'),
        loading: document.getElementById('loading')
    };

    // Event listeners
    elements.dictButton.addEventListener('click', dictWord);
    elements.dictInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') dictWord();
    });

    // Event listener for pronounce button
    elements.dictResults.addEventListener('click', (e) => {
        if (e.target.classList.contains('button-pronounce')) {
            const word = e.target.dataset.word;
            speakWord(word);
        }
    });

    // Focus on input when page loads
    elements.dictInput.focus();

    // Function to search for a word
    async function dictWord() {
        const word = elements.dictInput.value.trim();

        if (!word) {
            showMessage('Please enter an english word to search.', 'error');
            return;
        }

        try {
            showLoading(true);
            clearResults();

            const response = await fetch(`${DICTIONARY_API}${word}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Word "${word}" not found.`);
                }
                throw new Error('Dictionary service unavailable.');
            }

            const data = await response.json();
            displayWordData(data[0]);

            // Save to search history
            saveToDictHistory(word);

        } catch (error) {
            console.error('Search error:', error);
            showMessage(error.message, 'error');
        } finally {
            showLoading(false);
        }
    }

    // Function to display word data
    function displayWordData(wordData) {
        const meanings = wordData.meanings?.length
            ? wordData.meanings.map(meaning => `
                 <div class="dict-meaning">
                     <h3>${meaning.partOfSpeech}</h3>
                     <ul class="dict-definitions">
                         ${meaning.definitions.slice(0, 3).map((def, index) => `
                             <li>
                                 <span class="dict-definition-number">${index + 1}.</span>
                                 <p class="dict-definition-text">${def.definition}</p>
                                 ${def.example ? `<p class="dict-example">Example: "${def.example}"</p>` : ''}
                             </li>
                         `).join('')}
                     </ul>
                 </div>
             `).join('')
            : '';

        const html = `
             <div class="dict-word-card fadeIn">
                 <div class="dict-word-header">
                     <h2>${wordData.word}</h2>
                     ${wordData.phonetic ? `<p class="dict-phonetic">/${wordData.phonetic}/</p>` : ''}
                 </div>
                 ${meanings}
                <div class="dict-word-actions">
                    <button class="button-pronounce button" data-word="${wordData.word}">Pronounce</button>
                </div>
             </div>
         `;

        elements.dictResults.innerHTML = html;
    }

    // Function to save to search history
    function saveToDictHistory(word) {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const index = history.indexOf(word);

        if (index > -1) history.splice(index, 1);

        history.unshift(word);
        if (history.length > 10) history.pop();

        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    // Function to speak word
    function speakWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
            showMessage(`Pronouncing: ${word}`, 'info');
        }
        else {
            showMessage('Text-to-speech not supported in your browser.', 'warning');
        }
    }


    function showLoading(show) {
        elements.loading.classList.toggle('hidden', !show);
    }

    function clearResults() {
        elements.dictResults.innerHTML = '';
    }

    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        elements.dictResults.appendChild(messageDiv);

        setTimeout(() => messageDiv.remove(), 3000);
    }
}