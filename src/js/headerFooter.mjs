// Templates for header and footer
const headerTemplate = `
<header class="main-header">
    <div class="container">
        <a href="index.html" class="logo">
            <img src="images/logo2.png" alt="Logo" width="80" height="80" class="logo">
            <span> Language Learning Companion</span>
        </a>

        <button class="menu-toggle" id="menuToggle">☰</button>
        
        <nav class="main-nav" id="mainNav">
            <ul>
                <li><a href="index.html" class="nav-link"><img src="images/home.jpeg" alt="Home icon" width="32" height="32"> Home</a></li>
                <li><a href="search.html" class="nav-link"><img src="images/dictionary.png" alt="Dictionary icon" width="32" height="32"> Dictionary</a></li>
                <li><a href="favorites.html" class="nav-link"><img src="images/favorites.png" alt="Favorites icon" width="32" height="32"> Favorites</a></li>
                <li><a href="contact.html" class="nav-link"><img src="images/contact.png" alt="Contact icon" width="32" height="32"> Contact</a></li>
            </ul>
        </nav>
    </div>
</header>`;

const footerTemplate = `
<footer class="main-footer">
    <div class="container">
        <p>©<span id="currentyear"></span> Language Learning Companion | 🇵🇪 🌄 🍲 Anna Karpova de Nuñez 🍲 🌄 🇵🇪 Lima, Perú</p>
        <p><a href="https://drive.google.com/file/d/11L-qygkOWQO4un9uyg2VUQGYNBwCxSa0/view" target="_blank">Project Video</a></p>
        <p id="lastModified"></p>
    </div>
</footer>`;

function updateFooterDates() {
    const currentYearFooter = new Date().getFullYear();
    const yearElement = document.getElementById('currentyear');
    const lastModifiedElement = document.getElementById('lastModified');

    if (yearElement) {
        yearElement.textContent = currentYearFooter;
    }
    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last modified: ${document.lastModified}`;
    }
}

export function loadHeaderFooter() {
    // Insert header
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
        headerElement.innerHTML = headerTemplate;
        openMobileMenu();
        activeLink();
    }

    // Insert footer
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
        footerElement.innerHTML = footerTemplate;
        updateFooterDates();
    }
}

function openMobileMenu() {
    const menuButton = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mainNav');

    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', function () {
        // Toggle show class
        mobileMenu.classList.toggle('show');

        // Change icon based on state
        menuButton.textContent = mobileMenu.classList.contains('show') ? '✕' : '☰';
    });
}

function activeLink() {
    // Get current page (use index.html if empty)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    // Mark active link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}