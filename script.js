// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website initialized - checking for errors...');
    
    // Handle page loader
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        // Hide loader after a short delay to ensure content is loaded
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500); // Wait for fade out animation
        }, 500);
    }
    
    // Add global error handler
    window.addEventListener('error', function(event) {
        console.error('JavaScript Error:', event.message, 'at', event.filename, 'line', event.lineno);
    });
    
    try {
        // Cache DOM elements for better performance
        const domElements = {
            themeToggle: document.getElementById('themeToggle'),
            body: document.body,
            skillBars: document.querySelectorAll('.skill-progress-bar'),
            skillsSection: document.getElementById('skills'),
            sections: document.querySelectorAll('section'),
            navLinks: document.querySelectorAll('.nav-links a'),
            projectCards: document.querySelectorAll('.project-card'),
            form: document.querySelector('.contact-form'),
            grid: document.querySelector('.neon-grid'),
            scrollIndicator: document.getElementById('scrollIndicator'),
            scrollTopBtn: document.getElementById('scrollTop'),
            floatingBg: document.getElementById('floating-background')
        };
        
        // Initialize modules only if elements exist
        if (domElements.themeToggle) initThemeToggle(domElements);
        if (domElements.projectCards.length > 0) setupProjectCards(domElements.projectCards);
        if (domElements.navLinks.length > 0) setupNavigation(domElements);
        if (domElements.sections.length > 0) setupSectionAnimations(domElements.sections);
        if (domElements.skillBars.length > 0) setupSkillsAnimation(domElements);
        if (domElements.form) setupContactForm(domElements.form);
        if (domElements.grid) setupNeonGrid(domElements.grid);
        if (domElements.floatingBg) createFloatingElements(domElements.floatingBg);
        
        // Initialize typewriter effects
        initTypewriterEffect();
        
        // Apply text glow effect to section headings
        document.querySelectorAll('section h2').forEach(heading => {
            heading.classList.add('text-glow');
        });
        
        // Setup scroll features
        if (domElements.scrollIndicator) setupScrollIndicator(domElements.scrollIndicator);
        if (domElements.scrollTopBtn) setupScrollToTop(domElements.scrollTopBtn);
        
        // Set up smooth scroll for navigation links - using event delegation
        document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Add active class to clicked link
                    domElements.navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    anchor.classList.add('active');
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error in initialization:', error.message);
    }
});

