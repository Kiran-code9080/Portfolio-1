document.addEventListener("DOMContentLoaded", () => {
    // --- Preloader Logic ---
    const preloader = document.getElementById("preloader");
    window.addEventListener("load", () => preloader?.classList.add("hidden"));

    // --- Initialize AOS ---
    AOS.init({ duration: 1000, once: true, offset: 120 });

    // --- Element Selections ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const header = document.querySelector(".header");
    const backToTopBtn = document.querySelector(".back-to-top");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle?.querySelector("i");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    // --- Mobile Menu Toggle ---
    hamburger?.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    navMenu?.addEventListener("click", e => {
        if (e.target.classList.contains("nav-link")) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });

    // --- Scroll Events (Header & Back-to-Top Button) ---
    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;
        header?.classList.toggle("scrolled", scrollY > 50);
        backToTopBtn?.classList.toggle("visible", scrollY > 300);
    });

    // --- Dark/Light Mode Logic ---
    const applyTheme = theme => {
        if (!themeIcon) return;
        document.body.classList.toggle("light-mode", theme === "light");
        themeIcon.classList.replace(theme === "light" ? "fa-moon" : "fa-sun", theme === "light" ? "fa-sun" : "fa-moon");
        localStorage.setItem("theme", theme);
    };
    applyTheme(localStorage.getItem("theme") || "dark");

    themeToggle?.addEventListener("click", () => {
        applyTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
    });

    // --- Typing Effect ---
    if (document.querySelector(".typing-effect")) {
        new Typed(".typing-effect", { strings: ["Full Stack Developer"], typeSpeed: 70, backSpeed: 80, loop: true });
    }

    // --- Skills Filter Logic ---
    const setupFilter = (btnSelector, cardSelector) => {
        const buttons = document.querySelectorAll(btnSelector);
        const cards = document.querySelectorAll(cardSelector);
        buttons.forEach(btn => btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                card.style.display = filter === "all" || card.dataset.category === filter ? "block" : "none";
            });
        }));
    };
    setupFilter(".skills-section .filter-btn", ".skill-card");

    // --- Timeline Intersection Observer ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll(".timeline").forEach(el => observer.observe(el));

    // --- Project Modal Logic ---
    const modal = document.getElementById("project-modal");
    const closeModalBtn = modal?.querySelector(".close-btn");

    const openModal = card => {
        if (!modal) return;
        modal.querySelector("#modal-img").src = card.querySelector("img")?.src || "";
        modal.querySelector("#modal-title").innerText = card.querySelector("h3")?.innerText || "";
        modal.querySelector("#modal-desc").innerText = card.querySelector("p")?.innerText || "";
        modal.querySelector("#modal-tags").innerHTML = card.querySelector(".project-tags")?.innerHTML || "";
        modal.querySelector("#modal-links").innerHTML = card.querySelector(".project-links")?.innerHTML || "";
        modal.style.display = "block";
    };

    document.querySelectorAll(".project-card").forEach(card => card.addEventListener("click", () => openModal(card)));
    closeModalBtn?.addEventListener("click", () => { if (modal) modal.style.display = "none"; });
    window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

    // --- Active Navigation Link Highlight using IntersectionObserver ---
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const navLink = document.querySelector(`.nav-menu a[href*=${entry.target.id}]`);
            if (navLink) navLink.classList.toggle("active", entry.isIntersecting);
        });
    }, { threshold: 0.6 });
    sections.forEach(sec => sectionObserver.observe(sec));

    // --- Contact Form Submission ---
    contactForm?.addEventListener("submit", e => {
        e.preventDefault();
        if (!contactForm || !formStatus) return;

        const SERVICE_ID = "service_htu4n6a";
        const TEMPLATE_ID = "template_vwj8qcy";
        const PUBLIC_KEY = "6evT1RRKGOkwyBges";

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        formStatus.textContent = "Sending...";
        formStatus.style.color = "var(--text-color)";

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm, PUBLIC_KEY)
            .then(() => {
                formStatus.textContent = "Message sent successfully!";
                formStatus.style.color = "#22c55e";
                contactForm.reset();
                setTimeout(() => formStatus.textContent = "", 3000);
            })
            .catch(error => {
                formStatus.textContent = `Failed to send message. Error: ${JSON.stringify(error)}`;
                formStatus.style.color = "#ef4444";
                setTimeout(() => formStatus.textContent = "", 3000);
            })
            .finally(() => submitBtn.disabled = false);
    });
});
