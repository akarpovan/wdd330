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
                <li><a href="contact.html" class="nav-link"><img src="images/contact.png" alt="Cantact icon" width="32" height="32"> Contact</a></li>
            </ul>
        </nav>
    </div>
</header>`;

const footerTemplate = `
<footer class="main-footer">
    <div class="container">
    <p>©<span id="currentyear"></span> Language Learning Companion | 🇵🇪 🌄 🍲 Anna Karpova de Nuñez 🍲 🌄 🇵🇪 Lima,
        Perú</p>
    <p><a href=""
        target="_blank">Project
        Video</a></p>
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

export async function loadHeaderFooter() {
    // Insert header
    const headerElement = document.getElementById('main-header');
    if (headerElement) {
        headerElement.innerHTML = headerTemplate;

        // Wait for an event cycle for the DOM to update
        setTimeout(() => {
            console.log('Running openMobileMenu after insertion');
            openMobileMenu();
            activeLink();
        }, 0);
    }

    // Insert footer
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
        footerElement.innerHTML = footerTemplate;
        updateFooterDates();
    }
}

function openMobileMenu() {
    // Find elements
    const menuButton = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mainNav');

    // If they don't exist, leave
    if (!menuButton || !mobileMenu) return;

    // listener for clicks on the button ☰
    menuButton.addEventListener('click', function () {
        // Is the menu visible now?
        const isMenuVisible = mobileMenu.classList.contains('show');

        if (isMenuVisible) {
            // If it IS visible: HIDE
            mobileMenu.classList.remove('show');
            menuButton.textContent = '☰';
        } else {
            // If it is NOT visible: SHOW
            mobileMenu.classList.add('show');
            menuButton.textContent = '✕';
        }
    });
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('show');
    }
}

function activeLink() {
    // Get the current file name
    const currentPage = window.location.pathname.split('/').pop();

    // Search all menu links
    const navLinks = document.querySelectorAll('.nav-link');

    // Check each link
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href'); // "index.html"

        // If it matches the current page, mark it as active.
        if (linkPage === currentPage) {
            link.classList.add('active');
        }

        // Special case: index.html in the root
        if (currentPage === '' && linkPage === 'index.html') {
            link.classList.add('active');
        }
    });
}