// Initialize theme toggle functionality
function initThemeToggle(elements) {
    elements.themeToggle.addEventListener('click', () => {
        elements.body.classList.toggle('dark-mode');
        elements.themeToggle.textContent = elements.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Save theme preference
        const isDarkMode = elements.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Apply saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        elements.body.classList.add('dark-mode');
        elements.themeToggle.textContent = '☀️';
    } else {
        elements.themeToggle.textContent = '🌙';
    }
}

// Setup 3D tilt effect on project cards - Optimized
function setupProjectCards(projectCards) {
    try {
        if (projectCards.length === 0) {
            console.warn('Project cards not found');
            return;
        }
        
        const tiltConfig = {
            perspectiveValue: 1000,
            maxRotation: 0.01
        };
        
        projectCards.forEach(card => {
            if (!card) return;
            
            // Use mouseenter/mouseleave for better performance than mousemove
            let rafId = null;
            
            card.addEventListener('mousemove', (e) => {
                // Cancel previous animation frame if exists
                if (rafId) cancelAnimationFrame(rafId);
                
                // Use requestAnimationFrame for smoother animation
                rafId = requestAnimationFrame(() => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    
                    // Calculate mouse position relative to card center
                    const mouseX = e.clientX - cardCenterX;
                    const mouseY = e.clientY - cardCenterY;
                    
                    // Calculate rotation (max 10 degrees)
                    const rotateY = mouseX * tiltConfig.maxRotation;
                    const rotateX = -mouseY * tiltConfig.maxRotation;
                    
                    // Apply transform using translate3d and rotate3d for better performance
                    card.style.transform = `perspective(${tiltConfig.perspectiveValue}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                    
                    rafId = null;
                });
            });
            
            card.addEventListener('mouseleave', () => {
                // Cancel any pending animation frame
                if (rafId) cancelAnimationFrame(rafId);
                
                // Reset transform with animation
                card.style.transition = 'transform 0.3s ease';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                
                // Remove transition after animation completes
                setTimeout(() => {
                    card.style.transition = '';
                }, 300);
            });
            
            // Add click event to view project button
            const viewBtn = card.querySelector('.view-project');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    // Show confirmation
                    alert('Project details would open here!');
                });
            }
        });
    } catch (error) {
        console.error('Error in setupProjectCards:', error.message);
    }
}

// Setup active nav links - Optimized with IntersectionObserver
function setupNavigation({sections, navLinks}) {
    try {
        if (sections.length === 0) {
            console.warn('No sections found for navigation');
            return;
        }
        
        if (navLinks.length === 0) {
            console.warn('No navigation links found');
            return;
        }
        
        // Use IntersectionObserver instead of scroll event
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        // Observe all sections
        sections.forEach(section => {
            if (section) navObserver.observe(section);
        });
    } catch (error) {
        console.error('Error in setupNavigation:', error.message);
    }
}

// Setup section animations - Optimized with IntersectionObserver
function setupSectionAnimations(sections) {
    try {
        if (sections.length === 0) {
            console.warn('No sections found for animations');
            return;
        }
        
        // Use IntersectionObserver for better performance
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation is applied
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        });
        
        // Observe all sections
        sections.forEach(section => {
            if (section) sectionObserver.observe(section);
        });
    } catch (error) {
        console.error('Error in setupSectionAnimations:', error.message);
    }
}

// Setup skills animation - Optimized
function setupSkillsAnimation({skillBars, skillsSection}) {
    try {
        if (!skillsSection) {
            console.warn('Skills section not found');
            return;
        }
        
        if (skillBars.length === 0) {
            console.warn('Skill bars not found');
            return;
        }
        
        // Cache skill data once to avoid reflow
        const skillData = [];
        skillBars.forEach(bar => {
            if (!bar || !bar.parentNode) {
                console.warn('Invalid skill bar element');
                return;
            }
            
            skillData.push({
                bar: bar,
                width: bar.parentNode.dataset.width || '0%'
            });
            
            // Initialize with zero width
            bar.style.width = "0%";
        });
        
        // Function to animate skill bars - use requestAnimationFrame
        function animateSkills() {
            requestAnimationFrame(() => {
                skillData.forEach(data => {
                    data.bar.style.width = data.width;
                });
            });
        }
        
        // Observe skills section - improved with appropriate threshold
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay for visual effect
                    setTimeout(animateSkills, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(skillsSection);
    } catch (error) {
        console.error('Error in setupSkillsAnimation:', error.message);
    }
}

// Setup contact form effects - Optimized
function setupContactForm(form) {
    try {
        if (!form) {
            console.warn('Contact form not found');
            return;
        }
        
        // Add glowing effect when focus on inputs
        const inputs = form.querySelectorAll('.neon-input');
        if (inputs.length === 0) {
            console.warn('No form inputs found');
            return;
        }
        
        // Use object pooling for glint effects to reduce GC pressure
        const glintPool = [];
        const POOL_SIZE = 10;
        
        // Create glint pool
        for (let i = 0; i < POOL_SIZE; i++) {
            const glint = document.createElement('span');
            glint.classList.add('input-glint');
            glint.style.display = 'none';
            document.body.appendChild(glint);
            glintPool.push({
                element: glint,
                inUse: false
            });
        }
        
        // Get glint from pool
        function getGlint() {
            for (let i = 0; i < glintPool.length; i++) {
                if (!glintPool[i].inUse) {
                    glintPool[i].inUse = true;
                    glintPool[i].element.style.display = 'block';
                    return glintPool[i];
                }
            }
            return null;
        }
        
        // Return glint to pool
        function returnGlint(glintObj) {
            glintObj.inUse = false;
            glintObj.element.style.display = 'none';
        }
        
        // Use throttling for input events to reduce function calls
        let lastGlintTime = 0;
        
        inputs.forEach(input => {
            if (!input) return;
            
            // Create throttled glint effects as user types
            input.addEventListener('input', (e) => {
                const now = Date.now();
                // Throttle to max once per 200ms
                if (now - lastGlintTime > 200 && input.value.length > 0 && Math.random() > 0.5) {
                    createGlint(input);
                    lastGlintTime = now;
                }
            });
            
            // Add special glow effect on focus
            input.addEventListener('focus', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('form-group-focus');
                }
            });
            
            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('form-group-focus');
                }
            });
        });
        
        // Add form submission animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = form.querySelector('button');
            if (!button) return;
            
            button.innerHTML = 'Sending <span class="sending-dots">...</span>';
            button.disabled = true;
            
            // Simulate sending (would be replaced with actual form submission)
            setTimeout(() => {
                const allInputs = form.querySelectorAll('.neon-input');
                allInputs.forEach(input => {
                    if (input) input.value = '';
                });
                button.innerHTML = 'Message Sent!';
                
                // Add success flash
                form.classList.add('form-success');
                
                setTimeout(() => {
                    form.classList.remove('form-success');
                    button.innerHTML = 'Send Message';
                    button.disabled = false;
                }, 3000);
            }, 2000);
        });
        
        // Optimized glint creation using pool
        function createGlint(element) {
            try {
                if (!element) {
                    console.warn('No element provided for glint effect');
                    return;
                }
                
                const glintObj = getGlint();
                if (!glintObj) return;
                
                const glint = glintObj.element;
                
                // Random position within the input
                const rect = element.getBoundingClientRect();
                const posX = Math.random() * rect.width;
                const posY = Math.random() * rect.height;
                
                // Random color
                const colors = ['#ff00c8', '#00eeff', '#00ffbb'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Position relative to viewport
                glint.style.left = `${rect.left + posX}px`;
                glint.style.top = `${rect.top + posY}px`;
                glint.style.backgroundColor = color;
                
                // Remove after animation completes
                setTimeout(() => {
                    returnGlint(glintObj);
                }, 1000);
            } catch (error) {
                console.error('Error in createGlint:', error.message);
            }
        }
    } catch (error) {
        console.error('Error in setupContactForm:', error.message);
    }
}

// Setup neon grid effect - Optimized
function setupNeonGrid(grid) {
    try {
        if (!grid) {
            console.warn('Neon grid element not found');
            return;
        }
        
        const gridSize = 30;
        const gridWidth = Math.ceil(window.innerWidth / gridSize);
        const gridHeight = Math.ceil(window.innerHeight / gridSize);
        
        // Create element pool for grid cells
        const gridCellPool = [];
        const GRID_POOL_SIZE = 10;  // Max number of glowing cells
        
        // Create pool of grid cells
        for (let i = 0; i < GRID_POOL_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-glow');
            cell.style.display = 'none';
            grid.appendChild(cell);
            gridCellPool.push({
                element: cell,
                inUse: false
            });
        }
        
        // Get cell from pool
        function getGridCell() {
            for (let i = 0; i < gridCellPool.length; i++) {
                if (!gridCellPool[i].inUse) {
                    gridCellPool[i].inUse = true;
                    gridCellPool[i].element.style.display = 'block';
                    return gridCellPool[i];
                }
            }
            return null;
        }
        
        // Return cell to pool
        function returnGridCell(cellObj) {
            cellObj.inUse = false;
            cellObj.element.style.display = 'none';
        }
        
        // Use a longer interval to reduce CPU usage
        const interval = setInterval(() => {
            // Reuse existing cells instead of creating new ones
            gridCellPool.forEach(cellObj => returnGridCell(cellObj));
            
            const numGlowCells = Math.floor(Math.random() * 3) + 2; // Reduced number
            
            for (let i = 0; i < numGlowCells; i++) {
                const x = Math.floor(Math.random() * gridWidth);
                const y = Math.floor(Math.random() * gridHeight);
                
                const cellObj = getGridCell();
                if (!cellObj) continue;
                
                const cell = cellObj.element;
                cell.style.left = `${x * gridSize}px`;
                cell.style.top = `${y * gridSize}px`;
                cell.style.width = `${gridSize}px`;
                cell.style.height = `${gridSize}px`;
                cell.style.backgroundColor = Math.random() > 0.5 ? 'rgba(255, 0, 200, 0.3)' : 'rgba(0, 238, 255, 0.3)';
                
                // Return to pool after animation
                setTimeout(() => {
                    returnGridCell(cellObj);
                }, 2000);
            }
        }, 3000); // Increased from 2000ms to 3000ms
        
        // Clear interval when page hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(interval);
            } else {
                // Only restart if it was previously running
                if (!interval) {
                    setupNeonGrid(grid);
                }
            }
        });
    } catch (error) {
        console.error('Error in setupNeonGrid:', error.message);
    }
}

// Function to create floating background elements - Optimized
function createFloatingElements(bg) {
    try {
        if (!bg) {
            console.warn('Floating background element not found');
            return;
        }
        
        // Reduce number of elements for better performance
        const numElements = Math.floor(Math.random() * 5) + 3; // Reduced from 5-15 to 3-8
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < numElements; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            // Random size between 50px and 300px
            const size = Math.floor(Math.random() * 200) + 50; // Slightly reduced size range
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            
            // Random position
            const posX = Math.floor(Math.random() * 100);
            const posY = Math.floor(Math.random() * 100);
            element.style.left = `${posX}%`;
            element.style.top = `${posY}%`;
            
            // Random animation duration - longer for better performance
            const duration = Math.floor(Math.random() * 20) + 20; // Increased minimum
            element.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.floor(Math.random() * 10);
            element.style.animationDelay = `-${delay}s`;
            
            // Random color
            const hue = Math.floor(Math.random() * 360);
            element.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 70%, 0.1), transparent 70%)`;
            
            fragment.appendChild(element);
        }
        
        // Clear existing elements
        bg.innerHTML = '';
        
        // Add all new elements at once
        bg.appendChild(fragment);
    } catch (error) {
        console.error('Error in createFloatingElements:', error.message);
    }
}

// Function to initialize typewriter effect - Optimized
function initTypewriterEffect() {
    try {
        // Apply to home section headline
        const homeHeading = document.querySelector('.home-content h1');
        if (homeHeading) {
            // Only apply if not already done
            if (!homeHeading.querySelector('.typewriter')) {
                // Save the original text
                const originalText = homeHeading.textContent;
                
                // Clear the text to prepare for animation
                homeHeading.textContent = '';
                
                // Create a span with the typewriter class
                const typewriterSpan = document.createElement('span');
                typewriterSpan.classList.add('typewriter');
                typewriterSpan.textContent = originalText;
                
                // Add the span to the heading
                homeHeading.appendChild(typewriterSpan);
            }
        }
        
        // Apply to about section intro - only if element exists
        const aboutIntro = document.querySelector('.about-content p:first-of-type');
        if (aboutIntro && !aboutIntro.classList.contains('typewriter')) {
            aboutIntro.classList.add('typewriter');
            // Adjust animation duration based on text length
            const textLength = aboutIntro.textContent.length;
            // Limit maximum duration for better performance
            const duration = Math.min(textLength * 0.03, 3);
            aboutIntro.style.animationDuration = `${duration}s, 0.75s`;
        }
    } catch (error) {
        console.error('Error in initTypewriterEffect:', error.message);
    }
}

// Function to setup scroll indicator - Optimized with throttling
function setupScrollIndicator(scrollIndicator) {
    try {
        if (!scrollIndicator) {
            console.warn('Scroll indicator element not found');
            return;
        }
        
        // Throttle scroll events for better performance
        let lastScrollTime = 0;
        const scrollThrottleDelay = 100; // ms
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            if (!ticking && now - lastScrollTime > scrollThrottleDelay) {
                ticking = true;
                lastScrollTime = now;
                
                requestAnimationFrame(() => {
                    updateScrollIndicator();
                    ticking = false;
                });
            }
        });
        
        function updateScrollIndicator() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height <= 0) return; // Prevent division by zero
            
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + '%';
        }
        
        // Initial update
        updateScrollIndicator();
    } catch (error) {
        console.error('Error in setupScrollIndicator:', error.message);
    }
}

// Function to setup scroll to top button - Optimized with throttling
function setupScrollToTop(scrollTopBtn) {
    try {
        if (!scrollTopBtn) {
            console.warn('Scroll to top button not found');
            return;
        }
        
        // Throttle scroll events
        let lastScrollCheckTime = 0;
        const scrollCheckThrottleDelay = 200; // ms
        let scrollCheckTicking = false;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            if (!scrollCheckTicking && now - lastScrollCheckTime > scrollCheckThrottleDelay) {
                scrollCheckTicking = true;
                lastScrollCheckTime = now;
                
                requestAnimationFrame(() => {
                    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                    scrollCheckTicking = false;
                });
            }
        });
        
        // Scroll to top when button is clicked
        scrollTopBtn.addEventListener('click', () => {
            // For modern browsers
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // For older browsers
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    } catch (error) {
        console.error('Error in setupScrollToTop:', error.message);
    }
}