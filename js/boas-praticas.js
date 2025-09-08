// Elementos DOM
const accordionItems = document.querySelectorAll('.accordion__item');
const checkboxes = document.querySelectorAll('.practice-checkbox');
const progressBar = document.querySelector('.progress__bar');
const progressText = document.querySelector('.progress__text');

// Estado da aplicação
let progress = {
    total: checkboxes.length,
    completed: 0,
    categories: new Set()
};

// Funções de inicialização
function initializeApp() {
    loadSavedProgress();
    initializeAccordions();
    updateProgress();
    initializeKeyboardNavigation();
}

function loadSavedProgress() {
    checkboxes.forEach(checkbox => {
        const category = checkbox.dataset.category;
        const itemText = checkbox.parentElement.textContent.trim();
        const isChecked = localStorage.getItem(`practice_${category}_${itemText}`) === 'true';
        
        if (isChecked) {
            checkbox.checked = true;
            progress.completed++;
            progress.categories.add(category);
        }
    });
}

// Gerenciamento de acordeão
function initializeAccordions() {
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        const content = item.querySelector('.accordion__content');
        
        header.addEventListener('click', () => toggleAccordion(item));
        
        // Acessibilidade para teclado
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(item);
            }
        });
    });
}

function toggleAccordion(item) {
    const header = item.querySelector('.accordion__header');
    const content = item.querySelector('.accordion__content');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    // Fechar outros painéis
    accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
            const otherHeader = otherItem.querySelector('.accordion__header');
            const otherContent = otherItem.querySelector('.accordion__content');
            otherHeader.setAttribute('aria-expanded', 'false');
            otherContent.style.maxHeight = null;
        }
    });
    
    // Alternar painel atual
    header.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('active');
    } else {
        content.style.maxHeight = null;
        content.classList.remove('active');
    }
}

// Gerenciamento de progresso
function updateProgress() {
    const percentage = Math.round((progress.completed / progress.total) * 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressText.textContent = `${percentage}% Completo`;
    
    // Atualizar badges de categoria se existirem
    progress.categories.forEach(category => {
        const badge = document.querySelector(`.category-badge[data-category="${category}"]`);
        if (badge) {
            const categoryTotal = document.querySelectorAll(`.practice-checkbox[data-category="${category}"]`).length;
            const categoryCompleted = document.querySelectorAll(`.practice-checkbox[data-category="${category}"]:checked`).length;
            badge.textContent = `${categoryCompleted}/${categoryTotal}`;
        }
    });
}

function handleCheckboxChange(checkbox) {
    const category = checkbox.dataset.category;
    const itemText = checkbox.parentElement.textContent.trim();
    
    // Atualizar estado
    if (checkbox.checked) {
        progress.completed++;
        progress.categories.add(category);
    } else {
        progress.completed--;
        // Verificar se ainda existem itens marcados na categoria
        const categoryChecked = Array.from(checkboxes)
            .filter(cb => cb.dataset.category === category && cb.checked)
            .length;
        if (categoryChecked === 0) {
            progress.categories.delete(category);
        }
    }
    
    // Salvar no localStorage
    localStorage.setItem(`practice_${category}_${itemText}`, checkbox.checked);
    updateProgress();
}

// Navegação por teclado
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Alt + P para focar no primeiro checkbox
        if (e.altKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            const firstCheckbox = document.querySelector('.practice-checkbox');
            if (firstCheckbox) {
                firstCheckbox.focus();
            }
        }
        
        // Alt + N para próximo acordeão
        if (e.altKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            const expandedItem = document.querySelector('.accordion__header[aria-expanded="true"]');
            if (expandedItem) {
                const nextItem = expandedItem.closest('.accordion__item').nextElementSibling;
                if (nextItem) {
                    toggleAccordion(nextItem);
                }
            }
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
});

// Animações suaves
document.addEventListener('scroll', () => {
    const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
    fadeElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('visible');
        }
    });
});
        }
    });
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateProgress);
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar estado dos checkboxes
    const savedStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
    checkboxes.forEach(checkbox => {
        if (savedStates[checkbox.dataset.save]) {
            checkbox.checked = true;
        }
    });
    updateProgress();
});
