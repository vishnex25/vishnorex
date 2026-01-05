// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// =========================================
// Mobile 3D Drawer Navigation (Fixed)
// =========================================
const menuBtn = document.querySelector('.mobile-menu-btn');
const body = document.body;
const pageWrapper = document.querySelector('.page-content-wrapper'); // Verify class name in HTML
const drawerLinks = document.querySelectorAll('.drawer-menu a');

function toggleDrawer(e) {
    if (e) e.stopPropagation();
    menuBtn.classList.toggle('open'); // Animates the hamburger
    body.classList.toggle('menu-open'); // Triggers 3D transform
}

function closeDrawer() {
    menuBtn.classList.remove('open');
    body.classList.remove('menu-open');
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleDrawer);
}

// Close when clicking the "content card" (which acts as overlay when open)
if (pageWrapper) {
    pageWrapper.addEventListener('click', (e) => {
        if (body.classList.contains('menu-open')) {
            // e.preventDefault();
            // e.stopPropagation(); 
            // We want to allow clicks if menu is CLOSED, but capture if OPEN.
            // But since this listener is on the wrapper, it fires for all clicks.
            // The overlay ::after should catch it.
            closeDrawer();
        }
    });
}

// Close menu when a link is clicked
drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
});

// Remove old conflicting listeners if any (by avoiding using same var names)


// =========================================
// Accordion Functionality (Product Section)
// =========================================
// Exposed globally because it's called via onclick in HTML
window.activateAccordion = function (element) {
    // Remove active class from all items
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => item.classList.remove('active'));

    // Add active class to clicked item
    element.classList.add('active');
}

// =========================================
// Stats Counter Animation
// =========================================
const stats = document.querySelectorAll('.stat-item .number');
stats.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-target'));
    const isPercentage = stat.nextElementSibling?.innerText === '%';

    gsap.to(stat, {
        innerText: target,
        duration: 2.5,
        snap: { innerText: 1 },
        ease: "power2.out",
        scrollTrigger: {
            trigger: stat,
            start: "top 90%",
        },
        onUpdate: function () {
            stat.innerText = Math.ceil(this.targets()[0].innerText);
        }
    });
});

// =========================================
// GSAP Scroll Animations
// =========================================

// Fade Right Animation
gsap.utils.toArray('.gsap-fade-right').forEach(element => {
    gsap.from(element, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
        }
    });
});

// Scale Up Animation
gsap.utils.toArray('.gsap-scale-up').forEach((element, i) => {
    gsap.from(element, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
        }
    });
});

// Fade Up Animation
gsap.utils.toArray('.gsap-fade-up').forEach(element => {
    gsap.from(element, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
        }
    });
});

// Text Reveal Animation
gsap.utils.toArray('.gsap-text-reveal').forEach((element, i) => {
    gsap.from(element, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
        }
    });
});

// Button Reveal
gsap.utils.toArray('.gsap-btn-reveal').forEach(element => {
    gsap.from(element, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.5)",
        scrollTrigger: {
            trigger: element,
            start: "top 95%",
        }
    });
});

// Product entrance animation removed to fix visibility issues.
// Services Section Cinematic Animation
// Services Section Cinematic Animation (Responsive)
ScrollTrigger.matchMedia({
    // Desktop: Closing In Animation
    "(min-width: 1025px)": function () {
        const servicesTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#services",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        servicesTl.from(".center-image-wrapper", {
            scale: 0.8,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1.2,
            ease: "power2.out"
        })
            .from(".left-col .service-card-compact", {
                x: -100,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.2)"
            }, "-=0.8")
            .from(".right-col .service-card-compact", {
                x: 100,
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.2)"
            }, "<");
    },

    // Mobile: Vertical Stack Animation (No horizontal shifting)
    "(max-width: 1024px)": function () {
        const servicesMobileTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#services",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        // Animate Image First
        servicesMobileTl.from(".center-image-wrapper", {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out"
        })
            .from(".service-card-compact", {
                y: 50, // Move from bottom instead of sides
                autoAlpha: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.4");
    }
});


// =========================================
// Hero Product Deck (Carousel)
// =========================================
const deckContainer = document.querySelector('.product-deck');
const cards = document.querySelectorAll('.hero-card');

if (deckContainer && cards.length > 0) {
    let activeIndex = 0;
    const totalCards = cards.length;

    // Function to rotate cards
    function rotateCards() {
        cards.forEach((card, index) => {
            // Calculate the new index position relative to active
            let relativeIndex = (index - activeIndex + totalCards) % totalCards;

            // Update the CSS variable --i which controls the stack position
            card.style.setProperty('--i', relativeIndex);

            // Toggle active class for the top card
            if (relativeIndex === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // Navigate on click (Left or Right click)
    deckContainer.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % totalCards;
        rotateCards();
    });

    // Also handle right-click to prevent context menu and nav
    deckContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % totalCards;
        rotateCards();
    });

    // Initial setup
    rotateCards();
}

