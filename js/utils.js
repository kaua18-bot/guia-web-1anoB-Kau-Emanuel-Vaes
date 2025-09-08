/**
 * Utility Functions
 * Funções utilitárias de alto nível para uso em todo o projeto
 */

// Namespace para evitar conflitos globais
const WebGuide = {
    // Configurações globais
    config: {
        breakpoints: {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280
        },
        animationDuration: 300,
        debounceDelay: 250
    },

    // Sistema de eventos customizado
    eventBus: {
        events: {},
        on(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        },
        off(event, callback) {
            if (this.events[event]) {
                this.events[event] = this.events[event].filter(cb => cb !== callback);
            }
        },
        emit(event, data) {
            if (this.events[event]) {
                this.events[event].forEach(callback => callback(data));
            }
        }
    },

    // Utilitários de DOM
    dom: {
        /**
         * Query selector com cache
         * @param {string} selector - Seletor CSS
         * @param {HTMLElement} context - Elemento contexto (opcional)
         * @returns {HTMLElement}
         */
        $(selector, context = document) {
            return context.querySelector(selector);
        },

        /**
         * Query selector all com cache
         * @param {string} selector - Seletor CSS
         * @param {HTMLElement} context - Elemento contexto (opcional)
         * @returns {NodeList}
         */
        $$(selector, context = document) {
            return context.querySelectorAll(selector);
        },

        /**
         * Adiciona múltiplas classes
         * @param {HTMLElement} element - Elemento alvo
         * @param {...string} classes - Classes a serem adicionadas
         */
        addClass(element, ...classes) {
            element.classList.add(...classes);
        },

        /**
         * Remove múltiplas classes
         * @param {HTMLElement} element - Elemento alvo
         * @param {...string} classes - Classes a serem removidas
         */
        removeClass(element, ...classes) {
            element.classList.remove(...classes);
        }
    },

    // Utilitários de animação
    animation: {
        /**
         * Anima um elemento com fade
         * @param {HTMLElement} element - Elemento a ser animado
         * @param {string} type - 'in' ou 'out'
         * @returns {Promise}
         */
        fade(element, type = 'in') {
            return new Promise(resolve => {
                const start = type === 'in' ? 0 : 1;
                const end = type === 'in' ? 1 : 0;
                
                element.style.opacity = start;
                element.style.display = 'block';

                requestAnimationFrame(() => {
                    element.style.transition = `opacity ${WebGuide.config.animationDuration}ms ease`;
                    element.style.opacity = end;

                    setTimeout(() => {
                        if (type === 'out') {
                            element.style.display = 'none';
                        }
                        element.style.transition = '';
                        resolve();
                    }, WebGuide.config.animationDuration);
                });
            });
        }
    },

    // Utilitários de performance
    performance: {
        /**
         * Debounce para otimização de performance
         * @param {Function} fn - Função a ser debounced
         * @param {number} delay - Delay em ms
         * @returns {Function}
         */
        debounce(fn, delay = WebGuide.config.debounceDelay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        },

        /**
         * Throttle para otimização de performance
         * @param {Function} fn - Função a ser throttled
         * @param {number} limit - Limite em ms
         * @returns {Function}
         */
        throttle(fn, limit = WebGuide.config.debounceDelay) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },

    // Utilitários de validação
    validation: {
        /**
         * Valida um email
         * @param {string} email - Email a ser validado
         * @returns {boolean}
         */
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        /**
         * Valida uma senha forte
         * @param {string} password - Senha a ser validada
         * @returns {boolean}
         */
        isStrongPassword(password) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        }
    },

    // Utilitários de armazenamento
    storage: {
        /**
         * Salva no localStorage com expiração
         * @param {string} key - Chave
         * @param {*} value - Valor
         * @param {number} expirationInMinutes - Tempo de expiração em minutos
         */
        setWithExpiry(key, value, expirationInMinutes) {
            const item = {
                value,
                expiry: new Date().getTime() + (expirationInMinutes * 60 * 1000)
            };
            localStorage.setItem(key, JSON.stringify(item));
        },

        /**
         * Recupera do localStorage verificando expiração
         * @param {string} key - Chave
         * @returns {*}
         */
        getWithExpiry(key) {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            if (new Date().getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        }
    },

    // Inicialização do sistema
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
            this.setupEventListeners();
            this.checkResponsiveBreakpoints();
        });

        window.addEventListener('resize', this.performance.debounce(() => {
            this.checkResponsiveBreakpoints();
        }));
    },

    // Inicialização de componentes
    initializeComponents() {
        // Inicializa todos os componentes interativos
        this.dom.$$('[data-component]').forEach(element => {
            const componentName = element.dataset.component;
            if (this[componentName] && typeof this[componentName].init === 'function') {
                this[componentName].init(element);
            }
        });
    },

    // Setup de event listeners
    setupEventListeners() {
        // Setup de listeners globais
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.eventBus.emit('openSearch');
            }
        });
    },

    // Verificação de breakpoints responsivos
    checkResponsiveBreakpoints() {
        const width = window.innerWidth;
        Object.entries(this.config.breakpoints).forEach(([breakpoint, value]) => {
            if (width >= value) {
                document.documentElement.classList.add(`breakpoint-${breakpoint}`);
            } else {
                document.documentElement.classList.remove(`breakpoint-${breakpoint}`);
            }
        });
    }
};

// Inicialização
WebGuide.init();
