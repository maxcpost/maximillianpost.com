document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 The Little Prince site is initializing...');
    
    // Initialize all components
    initStarryBackground();
    initCustomCursor();
    initCosmicNavigation();
    
    // Additional check to ensure Little Prince is on the right planet
    setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('blog')) {
            ensureLittlePrinceOnBlogPlanet();
        }
    }, 500);
    
    // Check if we need to show a welcome message on mobile
    if (isTouchDevice() && localStorage.getItem('firstVisit') !== 'false') {
        setTimeout(() => {
            showToast('Welcome! Tap on planets to explore', 'info', 5000);
            localStorage.setItem('firstVisit', 'false');
        }, 2000);
    }
    
    // Add a way to detect screen orientation changes
    window.addEventListener('orientationchange', function() {
        // Redraw and reposition elements if needed
        setTimeout(() => {
            // Show a notification about the orientation change
            if (window.orientation === 0 || window.orientation === 180) {
                // Portrait mode
                showToast('Portrait mode activated', 'info', 2000);
            } else {
                // Landscape mode
                showToast('Landscape mode activated', 'info', 2000);
            }
        }, 300);
    });
    
    // Add a handler for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.addEventListener('change', () => {
        // Refresh the page to apply the new animation settings
        window.location.reload();
    });
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // Initialize blog post items if we're on that page
    if (document.querySelector('.post-list')) {
        initBlogPostItems();
    }
    
    // Add Little Prince quotes
    addRandomPrinceQuote();
    
    console.log('🌟 Initialization complete');
});

/**
 * Scroll-to-Top Button
 */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    // Show button when page is scrolled down
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollBtn.classList.add('active');
        } else {
            scrollBtn.classList.remove('active');
        }
    });

    // Scroll to top when button is clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Show a toast notification
        showToast('Back to the stars!', 'info', 2000);
    });
}

/**
 * Initialize cosmic navigation (planet-based nav)
 */
