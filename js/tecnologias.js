// Dados das tecnologias
const technologies = [
    {
        name: 'React',
        category: 'frontend',
        description: 'Biblioteca JavaScript para construção de interfaces de usuário',
        level: 'intermediario',
        pros: ['Ecossistema rico', 'Grande comunidade'],
        cons: ['Curva de aprendizado', 'Bundle size'],
        when: ['Aplicações de página única (SPA)', 'Interfaces complexas e interativas', 'Projetos que precisam de componentização']
    },
    {
        name: 'Vue.js',
        category: 'frontend',
        description: 'Framework progressivo para construção de interfaces',
        level: 'intermediario',
        pros: ['Fácil de aprender', 'Documentação excelente'],
        cons: ['Ecossistema menor', 'Menos vagas no mercado'],
        when: ['Aplicações pequenas a médias', 'Quando você quer um framework completo mas simples', 'Projetos que precisam crescer gradualmente']
    },
    {
        name: 'Node.js',
        category: 'backend',
        description: 'Ambiente de execução JavaScript server-side',
        level: 'intermediario',
        pros: ['Mesma linguagem full-stack', 'NPM (gestor de pacotes)'],
        cons: ['Single-threaded', 'Callback hell'],
        when: ['APIs RESTful', 'Microsserviços', 'Aplicações em tempo real']
    },
    {
        name: 'MongoDB',
        category: 'database',
        description: 'Banco de dados NoSQL orientado a documentos',
        level: 'intermediario',
        pros: ['Flexível', 'Escalável'],
        cons: ['Sem ACID por padrão', 'Uso de memória'],
        when: ['Dados não estruturados', 'Escalabilidade horizontal necessária', 'Prototipagem rápida']
    },
    {
        name: 'Docker',
        category: 'devops',
        description: 'Plataforma de containerização',
        level: 'avancado',
        pros: ['Isolamento', 'Portabilidade'],
        cons: ['Complexidade inicial', 'Overhead'],
        when: ['Microsserviços', 'Deploy consistente', 'Ambientes isolados']
    },
    {
        name: 'Jest',
        category: 'testes',
        description: 'Framework de testes JavaScript',
        level: 'intermediario',
        pros: ['Fácil de usar', 'Mocking poderoso'],
        cons: ['Performance', 'Configuração complexa'],
        when: ['Testes unitários', 'Testes de integração', 'Projetos React']
    }
];

// Estado da aplicação
let activeFilter = 'todos';
let searchTerm = '';

// Elementos DOM
const searchInput = document.querySelector('#search');
const filterButtons = document.querySelectorAll('.filter-btn');
const techGrid = document.querySelector('.tech-grid');
const modal = document.querySelector('#modal-container');

// Funções
function filterTechnologies() {
    return technologies.filter(tech => {
        const matchesFilter = activeFilter === 'todos' || tech.category === activeFilter;
        const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tech.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
}

function createTechCard(tech) {
    return `
        <article class="tech-card" data-category="${tech.category}">
            <div class="tech-card__header">
                <h3>${tech.name}</h3>
                <span class="badge" data-level="${tech.level}">${tech.level}</span>
            </div>
            <p>${tech.description}</p>
            <div class="tech-card__details">
                <div class="pros-cons">
                    <h4>Prós:</h4>
                    <ul>
                        ${tech.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                    <h4>Contras:</h4>
                    <ul>
                        ${tech.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
                <button class="tech-card__btn" data-tech="${tech.name}">Saiba mais</button>
            </div>
        </article>
    `;
}

function renderTechnologies() {
    const filteredTechs = filterTechnologies();
    techGrid.innerHTML = filteredTechs.map(createTechCard).join('');
    
    // Salvar filtro no localStorage
    localStorage.setItem('lastFilter', activeFilter);
}

function showModal(tech) {
    const technology = technologies.find(t => t.name === tech);
    if (!technology) return;

    const modalContent = `
        <h2 class="modal__title">Quando escolher ${technology.name}?</h2>
        <div class="modal__body">
            <ul>
                ${technology.when.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;

    modal.querySelector('.modal__content').innerHTML = modalContent;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTechnologies();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        activeFilter = button.dataset.filter;
        renderTechnologies();
    });
});

techGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.tech-card__btn');
    if (btn) {
        showModal(btn.dataset.tech);
    }
});

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal__close')) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Recuperar último filtro do localStorage
    const lastFilter = localStorage.getItem('lastFilter');
    if (lastFilter) {
        activeFilter = lastFilter;
        const button = document.querySelector(`[data-filter="${lastFilter}"]`);
        if (button) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    }
    renderTechnologies();
});
