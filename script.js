// --- Translations Dictionary ---
const translations = {
    en: {
        page_title: "HopeAgent007 | Building Tools for the Lord's Work",
        nav_mission: "Mission",
        nav_projects: "Projects",
        nav_contact: "Contact",
        hero_badge: "Ministry Technology",
        hero_title: "Building tools for the Lord's work.",
        hero_subtitle: "Equipping Seventh-day Adventist churches and ministries with modern, open-source technology.",
        hero_btn_primary: "Visit our GitHub",
        hero_btn_secondary: "See Projects",
        mission_title: "Our Mission",
        mission_text: "HopeAgent007 is dedicated to harnessing the power of open-source technology to support the mission of the Seventh-day Adventist Church. We build reliable, beautifully designed software tools tailored for modern ministries, local congregations, and church leadership. By combining faith with engineering, we aim to streamline operations and enhance digital engagement.",
        projects_title: "Featured Projects",
        contact_title: "Get in Touch",
        contact_subtitle: "Have a question or want to contribute? Reach out to us.",
        contact_label_name: "Name",
        contact_label_email: "Email",
        contact_label_message: "Message",
        contact_btn_send: "Send Message",
        footer_link: "GitHub Organization",
        footer_copy: "© 2026 HopeAgent007. Built for ministry.",
        project_view_github: "View on GitHub",
        error_loading_projects: "Could not load projects at this time."
    },
    ro: {
        page_title: "HopeAgent007 | Construim Instrumente pentru Lucrarea Domnului",
        nav_mission: "Misiune",
        nav_projects: "Proiecte",
        nav_contact: "Contact",
        hero_badge: "Tehnologie pentru Misiune",
        hero_title: "Construim instrumente pentru lucrarea Domnului.",
        hero_subtitle: "Echipăm bisericile și departamentele Adventiste de Ziua a Șaptea cu tehnologie modernă, open-source.",
        hero_btn_primary: "Vizitează-ne pe GitHub",
        hero_btn_secondary: "Vezi Proiectele",
        mission_title: "Misiunea Noastră",
        mission_text: "HopeAgent007 este dedicat valorificării puterii tehnologiei open-source pentru a sprijini misiunea Bisericii Adventiste de Ziua a Șaptea. Construim instrumente software fiabile, frumos concepute, adaptate pentru departamente moderne, congregații locale și conducerea bisericii. Prin combinarea credinței cu ingineria, ne propunem să eficientizăm operațiunile și să îmbunătățim implicarea digitală.",
        projects_title: "Proiecte Reprezentative",
        contact_title: "Contactează-ne",
        contact_subtitle: "Ai o întrebare sau vrei să contribui? Scrie-ne.",
        contact_label_name: "Nume",
        contact_label_email: "Email",
        contact_label_message: "Mesaj",
        contact_btn_send: "Trimite Mesajul",
        footer_link: "Organizația GitHub",
        footer_copy: "© 2026 HopeAgent007. Construit pentru misiune.",
        project_view_github: "Vezi pe GitHub",
        error_loading_projects: "Nu s-au putut încărca proiectele în acest moment."
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

// Apply translations
function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'TITLE') {
                document.title = dict[key];
            } else {
                el.textContent = dict[key];
            }
        }
    });
    
    // Also update dynamic "View on GitHub" links in case they were already rendered
    document.querySelectorAll('.dynamic-github-link').forEach(el => {
        el.childNodes[0].nodeValue = dict['project_view_github'] + " ";
    });
    
    // Update lang button text
    const langText = document.querySelector('.lang-text');
    if(langText) {
        langText.textContent = lang === 'en' ? 'RO' : 'EN';
    }
}

// --- Dynamic Projects API ---
async function fetchProjects() {
    const container = document.getElementById('projects-container');
    const loader = document.getElementById('projects-loader');
    
    try {
        const response = await fetch('https://api.github.com/users/HopeAgent007/repos');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const repos = await response.json();
        
        // Filter out the website repository
        const filteredRepos = repos.filter(repo => repo.name !== 'HopeAgent007-website');
        
        loader.style.display = 'none'; // Hide loader
        
        filteredRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Generate icon based on repo name or use default
            let svgIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>';
            if(repo.name.toLowerCase().includes('live')) {
                svgIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
            }
            
            const currentDict = translations[currentLang];
            const githubText = currentDict['project_view_github'];
            
            card.innerHTML = `
                <div class="project-icon">
                    ${svgIcon}
                </div>
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-desc">${repo.description || 'No description provided.'}</p>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link dynamic-github-link">
                    ${githubText}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            `;
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        loader.style.display = 'none';
        container.innerHTML = `<p class="text-center" style="grid-column: 1/-1" data-i18n="error_loading_projects">${translations[currentLang]['error_loading_projects']}</p>`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    });

    // --- Language Toggle Logic ---
    const langToggle = document.getElementById('lang-toggle');
    
    // Apply initial language
    applyTranslations(currentLang);
    
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ro' : 'en';
        localStorage.setItem('lang', currentLang);
        applyTranslations(currentLang);
    });

    // --- Smooth Scrolling ---
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Intersection Observer for Scroll Fade-in Animations ---
    const fadeElements = document.querySelectorAll('.scroll-fade');
    const fadeObserverOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);
    
    fadeElements.forEach(element => fadeObserver.observe(element));
    
    // --- Initialize Dynamic Projects Fetch ---
    fetchProjects();
});