function initCosmicNavigation() {
    console.log('Initializing cosmic navigation with Little Prince');
    
    // Debug check for cosmic navigation
    const navContainer = document.querySelector('.cosmic-navigation');
    if (!navContainer) {
        console.error('Navigation container not found!');
        return;
    } else {
        console.log('Found navigation container:', navContainer);
    }
    
    // Set active page
    const currentPath = window.location.pathname;
    const planets = document.querySelectorAll('.planet');
    
    // Create SVG for planet paths
    if (navContainer) {
        const pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pathSvg.classList.add('planet-path');
        pathSvg.setAttribute('width', '100%');
        pathSvg.setAttribute('height', '100%');
        navContainer.appendChild(pathSvg);
    }
    
    // Wrap each planet in a planet-link divs for mobile styling
    wrapPlanetsForMobile();
    
    // Add Little Prince figure and planet labels
    planets.forEach(planet => {
        // Add the Little Prince figure to each planet
        const prince = document.createElement('div');
        prince.className = 'little-prince';
        planet.appendChild(prince);
        
        // Create planet label
        const planetName = planet.getAttribute('data-name');
        const label = document.createElement('div');
        label.className = 'planet-label';
        label.textContent = planetName;
        planet.appendChild(label);
        
        // Add hover event to create path - for desktop
        planet.addEventListener('mouseenter', function() {
            // Restore drawing the path, but without animation (animation was removed earlier)
            if (!isTouchDevice() && !planet.classList.contains('active')) {
                drawPathToActivePlanet(planet);
            }
        });
        
        planet.addEventListener('mouseleave', function() {
            if (!isTouchDevice()) {
                // Restore clearing paths
                clearPaths();
                
                // This can stay as it ensures the Little Prince is hidden when not on active planet
                if (!this.classList.contains('active')) {
                    const prince = this.querySelector('.little-prince');
                    if (prince) {
                        prince.style.opacity = '0';
                    }
                }
            }
        });
        
        // Add touch events for mobile devices
        planet.addEventListener('touchstart', function(e) {
            // Prevent default to avoid both touch and click events firing
            e.preventDefault();
            
            // Restore clearing paths
            clearPaths();
            
            // Don't draw path if this is the active planet
            if (!planet.classList.contains('active')) {
                // Restore drawing the path
                drawPathToActivePlanet(planet);
                
                // Restore timeout to clear paths
                setTimeout(() => {
                    clearPaths();
                }, 1500);
            }
        });
    });
    
    // After initial setup, adjust Little Prince positions for better visual appearance
    setTimeout(() => {
        // First hide all princes
        const allPrinces = document.querySelectorAll('.cosmic-navigation .little-prince');
        allPrinces.forEach(prince => {
            prince.style.opacity = '0';
        });
        
        // Only show Little Prince on the active planet, not on all planets in sequence
        const activePlanet = document.querySelector('.cosmic-navigation .planet.active');
        if (activePlanet) {
            const prince = activePlanet.querySelector('.little-prince');
            if (prince) {
                prince.style.opacity = '1';
            }
            
            // Add active class to parent planet-link for indicator
            const parentLink = activePlanet.closest('.planet-link');
            if (parentLink) {
                parentLink.classList.add('planet-link-active');
            }
        }
    }, 100);
    
    // Set active planet
    if (currentPath === '/' || currentPath.includes('index.html')) {
        const homePlanet = document.querySelector('.home-planet');
        if (homePlanet) {
            homePlanet.classList.add('active');
            const parentLink = homePlanet.closest('.planet-link');
            if (parentLink) {
                parentLink.classList.add('planet-link-active');
            }
        }
    }
    else if (currentPath.includes('blog')) {
        const blogPlanet = document.querySelector('.blog-planet');
        if (blogPlanet) {
            blogPlanet.classList.add('active');
            const parentLink = blogPlanet.closest('.planet-link');
            if (parentLink) {
                parentLink.classList.add('planet-link-active');
            }
        }
    }
    else if (currentPath.includes('code')) {
        const codePlanet = document.querySelector('.code-planet');
        if (codePlanet) {
            codePlanet.classList.add('active');
            const parentLink = codePlanet.closest('.planet-link');
            if (parentLink) {
                parentLink.classList.add('planet-link-active');
            }
        }
    }
    else if (currentPath.includes('linkedin')) {
        const linkedinPlanet = document.querySelector('.linkedin-planet');
        if (linkedinPlanet) {
            linkedinPlanet.classList.add('active');
            const parentLink = linkedinPlanet.closest('.planet-link');
            if (parentLink) {
                parentLink.classList.add('planet-link-active');
            }
        }
    }
    
    // Setup Mobile Menu Toggle
    setupMobileMenu();
}

/**
 * Wrap planets in container divs for mobile styling
 */
function wrapPlanetsForMobile() {
    const navContainer = document.querySelector('.cosmic-navigation');
    if (!navContainer) return;
    
    const planets = navContainer.querySelectorAll('.planet');
    
    planets.forEach(planet => {
        // Skip if already wrapped
        if (planet.parentElement.classList.contains('planet-link')) return;
        
        // Create wrapper element
        const wrapper = document.createElement('div');
        wrapper.className = 'planet-link';
        
        // Insert wrapper before planet
        planet.parentNode.insertBefore(wrapper, planet);
        
        // Move planet into wrapper
        wrapper.appendChild(planet);
    });
}

/**
 * Setup mobile menu functionality
 */
