// Tema
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Menu mobile
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const themeToggle = document.querySelector('.theme-toggle');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Tema claro/escuro com persistência
const root = document.documentElement;

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Inicialização do tema
(function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
})();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Teclas de atalho: '/' para busca, Alt+M para menu, Home para topo
window.addEventListener('keydown', (e) => {
    // '/' foca na busca se existir
    if (e.key === '/' && document.getElementById('search')) {
        e.preventDefault();
        document.getElementById('search').focus();
    }
    // Alt+M foca no menu
    if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.querySelector('a').focus();
    }
    // Home sobe para o topo
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});
