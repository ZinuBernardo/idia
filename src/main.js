import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// --------------------------------------------------------------------------
// Cinematic Film Grain (Canvas)
// --------------------------------------------------------------------------
const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');

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

// --------------------------------------------------------------------------
// Lenis Smooth Scroll
// --------------------------------------------------------------------------
const lenis = new Lenis({
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

// Get scroll value
// lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
//     console.log({ scroll, limit, velocity, direction, progress });
// });

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --------------------------------------------------------------------------
// Split Text Utility
// --------------------------------------------------------------------------
function splitText(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        const words = text.split(' ');
        el.innerHTML = '';
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('split-word');
            const innerSpan = document.createElement('span');
            innerSpan.innerHTML = word + '&nbsp;';
            wordSpan.appendChild(innerSpan);
            el.appendChild(wordSpan);
        });
    });
}

// Apply split to main titles
splitText('.massive-title');
// We don't apply it to .hero-title anymore because we need custom line breaks and colors

// --------------------------------------------------------------------------
// Navbar & Mobile Menu Logic
// --------------------------------------------------------------------------
const navbar = document.querySelector('.main-nav');
let lastScroll = 0;

lenis.on('scroll', ({ scroll }) => {
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
    // Subpages: animate entry elements immediately (to match their initial opacity: 0 and translateY(100%) in CSS)
    gsap.to('.massive-title .split-word span', {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.3
    });
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
ScrollTrigger.create({
    trigger: ".dark-to-light",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "var(--bg-night)", duration: 1 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "var(--bg-dark)", duration: 1 })
});

// Chapter Header Reveal
gsap.from(".chapter-header", {
    scrollTrigger: {
        trigger: ".chapter-section",
        start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Chapter Cards Stagger
gsap.from(".chapter-card", {
    scrollTrigger: {
        trigger: ".chapters-container",
        start: "top 80%",
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "expo.out"
});

// --------------------------------------------------------------------------
// Animations (Humano Concreto)
// --------------------------------------------------------------------------

// Cinematic Parallax
gsap.to('.parallax-cinematic', {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
        trigger: ".cinematic-section",
        start: "top bottom", 
        end: "bottom top",
        scrub: true
    }
});

// Cinematic Text Reveal (Split Text)
gsap.from(".massive-title .split-word span", {
    scrollTrigger: {
        trigger: ".cinematic-section",
        start: "top 60%",
    },
    yPercent: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.1,
    ease: "power4.out"
});

gsap.from(".kicker, .cinematic-desc, .cinematic-content .btn", {
    scrollTrigger: {
        trigger: ".cinematic-section",
        start: "top 60%",
    },
    y: 60,
    opacity: 0,
    duration: 1.5,
    stagger: 0.3,
    ease: "power4.out"
});

// --------------------------------------------------------------------------
// Animations (Sistema Global - Pirâmide)
// --------------------------------------------------------------------------

// Draw SVG Lines
gsap.to(".pyramid-path", {
    scrollTrigger: {
        trigger: ".pyramid-section",
        start: "top 50%",
        end: "bottom 80%",
        scrub: 1 // smooth scrubbing
    },
    strokeDashoffset: 0,
    ease: "none"
});

// Reveal Pyramid Levels
gsap.from(".pyramid-level", {
    scrollTrigger: {
        trigger: ".pyramid-section",
        start: "top 40%",
    },
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    stagger: 0.3,
    ease: "back.out(1.7)"
});

// --------------------------------------------------------------------------
// Animations (Núcleo Estratégico - Stats)
// --------------------------------------------------------------------------

// Stats Parallax
gsap.to('.parallax-stats', {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
        trigger: ".stats-section",
        start: "top bottom", 
        end: "bottom top",
        scrub: true
    }
});

// Number Counter Animation
const statsGridEl = document.querySelector('.stats-grid');
if (statsGridEl) {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (!isNaN(target)) {
            ScrollTrigger.create({
                trigger: ".stats-grid",
                start: "top 85%",
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2.5,
                        ease: "power2.out",
                        snap: { innerHTML: 0.1 },
                        onUpdate: function() {
                            if(Number.isInteger(target)) {
                                counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                            } else {
                                counter.innerHTML = parseFloat(this.targets()[0].innerHTML).toFixed(1);
                            }
                        }
                    });
                },
                once: true
            });
        }
    });

    // Reveal Stats Boxes
    gsap.from(".stat-counter-box", {
        scrollTrigger: {
            trigger: ".stats-grid",
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
    gsap.from(".footer-top, .footer-grid > div", {
        scrollTrigger: {
            trigger: ".footer-section",
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