function setupMobileMenu() {
    // Check if we already have a menu toggle
    let menuToggle = document.querySelector('.menu-toggle');
    
    // If not, create one
    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Create the hamburger icon
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            line.className = 'menu-line';
            menuToggle.appendChild(line);
        }
        
        document.body.appendChild(menuToggle);
    }
    
    // Create a backdrop for the mobile menu
    let menuBackdrop = document.querySelector('.menu-backdrop');
    if (!menuBackdrop) {
        menuBackdrop = document.createElement('div');
        menuBackdrop.className = 'menu-backdrop';
        document.body.appendChild(menuBackdrop);
    }
    
    // Get the cosmic navigation
    const cosmicNavigation = document.querySelector('.cosmic-navigation');
    
    // If cosmicNavigation doesn't exist, stop here
    if (!cosmicNavigation) {
        console.error('Cosmic navigation element not found!');
        return;
    }
    
    // Function to open the menu
    function openMenu() {
        menuToggle.classList.add('active');
        cosmicNavigation.classList.add('active');
        menuBackdrop.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Show a helpful toast on first open
        if (!localStorage.getItem('menuShown')) {
            setTimeout(() => {
                showToast('Tap a planet to navigate', 'info', 2500);
                localStorage.setItem('menuShown', 'true');
            }, 300);
        }
        
        // Make sure Little Prince is visible on the active planet
        setTimeout(() => {
            // First hide all princes
            const allPrinces = document.querySelectorAll('.cosmic-navigation .little-prince');
            allPrinces.forEach(prince => {
                prince.style.opacity = '0';
            });
            
            // Only show Little Prince on the active planet, not on all planets in sequence
            const activePlanet = document.querySelector('.cosmic-navigation .planet.active');
            if (activePlanet) {
                const prince = activePlanet.querySelector('.little-prince');
                if (prince) {
                    prince.style.opacity = '1';
                }
            }
        }, 300);
    }
    
    // Function to close the menu
    function closeMenu() {
        menuToggle.classList.remove('active');
        cosmicNavigation.classList.remove('active');
        menuBackdrop.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    // Toggle menu when button is clicked
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default button behavior
        console.log('Menu button clicked!');  // Debug log
        if (menuToggle.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when backdrop is clicked
    menuBackdrop.addEventListener('click', closeMenu);
    
    // Close menu when the X in the corner is clicked (cosmicNavigation::before)
    cosmicNavigation.addEventListener('click', function(e) {
        // Get the position of the click
        const rect = cosmicNavigation.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is in the top-right corner (close button area)
        if (x > rect.width - 50 && y < 50) {
            closeMenu();
        }
    });
    
    // Close menu when a planet is clicked
    const planets = document.querySelectorAll('.planet a');
    planets.forEach(planetLink => {
        planetLink.addEventListener('click', function(e) {
            // Get the planet element (parent of the link)
            const planet = this.parentElement;
            const targetHref = this.getAttribute('href');
            
            // Prevent default navigation
            e.preventDefault();
            
            // First remove active class from current planet
            const currentActive = document.querySelector('.planet.active');
            if (currentActive) {
                currentActive.classList.remove('active');
                // Also remove active class from parent planet-link
                const parentLink = currentActive.closest('.planet-link');
                if (parentLink) {
                    parentLink.classList.remove('planet-link-active');
                }
            }
            
            // Add active class to clicked planet
            planet.classList.add('active');
            
            // Add active class to parent planet-link
            const newParentLink = planet.closest('.planet-link');
            if (newParentLink) {
                newParentLink.classList.add('planet-link-active');
            }
            
            // Show the Little Prince on this planet
            const prince = planet.querySelector('.little-prince');
            if (prince) {
                // Hide all other princes first
                const allPrinces = document.querySelectorAll('.little-prince');
                allPrinces.forEach(p => {
                    p.style.opacity = '0';
                });
                
                // Show this prince
                prince.style.opacity = '1';
            }
            
            // Only close if it's a mobile view
            if (window.innerWidth <= 768) {
                closeMenu();
            }
            
            // Navigate after a short delay to show the animation
            setTimeout(() => {
                window.location.href = targetHref;
            }, 400);
        });
    });
    
    // Close menu on window resize if it gets to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && cosmicNavigation.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cosmicNavigation.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Show menu button only on mobile
    function toggleMenuVisibility() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'flex';
        } else {
            menuToggle.style.display = 'none';
        }
    }
    
    // Initial visibility check
    toggleMenuVisibility();
    
    // Check visibility on resize
    window.addEventListener('resize', toggleMenuVisibility);
    
    // Add hover/touch effects for planets in mobile menu
    if (window.innerWidth <= 768) {
        const mobileMenuPlanets = document.querySelectorAll('.cosmic-navigation .planet');
        mobileMenuPlanets.forEach(planet => {
            // Add touch event for mobile
            planet.addEventListener('touchstart', function(e) {
                // Don't prevent default here to allow navigation
            });
        });
    }
}

/**
 * Draw a dotted path from hover planet to active planet
 */
