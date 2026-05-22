/* ==========================================================================
   Zenith Salud - Premium Interactive Portal Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Sticky Header Effect
       ========================================== */
    const header = document.getElementById('header');
    
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('header-active');
        } else {
            header.classList.remove('header-active');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader();


    /* ==========================================
       2. Mobile Navigation Menu
       ========================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            navToggle.innerHTML = isOpen 
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            });
        });
    }


    /* ==========================================
       3. Interactive Mockup Tabs
       ========================================== */
    const tabButtons = document.querySelectorAll('.mockup-tab-btn');
    const demoPanels = document.querySelectorAll('.demo-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            demoPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });


    /* ==========================================
       4. Cotizador en Vivo (Pestaña 1)
       ========================================== */
    const selectGrupo = document.getElementById('cotiz-grupo');
    const selectEdad = document.getElementById('cotiz-edad');
    
    // Result elements
    const valBronze = document.getElementById('val-bronze');
    const valSilver = document.getElementById('val-silver');
    const valGold = document.getElementById('val-gold');

    // Base prices (Individual, 18-30)
    const basePrices = {
        bronze: 9500,
        silver: 18500,
        gold: 29000
    };

    const animateNumberCount = (element, start, end, duration) => {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            element.innerText = `$${currentVal.toLocaleString('es-AR')}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const recalculateQuotes = () => {
        if (!selectGrupo || !selectEdad) return;

        const grupo = selectGrupo.value;
        const edad = selectEdad.value;

        // Group multipliers
        let multGrupo = 1.0;
        if (grupo === 'pareja') multGrupo = 1.9; // 5% discount
        else if (grupo === 'familiar') multGrupo = 2.6; // 15% discount for families

        // Age multipliers
        let multEdad = 1.0;
        if (edad === 'adulto') multEdad = 1.25;
        else if (edad === 'mayor') multEdad = 1.55;

        // Calculate and animate
        const calculateNewPrice = (base) => Math.floor(base * multGrupo * multEdad);

        const currentBronze = parseInt(valBronze.innerText.replace('$', '').replace('.', ''), 10) || basePrices.bronze;
        const currentSilver = parseInt(valSilver.innerText.replace('$', '').replace('.', ''), 10) || basePrices.silver;
        const currentGold = parseInt(valGold.innerText.replace('$', '').replace('.', ''), 10) || basePrices.gold;

        const targetBronze = calculateNewPrice(basePrices.bronze);
        const targetSilver = calculateNewPrice(basePrices.silver);
        const targetGold = calculateNewPrice(basePrices.gold);

        animateNumberCount(valBronze, currentBronze, targetBronze, 350);
        animateNumberCount(valSilver, currentSilver, targetSilver, 350);
        animateNumberCount(valGold, currentGold, targetGold, 350);
    };

    if (selectGrupo && selectEdad) {
        selectGrupo.addEventListener('change', recalculateQuotes);
        selectEdad.addEventListener('change', recalculateQuotes);
        recalculateQuotes(); // Run initially
    }


    /* ==========================================
       5. Buscador de Cartilla Cerrillos (Pestaña 2)
       ========================================== */
    const selectSpec = document.getElementById('cartilla-spec');
    const doctorList = document.getElementById('doctor-results-list');

    // Doctor Database using group member names as Easter eggs
    const doctorsDb = {
        pediatria: [
            { name: "Dra. Sara Dominguez", specialty: "Pediatría General", address: "Centro Médico Cerrillos, San Martín 450", badge: "Atención Lunes a Viernes" }
        ],
        clinica: [
            { name: "Dr. Guillermo Dulce", specialty: "Clínica Médica / Familiar", address: "Centro Integral Cerrillos, San Martín 450", badge: "Turnos Mañana/Tarde" }
        ],
        odontologia: [
            { name: "Dra. Bianca Rocco", specialty: "Odontología Preventiva y Niños", address: "Consultorio Cerrillos Centro, Belgrano 210", badge: "Guardia Sábados" }
        ],
        ginecologia: [
            { name: "Dra. Maria Daniela Marin", specialty: "Obstetricia y Ginecología", address: "Clínica de la Mujer Cerrillos, Güemes 120", badge: "Eco Doppler local" }
        ],
        kinesiologia: [
            { name: "Dra. Lucía Tesselhoff", specialty: "Fisioterapia y Rehabilitación", address: "Gimnasio & Salud Cerrillos, Urquiza 75", badge: "Kine en Cerrillos Centro" }
        ]
    };

    const updateDoctorCartilla = () => {
        if (!selectSpec || !doctorList) return;
        
        const spec = selectSpec.value;
        const docs = doctorsDb[spec] || [];

        doctorList.innerHTML = "";

        docs.forEach(doc => {
            const docLi = document.createElement('li');
            docLi.className = "doctor-card";
            docLi.innerHTML = `
                <div class="doc-info">
                    <span class="doc-name">${doc.name}</span>
                    <span class="doc-specialty">${doc.specialty}</span>
                    <span class="doc-address">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        ${doc.address}
                    </span>
                </div>
                <span class="doc-badge">${doc.badge}</span>
            `;
            doctorList.appendChild(docLi);
        });
    };

    if (selectSpec) {
        selectSpec.addEventListener('change', updateDoctorCartilla);
        updateDoctorCartilla(); // Initial run
    }


    /* ==========================================
       6. Simulador de Alta Digital (Pestaña 3)
       ========================================== */
    const btnNext = document.getElementById('chk-next-btn');
    const btnPrev = document.getElementById('chk-prev-btn');
    
    // Inputs & Steps
    const stepsContent = [
        document.getElementById('checkout-step-1'),
        document.getElementById('checkout-step-2'),
        document.getElementById('checkout-step-3')
    ];
    
    const stepsLabels = [
        document.getElementById('chk-step-1-lbl'),
        document.getElementById('chk-step-2-lbl'),
        document.getElementById('chk-step-3-lbl')
    ];

    let currentCheckoutStep = 0;

    const updateCheckoutUI = () => {
        // Toggle steps content visibility
        stepsContent.forEach((step, idx) => {
            if (idx === currentCheckoutStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Toggle labels active state
        stepsLabels.forEach((label, idx) => {
            if (idx <= currentCheckoutStep) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });

        // Toggle back button visibility
        if (currentCheckoutStep === 0) {
            btnPrev.style.display = 'none';
        } else {
            btnPrev.style.display = 'inline-flex';
        }

        // Toggle next button text
        if (currentCheckoutStep === stepsContent.length - 1) {
            btnNext.innerHTML = 'Finalizar Alta ✔';
            btnNext.style.background = 'var(--color-accent)';
        } else {
            btnNext.innerHTML = 'Continuar &rarr;';
            btnNext.style.background = 'linear-gradient(135deg, var(--color-accent), #059669)';
        }
    };

    if (btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            if (currentCheckoutStep === 0) {
                const nameInp = document.getElementById('chk-input-name');
                if (nameInp && nameInp.value.trim() === '') {
                    nameInp.style.borderColor = 'var(--danger)';
                    return;
                } else {
                    nameInp.style.borderColor = 'var(--border-medium)';
                }
                currentCheckoutStep++;
                updateCheckoutUI();
            } else if (currentCheckoutStep === 1) {
                const ddjjCheckbox = document.getElementById('chk-input-ddjj');
                if (ddjjCheckbox && !ddjjCheckbox.checked) {
                    alert('Debes firmar y aceptar la Declaración Jurada para continuar.');
                    return;
                }
                currentCheckoutStep++;
                updateCheckoutUI();
            } else if (currentCheckoutStep === 2) {
                // Success trigger
                btnNext.style.pointerEvents = 'none';
                btnNext.innerText = 'Creando cuenta...';
                
                setTimeout(() => {
                    alert('¡Suscripción Médica Creada!\nTu credencial digital y cupón de pago han sido enviados por WhatsApp. ¡Bienvenido a Zenith Salud!');
                    
                    // Reset simulator
                    currentCheckoutStep = 0;
                    const nameInp = document.getElementById('chk-input-name');
                    if (nameInp) nameInp.value = "Facundo Dominguez";
                    const ddjjCheckbox = document.getElementById('chk-input-ddjj');
                    if (ddjjCheckbox) ddjjCheckbox.checked = true;

                    btnNext.style.pointerEvents = 'auto';
                    updateCheckoutUI();
                }, 1000);
            }
        });

        btnPrev.addEventListener('click', () => {
            if (currentCheckoutStep > 0) {
                currentCheckoutStep--;
                updateCheckoutUI();
            }
        });
    }


    /* ==========================================
       7. Pricing Switcher Toggle (Mensual vs Anual)
       ========================================== */
    const pricingSwitcher = document.getElementById('pricing-switcher');
    const labelMonthly = document.getElementById('label-monthly');
    const labelAnnual = document.getElementById('label-annual');
    
    // Main pricing elements
    const priceBronze = document.getElementById('price-free');
    const priceSilver = document.getElementById('price-pro');
    const priceGold = document.getElementById('price-enterprise');

    const mainPrices = {
        bronze: 9500,
        silver: 18500,
        gold: 29000
    };

    if (pricingSwitcher) {
        pricingSwitcher.addEventListener('click', () => {
            const isAnnual = pricingSwitcher.classList.toggle('active');
            pricingSwitcher.setAttribute('aria-checked', isAnnual ? 'true' : 'false');

            if (isAnnual) {
                labelMonthly.classList.remove('active');
                labelAnnual.classList.add('active');
                
                // Animate to 20% discount prices
                // Bronze: $9500 -> $7600
                // Silver: $18500 -> $14800
                // Gold: $29000 -> $23200
                animateNumberCount(priceBronze, mainPrices.bronze, 7600, 300);
                animateNumberCount(priceSilver, mainPrices.silver, 14800, 300);
                animateNumberCount(priceGold, mainPrices.gold, 23200, 300);
            } else {
                labelMonthly.classList.add('active');
                labelAnnual.classList.remove('active');
                
                // Animate back to original monthly prices
                animateNumberCount(priceBronze, 7600, mainPrices.bronze, 300);
                animateNumberCount(priceSilver, 14800, mainPrices.silver, 300);
                animateNumberCount(priceGold, 23200, mainPrices.gold, 300);
            }
        });
    }


    /* ==========================================
       8. Testimonials Carousel Layout
       ========================================== */
    const track = document.getElementById('testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');
    const dotsContainer = document.getElementById('carousel-dots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    const updateCarousel = (index) => {
        if (!track) return;
        
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    if (track && totalSlides > 0) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-slide'), 10);
                updateCarousel(targetIndex);
            });
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentSlide + 1) % totalSlides;
            updateCarousel(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel(prevIndex);
        });
        
        // Auto scroll testimonials every 8 seconds
        let carouselInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % totalSlides;
            updateCarousel(nextIndex);
        }, 8000);

        const stopAutoScroll = () => {
            clearInterval(carouselInterval);
        };
        
        nextBtn.addEventListener('click', stopAutoScroll);
        prevBtn.addEventListener('click', stopAutoScroll);
        dots.forEach(dot => dot.addEventListener('click', stopAutoScroll));
    }


    /* ==========================================
       9. Intersection Observer for Active Nav Links
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navItems = {
        'hero': document.getElementById('nav-home'),
        'features': document.getElementById('nav-features'),
        'analytics': document.getElementById('nav-analytics'),
        'pricing': document.getElementById('nav-pricing'),
        'contact': document.getElementById('nav-contact')
    };

    const sectionObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                Object.values(navItems).forEach(item => {
                    if (item) item.classList.remove('active');
                });

                if (navItems[id]) {
                    navItems[id].classList.add('active');
                }
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));


    /* ==========================================
       10. Intersection Observer for Scroll Reveal
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));


    /* ==========================================
       11. Contact Form & Client Validation
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const successBanner = document.getElementById('contact-success-banner');
    
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    
    const errName = document.getElementById('error-name');
    const errEmail = document.getElementById('error-email');
    const errMessage = document.getElementById('error-message');

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validateField = (input, errorElement, validationFn) => {
        const val = input.value.trim();
        let isValid = true;

        if (validationFn) {
            isValid = validationFn(val);
        } else {
            isValid = val.length > 0;
        }

        if (!isValid) {
            input.classList.add('invalid');
            errorElement.style.display = 'block';
        } else {
            input.classList.remove('invalid');
            errorElement.style.display = 'none';
        }

        return isValid;
    };

    if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, errName));
    if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, errEmail, validateEmail));
    if (messageInput) messageInput.addEventListener('blur', () => validateField(messageInput, errMessage));

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateField(nameInput, errName);
            const isEmailValid = validateField(emailInput, errEmail, validateEmail);
            const isMessageValid = validateField(messageInput, errMessage);

            if (isNameValid && isEmailValid && isMessageValid) {
                const submitBtn = document.getElementById('contact-submit-btn');
                submitBtn.style.pointerEvents = 'none';
                submitBtn.innerText = 'Enviando...';
                
                setTimeout(() => {
                    successBanner.style.display = 'flex';
                    contactForm.reset();
                    
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.innerHTML = `Enviar Solicitud <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
                    
                    successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    setTimeout(() => {
                        successBanner.style.display = 'none';
                    }, 6000);

                }, 1200);
            }
        });
    }

});
