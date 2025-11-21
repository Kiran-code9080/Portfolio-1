// Wait for the entire HTML document to be loaded and parsed before running the script.
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Preloader Logic ---
    // Hides the preloader animation once the page's main content has fully loaded.
    const preloader = document.getElementById("preloader");
    window.addEventListener("load", () => {
        preloader.classList.add("hidden");
    });

    // --- Initialize AOS for Scroll Animations ---
    // This activates the 'Animate On Scroll' library with some default settings.
    AOS.init({ duration: 1000, once: true, offset: 120 });

    // --- Element Selections ---
    // Storing frequently used elements in constants for better performance and readability.
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const header = document.querySelector(".header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const backToTopBtn = document.querySelector(".back-to-top");
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle.querySelector("i");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    // --- Mobile Menu Toggle ---
    // Handles opening and closing the mobile navigation menu.
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    // Closes the mobile menu when a link is clicked.
    navLinks.forEach(link => link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // --- Combined scroll event listener for performance ---
    // All actions that happen on scroll are placed in this single listener for efficiency.
    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;

        // 1. Adds a background to the header when scrolling down.
        header.classList.toggle("scrolled", scrollY > 50);

        // 2. Shows or hides the 'Back to Top' button.
        backToTopBtn.classList.toggle("visible", scrollY > 300);

        // 3. Highlights the active navigation link based on scroll position.
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    });

    // --- Refactored Dark/Light Mode Logic ---
    // This function applies a theme and saves the choice to localStorage.
    const applyTheme = (theme) => {
        if (theme === "light") {
            document.body.classList.add("light-mode");
            themeIcon.classList.replace("fa-moon", "fa-sun");
        } else {
            document.body.classList.remove("light-mode");
            themeIcon.classList.replace("fa-sun", "fa-moon");
        }
        localStorage.setItem("theme", theme);
    };

    // On page load, get the saved theme or default to dark mode.
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);

    // Event listener for the theme toggle button.
    themeToggle.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
        applyTheme(newTheme);
    });

    // --- Typing Effect in Hero Section ---
    // Uses the Typed.js library to create an animated typing effect.
    new Typed(".typing-effect", {
        strings: ["Full Stack Developer"],
        typeSpeed: 70,
        backSpeed: 80,
        loop: true
    });

    // --- Skills Filter Logic ---
    // Handles showing/hiding skills based on the selected category button.
    const setupFilter = (filterButtonsSelector, cardsSelector) => {
        const filterBtns = document.querySelectorAll(filterButtonsSelector);
        const cards = document.querySelectorAll(cardsSelector);
        if(!filterBtns.length) return; // Exit if no filter buttons are found.
        
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.dataset.filter;
                cards.forEach(card => {
                    if (filter === "all" || card.dataset.category === filter) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    };
    setupFilter(".skills-section .filter-btn", ".skill-card");
    
    // --- Intersection Observer for SVG Timeline Animation ---
    // This efficiently detects when the timeline is visible on screen to trigger its animation.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing after animation triggers once.
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible.
    document.querySelectorAll('.timeline').forEach(el => observer.observe(el));

    // --- Project Modal Logic ---
    // Handles opening, closing, and populating the project details modal.
    const modal = document.getElementById("project-modal");
    const closeModalBtn = document.querySelector(".close-btn");
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            // Populate the modal with data from the clicked card.
            document.getElementById("modal-img").src = card.querySelector("img").src;
            document.getElementById("modal-title").innerText = card.querySelector("h3").innerText;
            document.getElementById("modal-desc").innerText = card.querySelector("p").innerText;
            document.getElementById("modal-tags").innerHTML = card.querySelector(".project-tags").innerHTML;
            document.getElementById("modal-links").innerHTML = card.querySelector(".project-links").innerHTML;
            modal.style.display = "block"; // Show the modal.
        });
    });
    // Close the modal when the 'x' button is clicked.
    closeModalBtn.addEventListener("click", () => modal.style.display = "none");
    // Close the modal if the user clicks outside of the modal content area.
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

    // --- Contact Form using EmailJS with Auto-Hiding Message ---
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission.
        
        // IMPORTANT: Replace these with your actual credentials from EmailJS.
        const SERVICE_ID = "service_753xgur";
        const TEMPLATE_ID = "template_edmn3me";
        const PUBLIC_KEY = "A8GY5Y4s-MORVV50t";

        formStatus.textContent = "Sending...";
        formStatus.style.color = "var(--text-color)";

        // Send the form data using the EmailJS service.
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm, PUBLIC_KEY)
            .then(() => {
                // On success: show success message, reset form, and clear message after 3 seconds.
                formStatus.textContent = "Message sent successfully!";
                formStatus.style.color = "#22c55e";
                contactForm.reset();
                setTimeout(() => { formStatus.textContent = ""; }, 3000);
            }, (error) => {
                // On failure: show error message and clear it after 3 seconds.
                formStatus.textContent = `Failed to send message. Error: ${JSON.stringify(error)}`;
                formStatus.style.color = "#ef4444";
                setTimeout(() => { formStatus.textContent = ""; }, 3000);
            });
    });
});