// =========================================
// Hero Background Animation (Glowing Beams)
// =========================================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    class Beam {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.length = Math.random() * 300 + 100;
            this.speed = Math.random() * 4 + 2;
            this.opacity = 0;
            this.fadeIn = true;
            this.life = Math.random() * 100 + 50;
            this.age = 0;
        }

        update() {
            this.x += this.speed;
            this.age++;

            // Fade in/out logic
            if (this.age < 20) {
                this.opacity = this.age / 20 * 0.5;
            } else if (this.age > this.life - 20) {
                this.opacity = (this.life - this.age) / 20 * 0.5;
            }

            // Reset if out of bounds or dead
            if (this.x > width + this.length || this.age >= this.life) {
                this.reset();
                this.x = -this.length; // Start from left again
            }
        }

        draw() {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y);
            gradient.addColorStop(0, `rgba(48, 68, 162, 0)`);
            gradient.addColorStop(0.5, `rgba(48, 68, 162, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(48, 68, 162, 0)`);

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length, this.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    // Create beam instances
    for (let i = 0; i < 20; i++) {
        particles.push(new Beam());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// =========================================
// Global Animated Grid Background (ItBoomi Style)
// =========================================
function initGridAnimation() {
    const container = document.getElementById('animated-bg');
    if (!container) return;

    // Clear any existing beams container
    const existingBeams = container.querySelector('.beams-container');
    if (existingBeams) {
        existingBeams.remove();
    }

    const beamsContainer = document.createElement('div');
    beamsContainer.className = 'beams-container';
    // Insert before the glow overlay
    const glow = container.querySelector('.bg-glow');
    if (glow) {
        container.insertBefore(beamsContainer, glow);
    } else {
        container.appendChild(beamsContainer);
    }

    const gridSize = 60; // Must match CSS background-size
    const maxRows = Math.floor(window.innerHeight / gridSize);
    const maxCols = Math.floor(window.innerWidth / gridSize);

    // Helpers to ensure unique positions
    const usedRows = new Set();
    const usedCols = new Set();

    function getUniqueRow() {
        let r;
        do { r = Math.floor(Math.random() * maxRows); } while (usedRows.has(r));
        usedRows.add(r);
        return r;
    }

    function getUniqueCol() {
        let c;
        do { c = Math.floor(Math.random() * maxCols); } while (usedCols.has(c));
        usedCols.add(c);
        return c;
    }

    function createSpecificBeam(type, direction, speed) {
        const beam = document.createElement('div');
        beam.className = `beam beam-${type}`;

        // Slower speeds (e.g. 10s - 15s)
        beam.style.animationDuration = `${speed}s`;
        beam.style.animationDirection = direction;
        beam.style.animationIterationCount = 'infinite';
        beam.style.animationTimingFunction = 'linear'; // Continuous flow

        // Position
        if (type === 'h') {
            const row = getUniqueRow();
            beam.style.top = `${row * gridSize}px`;
            beam.style.left = '0';
            beam.style.animationName = 'beam-h-anim';
        } else {
            const col = getUniqueCol();
            beam.style.left = `${col * gridSize}px`;
            beam.style.top = '0';
            beam.style.animationName = 'beam-v-anim';
        }

        return beam;
    }

    // Exactly 4 Waves
    // Speed increased (lower duration)
    // 1. Horizontal: Left -> Right
    beamsContainer.appendChild(createSpecificBeam('h', 'normal', 4));

    // 2. Horizontal: Right -> Left
    beamsContainer.appendChild(createSpecificBeam('h', 'reverse', 5));

    // 3. Vertical: Top -> Bottom
    beamsContainer.appendChild(createSpecificBeam('v', 'normal', 3.5));

    // 4. Vertical: Bottom -> Top
    beamsContainer.appendChild(createSpecificBeam('v', 'reverse', 4.5));
}

// Run on load and resize
initGridAnimation();
let resizeTimer;
// =========================================
// Homepage Reveal Animation (Hero & Nav)
// =========================================
function initHeroReveal() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Navbar drops down nicely
    tl.from(".floating-nav", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        delay: 0.2 // Start quickly
    })

        // 2. Hero Left Content (Staggered fade up)
        .from([
            ".company-name-kicker",
            ".hero-title",
            ".hero-sub",
            ".hero-actions",
            ".hero-trust"
        ], {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15
        }, "-=0.8") // Start while nav is still moving

        // 3. Hero Right Content (Deck pops in)
        .from(".product-deck-wrapper", {
            x: 50,
            opacity: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
        }, "-=1.0"); // Simultaneous
}

// Ensure it runs after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroReveal);
} else {
    initHeroReveal();
}

// =========================================
// Contact Form Handling (AJAX)
// =========================================
const contactForm = document.querySelector('.spec-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        const originalBtnText = button.innerHTML;

        // Visual Loading State
        button.innerHTML = '<span>Initializing...</span>';
        button.disabled = true;
        button.style.opacity = '0.7';

        // Get Form Data
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success State: Replace Form with Success Message
                const successHTML = `
                    <div class="success-message" style="grid-column: span 2; text-align: center; padding: 20px; animation: fadeIn 0.5s ease; width: 100%;">
                        <div style="font-size: 3rem; margin-bottom: 16px;">🚀</div>
                        <h3 style="font-size: 1.5rem; color: var(--text-main); margin-bottom: 8px;">Project Initialized</h3>
                        <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto;">Your specification has been received. Our architects will review it and contact you shortly.</p>
                        <button onclick="window.location.reload()" class="btn-primary" style="margin-top: 24px;">Start Another</button>
                    </div>
                `;
                form.innerHTML = successHTML;
            } else {
                // Error State
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }

                // Reset Button
                button.innerHTML = originalBtnText;
                button.disabled = false;
                button.style.opacity = '1';
            }
        } catch (error) {
            // Network Error
            alert("Oops! There was a problem submitting your form");
            button.innerHTML = originalBtnText;
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
}
