/* ========================================
   FUTEBOL E MARRA EC (FME 21) - APP.JS
   ======================================== */

// ==========================================
// DATA MOCKADA
// ==========================================
const DATA = {
    numeroSocios: 86764,
    sponsors: [

        { name: 'MGL Leilões', image: 'public/assets/img/b4ee4e01f3be8b14fa3cc2d050b3c79d.jpg' },
        { name: 'MGL Leilões', image: 'public/assets/img/b4ee4e01f3be8b14fa3cc2d050b3c79d.jpg' },
        { name: 'Edinho Auto Mecânica', image: 'public/assets/img/b4ee4e01f3be8b14fa3cc2d050b3c79d.jpg' },
        { name: 'Beto & Cia Autos', image: 'public/assets/img/b4ee4e01f3be8b14fa3cc2d050b3c79d.jpg' },
        { name: 'Bebidas ZL', image: 'public/assets/img/b4ee4e01f3be8b14fa3cc2d050b3c79d.jpg' },
        { name: 'Churras na Brasa', image: 'public/assets/img/b4ee4e01f3be8b14fa3cc2d050b3c79d.jpg' }

    ],
    beneficiosSocio: [
        {
            icon: 'discount',
            title: 'Descontos em parceiros',
            description: 'Descontos exclusivos em lojas e estabelecimentos parceiros'
        },
        {
            icon: 'star',
            title: 'Prioridade em eventos',
            description: 'Acesso prioritário a jogos, eventos e confraternizações'
        },
        {
            icon: 'lock',
            title: 'Conteúdo exclusivo',
            description: 'Vídeos, bastidores e conteúdos especiais só para sócios'
        }
    ],
    pageInfo: {
        tickets: { title: 'Ingressos', description: 'Em breve você poderá comprar ingressos online!' },
        shop: { title: 'Loja Oficial', description: 'Nossa loja virtual está sendo preparada com muito carinho!' },
        membership: { title: 'Seja Sócio', description: 'O programa de sócios será lançado em breve!' },
        faq: { title: 'Perguntas Frequentes', description: 'Tire suas dúvidas sobre o FME 21' },
        privacy: { title: 'Políticas de Privacidade', description: 'Saiba como tratamos seus dados' }
    }
};

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const elements = {
    // Header
    hamburgerBtn: document.getElementById('hamburger-btn'),
    userBtn: document.getElementById('user-btn'),
    sociosNumber: document.getElementById('socios-number'),

    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    closeSidebar: document.getElementById('close-sidebar'),

    // Carousel
    carousel: document.getElementById('carousel'),
    carouselTrack: document.getElementById('carousel-track'),
    carouselIndicators: document.getElementById('carousel-indicators'),
    carouselPrev: document.getElementById('carousel-prev'),
    carouselNext: document.getElementById('carousel-next'),

    // Pages
    mainContent: document.getElementById('main-content'),
    pages: document.querySelectorAll('.page'),

    // Sponsors Grid
    sponsorsGrid: document.getElementById('sponsors-grid'),
    sponsorsGridFull: document.getElementById('sponsors-grid-full'),

    // Forms
    loginForm: document.getElementById('login-form'),
    contactForm: document.getElementById('contact-form'),

    // Modals
    floatingBtn: document.getElementById('floating-btn'),
    contactModal: document.getElementById('contact-modal'),
    sponsorModal: document.getElementById('sponsor-modal'),
    sponsorModalImage: document.getElementById('sponsor-modal-image'),
    sponsorModalName: document.getElementById('sponsor-modal-name'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),

    // Generic Page
    genericTitle: document.getElementById('generic-title'),
    genericDescription: document.getElementById('generic-description')
};

// ==========================================
// UTILIDADES
// ==========================================
function showToast(message, duration = 3000) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('active');
    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, duration);
}

function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
}

// ==========================================
// SIDEBAR (Menu Lateral)
// ==========================================
function openSidebar() {
    elements.sidebar.classList.add('active');
    elements.sidebarOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeSidebar() {
    elements.sidebar.classList.remove('active');
    elements.sidebarOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function initSidebar() {
    elements.hamburgerBtn.addEventListener('click', openSidebar);
    elements.closeSidebar.addEventListener('click', closeSidebar);
    elements.sidebarOverlay.addEventListener('click', closeSidebar);

    // Fechar sidebar ao clicar em links
    elements.sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });
}

// ==========================================
// ACCORDION
// ==========================================
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;

            // Fechar todos os outros
            accordionHeaders.forEach(h => {
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = '0';
            });

            // Toggle do clicado
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// ==========================================
// CARROSSEL
// ==========================================
let carouselState = {
    currentSlide: 0,
    totalSlides: 0,
    autoplayInterval: null,
    touchStartX: 0,
    touchEndX: 0
};

function updateCarousel() {
    const offset = -carouselState.currentSlide * 100;
    elements.carouselTrack.style.transform = `translateX(${offset}%)`;

    // Atualizar indicadores
    const indicators = elements.carouselIndicators.querySelectorAll('.carousel-indicator');
    indicators.forEach((ind, index) => {
        ind.classList.toggle('active', index === carouselState.currentSlide);
    });
}

