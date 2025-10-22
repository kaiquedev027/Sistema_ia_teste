    // ===== Config de Scrol Automatico =====
    ScrollReveal({
    reset: false,           // repete animação ao voltar a rolar
    distance: '30px',      // distância do movimento
    duration: 1500,        // tempo da animação
    delay: 150,             // atraso inicial
    easing: 'ease-in-out'
    });

        // ===== Aplicar efeito em cada seção =====

        // Cabeçalho
        ScrollReveal().reveal('#navbar', { origin: 'top' });

        // Seção principal
        ScrollReveal().reveal('#cases', { origin: 'top' });

        
class AtlasRobotApp {
    constructor() {
        // Device and state management
        this.isMobile = window.innerWidth < 768;
        this.isMenuOpen = false;
        this.lottiePlayer = null;
        
        // Initialize the application
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNavbar();
        this.initializeHeroSection();
        this.initializeLottieAnimation();
        this.initializeScrollAnimations();
        this.initializeSmoothScrolling();
        this.initializeParallaxEffect();
        this.initializeLucideIcons();
        this.loadServices();
        this.loadCases();
        this.initializeContactForm();
    }

    setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
            this.handleResize();
        });

        // Window scroll handler
        window.addEventListener('scroll', () => {
            this.handleScroll();
        }, { passive: true });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Mobile menu links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Logo click handler
        const logoLink = document.getElementById('logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // Navigation inicio link
        const navInicio = document.getElementById('nav-inicio');
        if (navInicio) {
            navInicio.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }

    initializeNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Initial state
        this.updateNavbarState();
    }

    initializeHeroSection() {
        if (this.isMobile) return;

        const heroContainer = document.getElementById('hero-container');
        const heroImage = document.getElementById('hero-image');
        
        if (!heroContainer || !heroImage) return;

        // 3D tilt effect on mouse move
        heroContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = heroContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            heroImage.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        heroContainer.addEventListener('mouseleave', () => {
            heroImage.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
        });
    }

    initializeLottieAnimation() {
        const lottieContainer = document.getElementById('lottie-container');
        const fallbackImage = document.getElementById('fallback-image');
        
        if (!lottieContainer || !fallbackImage) return;

        // Try to load Lottie animation
        fetch('./assets/loop-header.lottie')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lottie file not found');
                }
                return response.json();
            })
            .then(data => {
                // Create lottie-player element
                const lottiePlayer = document.createElement('lottie-player');
                lottiePlayer.setAttribute('src', './assets/loop-header.lottie');
                lottiePlayer.setAttribute('background', 'transparent');
                lottiePlayer.setAttribute('speed', '1');
                lottiePlayer.setAttribute('loop', '');
                lottiePlayer.setAttribute('autoplay', '');
                lottiePlayer.className = 'w-full h-auto max-w-lg mx-auto';
                
                lottieContainer.appendChild(lottiePlayer);
                this.lottiePlayer = lottiePlayer;
            })
            .catch(error => {
                console.warn('Lottie animation not found, using fallback image:', error);
                // Show fallback image
                lottieContainer.style.display = 'none';
                fallbackImage.classList.remove('hidden');
            });
    }

    initializeScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe elements with animate-on-scroll class
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));
    }

    initializeSmoothScrolling() {
        // Handle anchor links for smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href').substring(1);
                if (!targetId) return;
                
                const targetElement = document.getElementById(targetId);
                if (!targetElement) return;
                
                // Calculate offset for fixed navbar
                const offset = this.isMobile ? 100 : 80;
                
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    initializeParallaxEffect() {
        if (this.isMobile) return;

        // Parallax elements
        const parallaxElements = document.querySelectorAll('.parallax');
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed || '0.1');
                const yPos = -scrollY * speed;
                el.style.setProperty('--parallax-y', `${yPos}px`);
            });
        }, { passive: true });
    }

    initializeLucideIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async loadServices() {
        try {
            const response = await fetch('./data/services.json');
            const services = await response.json();
            this.renderServices(services);
        } catch (error) {
            console.error('Error loading services:', error);
            this.renderServicesError();
        }
    }

    renderServices(services) {
        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = services.map(service => `
            <div class="group bg-gradient-to-r from-[#0e0918] to-[#241626] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] border border-gray-100">
                <div class="flex items-center mb-6">
                    <div class="w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mr-4">
                        <i data-lucide="${service.icon}" class="w-6 h-6 text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white">${service.title}</h3>
                </div>
                
                <p class="text-white mb-6 leading-relaxed">${service.desc}</p>
                
                <div class="space-y-3">
                    ${service.highlights.map(highlight => `
                        <div class="flex items-center">
                            <div class="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            <span class="text-sm text-white">${highlight}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-6 pt-6 border-t border-gray-100">
                    <a href="#contact" class="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300">
                        Saiba mais
                        <i data-lucide="arrow-right" class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                    </a>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons for the new content
        this.initializeLucideIcons();
    }

    renderServicesError() {
        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-600">Erro ao carregar serviços. Tente novamente mais tarde.</p>
            </div>
        `;
    }

    async loadCases() {
        try {
            const response = await fetch('./data/cases.json');
            const cases = await response.json();
            this.renderCases(cases);
        } catch (error) {
            console.error('Error loading cases:', error);
            this.renderCasesError();
        }
    }

    renderCases(cases) {
        const casesGrid = document.getElementById('cases-grid');
        if (!casesGrid) return;

        casesGrid.innerHTML = cases.map(caseItem => `
            <div class="group bg-gradient-to-r from-[#0e0918] to-[#241626] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                        ${caseItem.category}
                    </span>
                    <span class="text-sm text-white">${caseItem.duration}</span>
                </div>
                
                <h3 class="text-xl font-bold text-white mb-4">${caseItem.title}</h3>
                
                <div class="space-y-4 mb-6">
                    <div>
                        <h4 class="font-semibold text-[#fe681b] mb-2">Problema:</h4>
                        <p class="text-white text-sm">${caseItem.problem}</p>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-[#fe681b] mb-2">Solução:</h4>
                        <p class="text-white text-sm">${caseItem.solution}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-semibold text-[#fe681b] mb-3">Impacto:</h4>
                    <div class="grid grid-cols-1 gap-2">
                        ${caseItem.impact.map(impact => `
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span class="text-sm font-medium text-green-700">${impact}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-semibold text-[#fe681b] mb-3">Stack:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${caseItem.stack.map(tech => `
                            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="pt-6 border-t border-gray-100">
                    <a href="${caseItem.link}" class="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300">
                        Ver mais detalhes
                        <i data-lucide="arrow-right" class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                    </a>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons for the new content
        this.initializeLucideIcons();
    }

    renderCasesError() {
        const casesGrid = document.getElementById('cases-grid');
        if (!casesGrid) return;

        casesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-600">Erro ao carregar casos de estudo. Tente novamente mais tarde.</p>
            </div>
        `;
    }

    initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });
    }

    async handleFormSubmit(e) {
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const submitText = document.getElementById('submit-text');
        const successMessage = document.getElementById('success-message');

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            message: formData.get('message')
        };

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            this.showFormError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showFormError('Por favor, insira um e-mail válido.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitText.textContent = 'Enviando...';
        submitButton.classList.add('opacity-75');

        try {
            // Simulate API call (replace with real endpoint)
            await this.simulateFormSubmission(data);
            
            // Show success message
            successMessage.classList.remove('hidden');
            form.reset();
            
            // Re-initialize icons for success message
            this.initializeLucideIcons();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitText.textContent = 'Enviar Mensagem';
            submitButton.classList.remove('opacity-75');
        }
    }

    async simulateFormSubmission(data) {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1500);
        });
    }

    showFormError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('form-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'form-error';
            errorDiv.className = 'mt-4 p-4 bg-red-50 border border-red-200 rounded-lg';
            
            const contactForm = document.getElementById('contact-form');
            contactForm.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i data-lucide="alert-circle" class="w-5 h-5 text-red-500 mr-3"></i>
                <p class="text-red-700">${message}</p>
            </div>
        `;

        // Re-initialize icons
        this.initializeLucideIcons();

        // Hide error after 5 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.remove();
            }
        }, 5000);
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (!mobileMenu || !mobileMenuBtn) return;

        if (this.isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'translate-x-full', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'translate-x-0');
            document.body.style.overflow = 'hidden';
            
            // Update button icon
            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            if (icon) {
                icon.setAttribute('data-lucide', 'x');
                lucide.createIcons();
            }
        } else {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (!mobileMenu || !mobileMenuBtn) return;

        mobileMenu.classList.add('opacity-0', 'translate-x-full', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100', 'translate-x-0');
        document.body.style.overflow = '';
        
        // Update button icon
        const icon = mobileMenuBtn.querySelector('[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleScroll() {
        this.updateNavbarState();
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (!this.isMobile && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    updateNavbarState() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const isScrolled = window.scrollY > 10;
        
        if (isScrolled) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('bg-transparent');
            navbar.classList.add('bg-white/80', 'backdrop-blur-md', 'shadow-sm');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('bg-transparent');
            navbar.classList.remove('bg-white/80', 'backdrop-blur-md', 'shadow-sm');
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AtlasRobotApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations if needed
        console.log('Page hidden');
    } else {
        // Page is visible, resume animations if needed
        console.log('Page visible');
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtlasRobotApp;
}
