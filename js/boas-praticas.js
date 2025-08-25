// Elementos DOM
const accordionItems = document.querySelectorAll('.accordion__item');
const checkboxes = document.querySelectorAll('input[type="checkbox"][data-save]');
const progressBar = document.querySelector('.progress__bar');
const progressText = document.querySelector('.progress__text');

// Funções
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    header.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
    } else {
        content.classList.remove('active');
        content.style.maxHeight = null;
    }
}

function updateProgress() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const percentage = (checked / total) * 100;
    
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressText.textContent = `${Math.round(percentage)}% Completo`;
    
    // Salvar estado no localStorage
    const checkboxStates = {};
    checkboxes.forEach(checkbox => {
        checkboxStates[checkbox.dataset.save] = checkbox.checked;
    });
    localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
}

// Event Listeners
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const content = item.querySelector('.accordion__content');
    
    header.addEventListener('click', () => toggleAccordion(header));
    
    // Acessibilidade para teclado
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion(header);
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
