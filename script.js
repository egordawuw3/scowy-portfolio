document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileMenu();
    initWorksTabs();
    initVideoPlayers();
    initScrollAnimations();
    initSmoothScroll();
    initCountUp();
    initAccordion();
});

function initAccordion() {
    const items = document.querySelectorAll('.accordion__item');
    if (!items.length) return;

    items.forEach(item => {
        const trigger = item.querySelector('.accordion__trigger');
        const panel = item.querySelector('.accordion__panel');
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            items.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.accordion__panel').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
}

function initCountUp() {
    const els = document.querySelectorAll('.case__stat-value');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const match = raw.match(/^(\d+(?:[.,]\d+)?)(\D*)$/);
            if (!match) return;

            const target = parseFloat(match[1].replace(',', '.'));
            const suffix = match[2];
            const isInt = !match[1].includes('.') && !match[1].includes(',');
            const duration = 1100;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;
                el.textContent = (isInt ? Math.round(value) : value.toFixed(1)) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = raw;
            }
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.6 });

    els.forEach(el => observer.observe(el));
}

function initWorksTabs() {
    const tabs = document.querySelectorAll('.works__tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            tab.classList.add('active');

            // Hide all grids
            document.querySelectorAll('.works__grid').forEach(grid => {
                grid.style.display = 'none';
                grid.classList.remove('active');
            });

            // Pause all videos when switching tabs
            document.querySelectorAll('.works__video-wrap video').forEach(v => {
                v.pause();
                v.muted = true;
                const overlay = v.closest('.works__video-wrap').querySelector('.works__play-overlay');
                if (overlay) overlay.classList.remove('hidden');
            });

            // Show target grid
            const targetId = tab.getAttribute('data-target');
            const targetGrid = document.getElementById(`${targetId}-works`);
            if (targetGrid) {
                targetGrid.style.display = 'grid';
                // Trigger reflow for animation if needed
                void targetGrid.offsetWidth;
                targetGrid.classList.add('active');
            }
        });
    });
}

function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    }, { passive: true });
}

function initMobileMenu() {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('mobile-menu');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function loadVideoSrc(video) {
    if (video.dataset.src) {
        video.src = video.dataset.src;
        delete video.dataset.src;
    }
}

function initVideoPlayers() {
    const wraps = document.querySelectorAll('.works__video-wrap');

    wraps.forEach(wrap => {
        const video = wrap.querySelector('video');
        const overlay = wrap.querySelector('.works__play-overlay');
        if (!video || !overlay) return;

        // Click to load, play with sound, and focus this video; click again to stop
        wrap.addEventListener('click', () => {
            loadVideoSrc(video);
            if (video.muted) {
                // Focus this video with sound, stop any other currently-playing video
                wraps.forEach(w => {
                    const v = w.querySelector('video');
                    if (v && v !== video && !v.paused) {
                        v.pause();
                        v.muted = true;
                        w.querySelector('.works__play-overlay').classList.remove('hidden');
                    }
                });
                video.currentTime = 0;
                video.muted = false;
                video.play();
                overlay.classList.add('hidden');
            } else {
                video.pause();
                video.muted = true;
                overlay.classList.remove('hidden');
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = document.getElementById('nav').offsetHeight + 20;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
            }
        });
    });
}