function goToSlide(index) {
    carouselState.currentSlide = index;
    if (carouselState.currentSlide >= carouselState.totalSlides) {
        carouselState.currentSlide = 0;
    }
    if (carouselState.currentSlide < 0) {
        carouselState.currentSlide = carouselState.totalSlides - 1;
    }
    updateCarousel();
}

function nextSlide() {
    goToSlide(carouselState.currentSlide + 1);
}

function prevSlide() {
    goToSlide(carouselState.currentSlide - 1);
}

function startAutoplay() {
    carouselState.autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    clearInterval(carouselState.autoplayInterval);
}

function handleTouchStart(e) {
    carouselState.touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
}

function handleTouchEnd(e) {
    carouselState.touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
}

function handleSwipe() {
    const diff = carouselState.touchStartX - carouselState.touchEndX;
    const threshold = 50;

    if (diff > threshold) {
        nextSlide();
    } else if (diff < -threshold) {
        prevSlide();
    }
}

function initCarousel() {
    const slides = elements.carouselTrack.querySelectorAll('.carousel-slide');
    carouselState.totalSlides = slides.length;

    // Criar indicadores
    for (let i = 0; i < carouselState.totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
        indicator.setAttribute('aria-label', `Slide ${i + 1}`);
        indicator.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(i);
            startAutoplay();
        });
        elements.carouselIndicators.appendChild(indicator);
    }

    // Event listeners
    elements.carouselPrev.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
    });

    elements.carouselNext.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
    });

    // Touch events
    elements.carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    elements.carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Iniciar autoplay
    startAutoplay();
}

// ==========================================
// ROTEAMENTO SPA
// ==========================================
function navigateTo(hash) {
    let route = hash.replace('#/', '') || 'home';
    let pageId = 'page-home';

    // Mapear rotas para páginas
    if (route === 'home' || route === '') {
        pageId = 'page-home';
    } else if (route === 'login') {
        pageId = 'page-login';
    } else if (route === 'sponsors') {
        pageId = 'page-sponsors';
    } else {
        // Páginas genéricas
        pageId = 'page-generic';
        const routeKey = route.split('/')[0];
        const info = DATA.pageInfo[routeKey] || { title: 'Página', description: 'Conteúdo em breve...' };
        elements.genericTitle.textContent = info.title;
        elements.genericDescription.textContent = info.description;
    }

    // Mostrar página correta
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function initRouter() {
    // Navegar ao carregar
    navigateTo(window.location.hash);

    // Ouvir mudanças de hash
    window.addEventListener('hashchange', () => {
        navigateTo(window.location.hash);
    });

    // User button vai para login
    elements.userBtn.addEventListener('click', () => {
        window.location.hash = '#/login';
    });
}

// ==========================================
// PATROCINADORES
// ==========================================
function renderSponsors() {
    const grids = [elements.sponsorsGrid, elements.sponsorsGridFull];

    grids.forEach(grid => {
        if (!grid) return;
        grid.innerHTML = '';

        DATA.sponsors.forEach(sponsor => {
            const card = document.createElement('div');
            card.className = 'sponsor-card';
            card.innerHTML = `<img src="${sponsor.image}" alt="${sponsor.name}">`;
            card.addEventListener('click', () => openSponsorModal(sponsor));
            grid.appendChild(card);
        });
    });
}

function openSponsorModal(sponsor) {
    elements.sponsorModalImage.src = sponsor.image;
    elements.sponsorModalImage.alt = sponsor.name;
    elements.sponsorModalName.textContent = sponsor.name;
    elements.sponsorModal.classList.add('active');
}

function closeSponsorModal() {
    elements.sponsorModal.classList.remove('active');
}

// ==========================================
// MODAIS
// ==========================================
function initModals() {
    // Modal de contato
    elements.floatingBtn.addEventListener('click', () => {
        elements.contactModal.classList.add('active');
    });

    // Fechar modais
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('active');
        });
    });

    // Tecla ESC fecha modais
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
            closeSidebar();
        }
    });
}

// ==========================================
// FORMULÁRIOS
// ==========================================
function initForms() {
    // Login form
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (email && password) {
            showToast('✅ Login simulado com sucesso!');
            elements.loginForm.reset();
            setTimeout(() => {
                window.location.hash = '#/home';
            }, 1500);
        }
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const eyeOpen = btn.querySelector('.eye-open');
            const eyeClosed = btn.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        });
    });

    // Contact form
    elements.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('✅ Mensagem enviada com sucesso!');
        elements.contactForm.reset();
        elements.contactModal.classList.remove('active');
    });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
function init() {
    // Animar contador de sócios
    animateNumber(elements.sociosNumber, DATA.numeroSocios);

    // Inicializar componentes
    initSidebar();
    initAccordion();
    initCarousel();
    initRouter();
    initModals();
    initForms();

    // Renderizar patrocinadores
    renderSponsors();
}

// Executar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