function drawPathToActivePlanet(fromPlanet) {
    const activePlanet = document.querySelector('.planet.active');
    if (!activePlanet || fromPlanet === activePlanet) return;
    
    clearPaths();
    
    const svgContainer = document.querySelector('.planet-path');
    if (!svgContainer) return;
    
    // Get positions
    const fromRect = fromPlanet.getBoundingClientRect();
    const toRect = activePlanet.getBoundingClientRect();
    const containerRect = svgContainer.getBoundingClientRect();
    
    // Calculate start and end positions relative to SVG container
    const startX = fromRect.left - containerRect.left + fromRect.width/2;
    const startY = fromRect.top - containerRect.top + fromRect.height/2;
    const endX = toRect.left - containerRect.left + toRect.width/2;
    const endY = toRect.top - containerRect.top + toRect.height/2;
    
    // Create a curved path with random control points
    const midX = startX + (endX - startX) / 2;
    const midY = startY + (endY - startY) / 2;
    
    // Add some randomness to make paths different each time
    const randomOffsetX = (Math.random() - 0.5) * 100;
    const randomOffsetY = (Math.random() - 0.5) * 100;
    
    const controlX = midX + randomOffsetX;
    const controlY = midY + randomOffsetY;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--gold)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '5,5');
    path.setAttribute('opacity', '0.7');
    
    // Add the path to the SVG
    svgContainer.appendChild(path);
    
    // Add stars along the path
    addStarsAlongPath(svgContainer, startX, startY, endX, endY);
}

/**
 * Add small stars along the path between planets
 */
function addStarsAlongPath(svgContainer, startX, startY, endX, endY) {
    const numStars = 3 + Math.floor(Math.random() * 3); // 3-5 stars
    
    for (let i = 0; i < numStars; i++) {
        const ratio = (i + 1) / (numStars + 1);
        const starX = startX + (endX - startX) * ratio;
        const starY = startY + (endY - startY) * ratio;
        
        // Add some random offset
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        star.setAttribute('cx', starX + offsetX);
        star.setAttribute('cy', starY + offsetY);
        star.setAttribute('r', 2 + Math.random() * 2);
        star.setAttribute('fill', 'var(--gold)');
        star.setAttribute('class', 'path-star');
        star.setAttribute('opacity', '0.7'); // Set a static opacity instead of animating
        
        svgContainer.appendChild(star);
        
        // Remove twinkle animation to prevent blinking effect
    }
}

/**
 * Clear all path elements
 */
function clearPaths() {
    const svgContainer = document.querySelector('.planet-path');
    if (svgContainer) {
        svgContainer.innerHTML = '';
    }
}

/**
 * Initialize custom cursor
 */
function initCustomCursor() {
    // Only initialize custom cursor on non-touch devices
    if (!isTouchDevice()) {
        const cursor = document.createElement('div');
        cursor.id = 'brutalist-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
        
        // Add hover effect when over links
        document.querySelectorAll('a, button, .planet, .read-more').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
}

/**
 * Create the starry background effect
 */
function initStarryBackground() {
    // Check if we should reduce stars for performance
    const isMobile = window.innerWidth < 768 || isTouchDevice();
    const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Adjust star count based on device and user preferences
    const starCount = isMobile ? 30 : 100;
    const shootingStarCount = (isMobile || preferReducedMotion) ? 0 : 5;
    const twinkleStarPercentage = preferReducedMotion ? 0.2 : 0.6; // Percentage of stars that twinkle
    
    // Create the stars
    for (let i = 0; i < starCount; i++) {
        createStar(i >= starCount * (1 - twinkleStarPercentage));
    }
    
    // Create shooting stars on a timer for better performance
    if (shootingStarCount > 0 && !isMobile && !preferReducedMotion) {
        const createShootingStar = () => {
            const star = document.createElement('div');
            star.className = 'star shooting';
            
            // Random position and angle
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * (window.innerHeight / 3); // Only from top third
            
            star.style.left = startX + 'px';
            star.style.top = startY + 'px';
            
            document.body.appendChild(star);
            
            // Remove after animation completes
            setTimeout(() => {
                star.remove();
            }, 5000);
        };
        
        // Create a shooting star every few seconds
        setInterval(createShootingStar, 8000);
    }
}

// Helper functions

function createStar(shouldTwinkle) {
    const star = document.createElement('div');
    star.className = 'star';
    if (shouldTwinkle) {
        star.classList.add('twinkle');
    }
    
    // Random size, position, and delay for twinkle animation
    const size = Math.random() * 2 + 1;
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = posX + 'px';
    star.style.top = posY + 'px';
    
    if (shouldTwinkle) {
        star.style.animationDelay = Math.random() * 4 + 's';
    }
    
    document.body.appendChild(star);
}

/**
 * Initialize blog post items
 */
function initBlogPostItems() {
    const postItems = document.querySelectorAll('.post-item');
    
    // Make sure the Little Prince is visible on the blog planet when on blog pages
    ensureLittlePrinceOnBlogPlanet();
    
    postItems.forEach(post => {
        post.addEventListener('click', function(e) {
            // If they clicked specifically on a link, let the link handle it
            if (e.target.tagName === 'A') return;
            
            // Otherwise, find the first link and follow it
            const link = this.querySelector('a');
            if (link) {
                // For touch devices, just follow the link
                if (isTouchDevice()) {
                    window.location.href = link.href;
                } else {
                    // For non-touch, animate and then follow
                    this.classList.add('clicked');
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 300);
                }
            }
        });
        
        // Add hover effect for non-touch devices
        if (!isTouchDevice()) {
            post.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            post.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        }
    });
}

