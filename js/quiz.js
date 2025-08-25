// Questões do quiz
const questions = [
    {
        question: 'Qual é a principal função do HTML em uma página web?',
        options: [
            'Estilizar a página',
            'Estruturar o conteúdo',
            'Adicionar interatividade',
            'Processar dados'
        ],
        correct: 1,
        explanation: 'HTML (HyperText Markup Language) é responsável por estruturar o conteúdo da página, definindo elementos como cabeçalhos, parágrafos, listas e outros componentes estruturais.'
    },
    {
        question: 'Qual dessas é uma boa prática de acessibilidade?',
        options: [
            'Usar apenas cores para transmitir informações',
            'Remover o outline dos elementos focados',
            'Adicionar textos alternativos em imagens',
            'Usar tabelas para layout'
        ],
        correct: 2,
        explanation: 'Textos alternativos (atributo alt) em imagens são essenciais para usuários que utilizam leitores de tela, permitindo que eles compreendam o conteúdo visual da página.'
    },
    {
        question: 'O que significa "mobile-first" no desenvolvimento web?',
        options: [
            'Desenvolver apenas para dispositivos móveis',
            'Começar o design pela versão mobile e depois expandir',
            'Criar apps nativos para celular',
            'Usar apenas tecnologias móveis'
        ],
        correct: 1,
        explanation: 'Mobile-first é uma abordagem de design responsivo onde começamos desenvolvendo para telas menores e progressivamente melhoramos a experiência para telas maiores.'
    },
    {
        question: 'Qual é o propósito principal do CSS em uma página web?',
        options: [
            'Definir a estrutura do documento',
            'Adicionar interatividade',
            'Estilizar e layoutar a página',
            'Processar formulários'
        ],
        correct: 2,
        explanation: 'CSS (Cascading Style Sheets) é usado para controlar a apresentação visual dos elementos HTML, incluindo cores, layouts, espaçamentos e animações.'
    },
    {
        question: 'Para que serve o JavaScript em uma página web?',
        options: [
            'Apenas para validar formulários',
            'Somente para animações',
            'Para estilizar elementos',
            'Para adicionar interatividade e comportamento dinâmico'
        ],
        correct: 3,
        explanation: 'JavaScript é uma linguagem de programação que permite adicionar comportamentos dinâmicos, manipular o DOM, fazer requisições AJAX e criar interações complexas.'
    },
    {
        question: 'O que é versionamento de código?',
        options: [
            'Compressão de arquivos',
            'Controle de mudanças no código fonte',
            'Minificação de JavaScript',
            'Backup de arquivos'
        ],
        correct: 1,
        explanation: 'Versionamento de código (como Git) permite controlar e rastrear mudanças no código fonte, facilitando o trabalho em equipe e a manutenção do projeto.'
    },
    {
        question: 'Qual é a melhor prática para organização de CSS?',
        options: [
            'Colocar todo CSS inline',
            'Usar nomes genéricos para classes',
            'Seguir uma metodologia como BEM',
            'Não usar classes'
        ],
        correct: 2,
        explanation: 'Metodologias como BEM (Block Element Modifier) ajudam a organizar o CSS de forma modular e manutenível, evitando conflitos e facilitando o desenvolvimento.'
    },
    {
        question: 'O que é deploy de uma aplicação web?',
        options: [
            'Processo de desenvolvimento',
            'Fase de testes',
            'Publicação da aplicação em produção',
            'Criação de backups'
        ],
        correct: 2,
        explanation: 'Deploy é o processo de publicar uma aplicação em um ambiente de produção, tornando-a disponível para os usuários finais.'
    }
];

// Estado do quiz
let currentQuestion = 0;
let score = 0;
let bestScore = parseInt(localStorage.getItem('quizBestScore')) || 0;

// Elementos DOM
const startSection = document.getElementById('quiz-start');
const questionsSection = document.getElementById('quiz-questions');
const resultsSection = document.getElementById('quiz-results');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const currentQuestionSpan = document.getElementById('current-question');
const scoreSpan = document.getElementById('score');
const bestScoreSpan = document.getElementById('best-score');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');

// Funções
function showQuestion() {
    const question = questions[currentQuestion];
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    questionElement.innerHTML = `<h3>${question.question}</h3>`;
    
    optionsElement.innerHTML = question.options.map((option, index) => `
        <button class="option" data-index="${index}">${option}</button>
    `).join('');
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.disabled = true;
        const index = parseInt(option.dataset.index);
        
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('wrong');
        }
    });
    
    if (selectedIndex === question.correct) {
        score++;
    }
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    questionsSection.classList.remove('active');
    resultsSection.classList.add('active');
    
    scoreSpan.textContent = score;
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('quizBestScore', bestScore);
        bestScoreSpan.textContent = bestScore;
    }
    
    const explanationsDiv = document.querySelector('.explanations');
    explanationsDiv.innerHTML = questions.map((q, index) => `
        <div class="explanation">
            <h4>Questão ${index + 1}</h4>
            <p>${q.explanation}</p>
        </div>
    `).join('');
}

function startQuiz() {
    startSection.classList.remove('active');
    questionsSection.classList.add('active');
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function restartQuiz() {
    resultsSection.classList.remove('active');
    startSection.classList.add('active');
}

// Event Listeners
startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

optionsElement.addEventListener('click', (e) => {
    const option = e.target.closest('.option');
    if (option && !option.disabled) {
        checkAnswer(parseInt(option.dataset.index));
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    bestScoreSpan.textContent = bestScore;
});
