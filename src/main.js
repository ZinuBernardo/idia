import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import videoUrl from '../vidbanner.mp4';
import logoUrl from '../ideiaa.png';

// --------------------------------------------------------------------------
// Lançamento ID&IA - Contagem Regressiva WAT (Angola: UTC+1)
// --------------------------------------------------------------------------
const TARGET_TIME = Date.UTC(2026, 4, 25, 21, 1, 0); // Ajustado para terminar às 21:01, exibindo a diferença correta a partir das 13:27 do computador
let isCountdownActive = false;
let countdownInterval = null;
let lenis;

function formatNumber(num) {
    return num.toString().padStart(2, '0');
}

function initCountdown() {
    // 1. Permitir bypass do countdown apenas através de parâmetros na URL (?bypass=true ou ?preview=true)
    const urlParams = new URLSearchParams(window.location.search);
    const hasBypass = urlParams.get('bypass') === 'true' || urlParams.get('preview') === 'true';
    if (hasBypass) {
        return;
    }

    // 2. O countdown deve aparecer apenas na página inicial (raiz '/' ou '/index.html')
    const path = window.location.pathname;
    const isHomepage = path === '/' || path === '/index.html' || path.endsWith('/') || path.endsWith('/index.html');
    if (!isHomepage) {
        return;
    }

    const now = Date.now();
    const diff = TARGET_TIME - now;

    if (diff > 0) {
        isCountdownActive = true;
        
        // Injetar HTML do Countdown em tela cheia no body
        const overlay = document.createElement('div');
        overlay.id = 'countdown-overlay';
        overlay.innerHTML = `
            <div class="countdown-bg">
                <video src="${videoUrl}" autoplay loop muted playsinline class="countdown-video"></video>
                <div class="countdown-video-overlay"></div>
            </div>
            <div class="countdown-content">
                <img src="${logoUrl}" alt="ID&IA Logo" class="countdown-logo">
                <h2 class="countdown-title">VAMOS NO AR EM:</h2>
                <div class="countdown-timer">
                    <div class="timer-box">
                        <span class="timer-num" id="countdown-hours">00</span>
                        <span class="timer-label">HORAS</span>
                    </div>
                    <span class="timer-separator">:</span>
                    <div class="timer-box">
                        <span class="timer-num" id="countdown-minutes">00</span>
                        <span class="timer-label">MINUTOS</span>
                    </div>
                    <span class="timer-separator">:</span>
                    <div class="timer-box">
                        <span class="timer-num" id="countdown-seconds">00</span>
                        <span class="timer-label">SEGUNDOS</span>
                    </div>
                </div>
                <p class="countdown-footer">WAT (West Africa Time) – Angola</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // text/counter elements exist now in DOM, update timer display
        updateTimerDisplay(diff);

        // Iniciar intervalo de contagem regressiva
        countdownInterval = setInterval(() => {
            const currentNow = Date.now();
            const currentDiff = TARGET_TIME - currentNow;

            if (currentDiff <= 0) {
                clearInterval(countdownInterval);
                revealSite();
            } else {
                updateTimerDisplay(currentDiff);
            }
        }, 1000);
    }
}

function updateTimerDisplay(diff) {
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours;

    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (hoursEl) hoursEl.textContent = formatNumber(hours);
    if (minutesEl) minutesEl.textContent = formatNumber(minutes);
    if (secondsEl) secondsEl.textContent = formatNumber(seconds);
}

function revealSite() {
    isCountdownActive = false;
    
    // Ocultar preloader se ainda estiver exibido
    const loader = document.getElementById('loader');
    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => loader.remove()
        });
    }

    // Transição suave para revelar o site principal
    gsap.to('#countdown-overlay', {
        opacity: 0,
        scale: 1.05,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
            const overlay = document.getElementById('countdown-overlay');
            if (overlay) overlay.remove();
            
            // Ativa a rolagem do Lenis novamente
            if (lenis) {
                lenis.start();
            }
        }
    });
}

function initApp() {
    // Inicializar a verificação do countdown
    initCountdown();

    // --------------------------------------------------------------------------
    // Custom Cursor
    // --------------------------------------------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        if(cursor) {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        }
    });

    // Hover effects for links/buttons
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    if (interactiveElements && interactiveElements.length > 0) {
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if (cursor) cursor.classList.remove('hover');
            });
        });
    }

    // --------------------------------------------------------------------------
    // Cinematic Film Grain (Canvas)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('noise-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            let wWidth, wHeight;

            const resizeCanvas = () => {
                wWidth = window.innerWidth;
                wHeight = window.innerHeight;
                canvas.width = wWidth;
                canvas.height = wHeight;
            };

            const noise = () => {
                const w = ctx.canvas.width,
                      h = ctx.canvas.height,
                      idata = ctx.createImageData(w, h),
                      buffer32 = new Uint32Array(idata.data.buffer),
                      len = buffer32.length;

                for (let i = 0; i < len; i++) {
                    if (Math.random() < 0.5) {
                        buffer32[i] = 0xff000000;
                    }
                }

                ctx.putImageData(idata, 0, 0);
            };

            let toggle = true;
            const loopNoise = () => {
                toggle = !toggle;
                if (toggle) {
                    requestAnimationFrame(loopNoise);
                    return;
                }
                noise();
                requestAnimationFrame(loopNoise);
            };

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            loopNoise();
        }
    }

    // --------------------------------------------------------------------------
    // Lenis Smooth Scroll
    // --------------------------------------------------------------------------
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    if (isCountdownActive) {
        lenis.stop();
    }

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // --------------------------------------------------------------------------
    // Navbar & Mobile Menu Logic
    // --------------------------------------------------------------------------
    const navbar = document.querySelector('.main-nav');
    let lastScroll = 0;

    lenis.on('scroll', ({ scroll }) => {
        if (navbar) {
            if (scroll > 50) {
                navbar.classList.add('nav-solid');
            } else {
                navbar.classList.remove('nav-solid');
            }

            if (scroll > lastScroll && scroll > 200) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        }
        lastScroll = scroll;
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            if(mobileMenu.classList.contains('active')) {
                gsap.fromTo('.mobile-links li', 
                    { y: 50, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3 }
                );
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --------------------------------------------------------------------------
    // Animations (Loader & Hero)
    // --------------------------------------------------------------------------

    // Loader Timeline (Cinematic Exit) - only on pages with loader
    const loaderEl = document.getElementById('loader');

    if (loaderEl) {
        const tlLoader = gsap.timeline();

        tlLoader.to('.loader-logo', {
            opacity: 1,
            scale: 1.1,
            duration: 1.5,
            ease: "power2.out"
        })
        .to('.loader-logo', {
            opacity: 0,
            scale: 1.5,
            duration: 1,
            delay: 0.5,
            ease: "power2.in"
        })
        .to('#loader', {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 1.2,
            ease: "expo.inOut"
        }, "-=0.5")
        .from('.hero-title .line', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.8")
        .from('.hero-subtitle, .hero-desc, .hero-actions, .nav-brand, .nav-links', {
            y: 20,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=1")
        .from('.hero-bottom-stats', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8");
    } else {
        // Subpages: animate entry elements immediately
        gsap.from('.kicker, .cinematic-desc', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.6
        });
        gsap.from('.nav-brand, .nav-links', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2
        });
    }

    // Parallax Hero Image
    const heroSec = document.querySelector('.hero') || document.querySelector('.movie-hero');
    if (heroSec) {
        gsap.to('.parallax-bg', {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: heroSec,
                start: "top top", 
                end: "bottom top",
                scrub: true
            }
        });
    }

    // --------------------------------------------------------------------------
    // Animations (Chapter Section - A Origem)
    // --------------------------------------------------------------------------

    // Background Color Transition
    const darkToLightEl = document.querySelector(".dark-to-light");
    if (darkToLightEl) {
        ScrollTrigger.create({
            trigger: darkToLightEl,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => gsap.to("body", { backgroundColor: "var(--bg-night)", duration: 1 }),
            onLeaveBack: () => gsap.to("body", { backgroundColor: "var(--bg-dark)", duration: 1 })
        });
    }

    // Chapter Header Reveal
    const chapterSectionEl = document.querySelector(".chapter-section");
    if (chapterSectionEl && document.querySelector(".chapter-header")) {
        gsap.from(".chapter-header", {
            scrollTrigger: {
                trigger: chapterSectionEl,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    }

    // Chapter Cards Stagger
    const chaptersContainerEl = document.querySelector(".chapters-container");
    if (chaptersContainerEl && document.querySelector(".chapter-card")) {
        gsap.from(".chapter-card", {
            scrollTrigger: {
                trigger: chaptersContainerEl,
                start: "top 80%",
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "expo.out"
        });
    }

    // --------------------------------------------------------------------------
    // Animations (Humano Concreto)
    // --------------------------------------------------------------------------

    // Cinematic Parallax & Text Reveal (Only runs if .cinematic-section trigger exists)
    const cinematicSectionEl = document.querySelector(".cinematic-section");
    if (cinematicSectionEl) {
        if (document.querySelector('.parallax-cinematic')) {
            gsap.to('.parallax-cinematic', {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: cinematicSectionEl,
                    start: "top bottom", 
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Limit kickers and descs inside cinematic-section so it doesn't hide subpages text
        gsap.from(".cinematic-section .kicker, .cinematic-section .cinematic-desc, .cinematic-section .cinematic-content .btn", {
            scrollTrigger: {
                trigger: cinematicSectionEl,
                start: "top 60%",
            },
            y: 60,
            opacity: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "power4.out"
        });
    }

    // --------------------------------------------------------------------------
    // Animations (Sistema Global - Pirâmide)
    // --------------------------------------------------------------------------

    const pyramidSectionEl = document.querySelector(".pyramid-section");
    if (pyramidSectionEl) {
        // Draw SVG Lines
        if (document.querySelector(".pyramid-path")) {
            gsap.to(".pyramid-path", {
                scrollTrigger: {
                    trigger: pyramidSectionEl,
                    start: "top 50%",
                    end: "bottom 80%",
                    scrub: 1
                },
                strokeDashoffset: 0,
                ease: "none"
            });
        }

        // Reveal Pyramid Levels
        if (document.querySelector(".pyramid-level")) {
            gsap.from(".pyramid-level", {
                scrollTrigger: {
                    trigger: pyramidSectionEl,
                    start: "top 40%",
                },
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                stagger: 0.3,
                ease: "back.out(1.7)"
            });
        }
    }

    // --------------------------------------------------------------------------
    // Animations (Núcleo Estratégico - Stats)
    // --------------------------------------------------------------------------

    const statsSectionEl = document.querySelector(".stats-section");
    if (statsSectionEl) {
        if (document.querySelector('.parallax-stats')) {
            gsap.to('.parallax-stats', {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: statsSectionEl,
                    start: "top bottom", 
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // Contadores Animados (.counter com data-target)
    // --------------------------------------------------------------------------
    function animateCounter(counter) {
        if (counter.dataset.animated === 'true') return; // Evitar duplicação
        counter.dataset.animated = 'true';
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
                if (Number.isInteger(target)) {
                    counter.innerHTML = Math.round(obj.val);
                } else {
                    counter.innerHTML = obj.val.toFixed(1);
                }
            }
        });
    }

    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            if (!isNaN(target)) {
                ScrollTrigger.create({
                    trigger: counter,
                    start: "top 95%",
                    onEnter: () => animateCounter(counter),
                    once: true
                });
            }
        });

        // Fallback: garantir que contadores já visíveis no viewport sejam animados
        // (ex: se a página é curta ou o utilizador recarrega com scroll no meio)
        setTimeout(() => {
            counters.forEach(counter => {
                if (counter.dataset.animated !== 'true') {
                    const rect = counter.getBoundingClientRect();
                    if (rect.top < window.innerHeight) {
                        animateCounter(counter);
                    }
                }
            });
        }, 1500);
    }

    // Reveal Stats Boxes (safely checking if parent and boxes exist)
    const statsGridEl = document.querySelector('.stats-grid');
    if (statsGridEl && document.querySelector(".stat-counter-box")) {
        gsap.from(".stat-counter-box", {
            scrollTrigger: {
                trigger: statsGridEl,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });
    }

    // --------------------------------------------------------------------------
    // Animations (Footer)
    // --------------------------------------------------------------------------
    const footerSec = document.querySelector('.footer-section');
    if (footerSec) {
        gsap.from(".footer-section .footer-top, .footer-section .footer-grid > div", {
            scrollTrigger: {
                trigger: footerSec,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

    // Refresh ScrollTrigger on load to ensure correct layouts
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}

// Iniciar a aplicação após o carregamento seguro do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
