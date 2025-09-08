
// ========== MENU RESPONSIVO ACESSÍVEL ==========
document.addEventListener('DOMContentLoaded', () => {
    // Suporte para menu antigo e novo
    const navToggle = document.querySelector('.nav__toggle, .enterprise-nav__toggle');
    const navMenu = document.querySelector('#nav-menu, .enterprise-nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('nav__menu--open');
            navMenu.classList.toggle('enterprise-nav__menu--open');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav__link, .enterprise-nav__item').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav__menu--open', 'enterprise-nav__menu--open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Fechar menu ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

// ========== TEMA CLARO/ESCURO ACESSÍVEL ==========
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;
const THEME_KEY = 'theme';
function setTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark');
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('dark');
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem(THEME_KEY, theme);
}
// Detecta preferência inicial
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}
themeToggle.addEventListener('click', () => {
  const isDark = root.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

// ========== TECLAS DE ACESSIBILIDADE ==========
document.addEventListener('keydown', (e) => {
  // '/' foca na busca se existir
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    const search = document.querySelector('input[type="search"]');
    if (search) search.focus();
  }
  // Alt+M foca no menu
  if (e.altKey && (e.key === 'm' || e.key === 'M')) {
    e.preventDefault();
    navToggle.focus();
  }
  // Home foca no conteúdo principal
  if (e.key === 'Home') {
    e.preventDefault();
    document.getElementById('main-content').focus();
  }
});

// Foco visível para navegação por teclado (CSS recomendado)
// Adicionar estilo de foco
const style = document.createElement('style');
style.textContent = ':focus { outline: 2px solid #2563EB; outline-offset: 2px; }';
document.head.appendChild(style);
