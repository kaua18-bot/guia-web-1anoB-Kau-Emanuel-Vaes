// Dados do fluxograma
const steps = [
    {
        id: 'descoberta',
        title: 'Descoberta',
        deliverables: [
            'Análise de mercado',
            'Definição de público-alvo',
            'Pesquisa de concorrentes'
        ],
        risks: [
            'Falta de clareza nos objetivos',
            'Escopo mal definido'
        ]
    },
    {
        id: 'requisitos',
        title: 'Requisitos',
        deliverables: [
            'Documento de requisitos',
            'User stories',
            'Critérios de aceitação'
        ],
        risks: [
            'Requisitos ambíguos',
            'Falta de priorização'
        ]
    },
    {
        id: 'prototipo',
        title: 'Protótipo',
        deliverables: [
            'Wireframes',
            'Design de interface',
            'Protótipo interativo'
        ],
        risks: [
            'Design não intuitivo',
            'Falta de teste com usuários'
        ]
    },
    {
        id: 'implementacao',
        title: 'Implementação',
        deliverables: [
            'Código fonte',
            'Documentação técnica',
            'Testes unitários'
        ],
        risks: [
            'Débito técnico',
            'Bugs não identificados'
        ]
    },
    {
        id: 'deploy',
        title: 'Deploy',
        deliverables: [
            'Build de produção',
            'Configuração de servidor',
            'Monitoramento'
        ],
        risks: [
            'Problemas de ambiente',
            'Downtime não planejado'
        ]
    }
];

// Elementos DOM
const svg = document.querySelector('.fluxograma svg');
const timeline = document.querySelector('.timeline');

// Funções
function createFlowchart() {
    // Limpar SVG existente (mantendo defs)
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    svg.appendChild(defs);

    // Configurações
    const boxWidth = 120;
    const boxHeight = 60;
    const gap = 100;
    const startX = 50;
    const centerY = 200;

    // Criar boxes e conexões
    steps.forEach((step, index) => {
        const x = startX + (boxWidth + gap) * index;
        
        // Box
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('fluxo-item');
        g.setAttribute('data-step', step.id);
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', centerY - boxHeight/2);
        rect.setAttribute('width', boxWidth);
        rect.setAttribute('height', boxHeight);
        rect.setAttribute('rx', '8');
        rect.setAttribute('fill', 'url(#boxGradient)');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + boxWidth/2);
        text.setAttribute('y', centerY + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.textContent = step.title;
        
        g.appendChild(rect);
        g.appendChild(text);
        svg.appendChild(g);
        
        // Seta para o próximo elemento
        if (index < steps.length - 1) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x + boxWidth);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', x + boxWidth + gap);
            line.setAttribute('y2', centerY);
            line.setAttribute('stroke', '#111827');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            svg.appendChild(line);
        }
    });
}

function createTimeline() {
    timeline.innerHTML = steps.map(step => `
        <div class="timeline__item" data-step="${step.id}">
            <h3>${step.title}</h3>
            <div class="timeline__content">
                <h4>Entregáveis:</h4>
                <ul>
                    ${step.deliverables.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <h4>Riscos:</h4>
                <ul>
                    ${step.risks.map(risk => `<li>${risk}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function showTooltip(stepId) {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    
    // Atualizar timeline
    document.querySelectorAll('.timeline__item').forEach(item => {
        item.classList.toggle('active', item.dataset.step === stepId);
    });
}

// Event Listeners
svg.addEventListener('click', (e) => {
    const item = e.target.closest('.fluxo-item');
    if (item) {
        showTooltip(item.dataset.step);
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    createFlowchart();
    createTimeline();
    // Ativar primeiro item por padrão
    showTooltip(steps[0].id);
});