/**
 * Ensures the Little Prince is visible on the blog planet when on blog pages
 */
function ensureLittlePrinceOnBlogPlanet() {
    // Check if we're on a blog page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('blog')) {
        console.log('Blog page detected - ensuring Little Prince is on blog planet');
        
        // First hide all little princes
        const allPrinces = document.querySelectorAll('.little-prince');
        allPrinces.forEach(prince => {
            prince.style.opacity = '0';
        });
        
        // Find the blog planet and make it active
        const blogPlanet = document.querySelector('.blog-planet');
        if (blogPlanet) {
            // Remove active class from all planets
            const allPlanets = document.querySelectorAll('.planet');
            allPlanets.forEach(planet => {
                planet.classList.remove('active');
            });
            
            // Remove active class from all planet links
            const allPlanetLinks = document.querySelectorAll('.planet-link');
            allPlanetLinks.forEach(link => {
                link.classList.remove('planet-link-active');
            });
            
            // Make blog planet active
            blogPlanet.classList.add('active');
            
            // Show the Little Prince on the blog planet
            const prince = blogPlanet.querySelector('.little-prince');
            if (prince) {
                prince.style.opacity = '1';
            }
            
            // Add active class to parent planet-link for indicator
            const parentLink = blogPlanet.closest('.planet-link');
            if (parentLink) {
                parentLink.classList.add('planet-link-active');
            }
            
            console.log('Little Prince is now visible on blog planet');
        }
    }
}

/**
 * Add a random Little Prince quote to the page
 */
function addRandomPrinceQuote() {
    const quoteContainer = document.querySelector('.quote-container');
    if (!quoteContainer) return;
    
    const quotes = [
        "All grown-ups were once children... but only few of them remember it.",
        "It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
        "You become responsible, forever, for what you have tamed.",
        "The most beautiful things in the world cannot be seen or touched, they are felt with the heart.",
        "It is such a mysterious place, the land of tears.",
        "What makes the desert beautiful is that somewhere it hides a well.",
        "One sees clearly only with the heart. Anything essential is invisible to the eyes."
    ];
    
    // Get a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Create quote element
    const quoteElement = document.createElement('blockquote');
    quoteElement.className = 'prince-quote';
    quoteElement.textContent = randomQuote;
    
    // Add attribution
    const attribution = document.createElement('footer');
    attribution.className = 'quote-attribution';
    attribution.textContent = '— The Little Prince';
    quoteElement.appendChild(attribution);
    
    // Add to container
    quoteContainer.appendChild(quoteElement);
    
    // Animate in
    setTimeout(() => {
        quoteElement.classList.add('visible');
    }, 500);
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 * @param {number} duration - How long to show the notification in ms
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    // Add message
    toast.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.addEventListener('click', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 300);
    });
    toast.appendChild(closeBtn);
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('toast-visible'), 10);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.classList.add('toast-hiding');
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
    
    return toast;
}

/**
 * Check if device supports touch events
 * @returns {boolean} True if device supports touch
 */
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}
