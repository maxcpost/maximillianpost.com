document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initScrollToTop();
    initToastSystem();
    initAnimations();
    enhanceInteractivity();
    initCustomCursor();
    initBlogPostItems();
});

/**
 * Scroll-to-Top Button
 */
function initScrollToTop() {
    // Create scroll-to-top button if it doesn't exist
    if (!document.querySelector('.scroll-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 10.8289L16.2505 15.0794L17.6647 13.6652L12 8.00053L6.33533 13.6652L7.74954 15.0794L12 10.8289Z" />
            </svg>
        `;
        document.body.appendChild(scrollBtn);
    }

    const scrollToTopBtn = document.querySelector('.scroll-top');
    
    // Show button when scrolled down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click with smooth animation
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Toast Notification System
 */
function initToastSystem() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, info)
 */
function showToast(title, message, type = 'info') {
    const container = document.querySelector('.toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Get icon based on type
    let icon = '';
    if (type === 'success') {
        icon = '<span class="toast-icon">✅</span>';
    } else if (type === 'error') {
        icon = '<span class="toast-icon">❌</span>';
    } else {
        icon = '<span class="toast-icon">ℹ️</span>';
    }
    
    // Set toast content
    toast.innerHTML = `
        ${icon}
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Close notification">×</button>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Handle close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto-remove after timeout
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

/**
 * Enhance interactivity throughout the site
 */
function enhanceInteractivity() {
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('button, .button, .read-more');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add skip link for accessibility if not already present
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        document.body.prepend(skipLink);
    }
    
    // Mark the first content element with ID for skip link
    const mainContent = document.querySelector('main') || document.querySelector('.content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

/**
 * Initialize animations for page elements
 */
function initAnimations() {
    // Detect if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Don't add animations if reduced motion is preferred
    }
    
    // Add intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Add animation classes to elements
    const sections = document.querySelectorAll('section, article, .card, .post-item');
    sections.forEach((section, index) => {
        section.classList.add('fade-in-element');
        section.style.animationDelay = `${index * 0.1}s`;
        observer.observe(section);
    });
    
    // Add animation styles dynamically
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in-element {
                opacity: 0;
            }
            
            .fade-in-element.animated {
                animation: fadeIn 0.6s ease forwards;
            }
            
            @keyframes ripple {
                from { transform: scale(0); opacity: 1; }
                to { transform: scale(4); opacity: 0; }
            }
            
            .ripple {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
                animation: ripple 0.6s linear forwards;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Interactive Custom Cursor - BRUTALIST VERSION
 * This is implemented to work consistently across all pages
 */
function initCustomCursor() {
    console.log("Starting cursor initialization");
    
    // Check if cursor already exists on page to avoid duplicates
    if (document.getElementById('brutalist-cursor')) {
        console.log("Cursor already exists, skipping initialization");
        return;
    }
    
    // Remove any existing cursors to avoid duplicates
    const existingCursors = document.querySelectorAll('.cursor-inner, .cursor-outer, #cursor-styles, #cursor-animation');
    existingCursors.forEach(el => el.remove());
    
    // Create a simple square cursor - pure brutalist style
    const cursor = document.createElement('div');
    cursor.id = 'brutalist-cursor';
    document.body.appendChild(cursor);
    
    console.log("Cursor element created");
    
    // Add cursor styles - include !important for higher specificity to override site-wide styles
    const style = document.createElement('style');
    style.id = 'brutalist-cursor-style';
    style.textContent = `
        * {
            cursor: none !important;
        }
        
        #brutalist-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background-color: #00E5FF !important;
            mix-blend-mode: exclusion;
            pointer-events: none;
            z-index: 999999 !important;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            border: 2px solid #FFFFFF !important;
            box-shadow: 0 0 10px rgba(0,229,255,0.8), 0 0 20px rgba(0,229,255,0.5);
        }
        
        /* State changes */
        #brutalist-cursor.hover {
            width: 40px !important;
            height: 40px !important;
            background-color: transparent !important;
            border: 3px solid #00E5FF !important;
            mix-blend-mode: normal;
        }
        
        #brutalist-cursor.click {
            transform: translate(-50%, -50%) scale(0.7);
        }
        
        /* Hide on touch devices */
        @media (hover: none) {
            #brutalist-cursor {
                display: none !important;
            }
            * {
                cursor: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log("Cursor styles added");
    
    // Position the cursor at the center initially
    const cursorEl = document.getElementById('brutalist-cursor');
    if (!cursorEl) {
        console.error("Failed to find cursor element after creation!");
        return;
    }
    
    // Ensure initialization is complete
    cursorEl.style.display = 'block';
    
    // Ultra simple positioning, no easing for reliability
    document.addEventListener('mousemove', function(e) {
        // Direct positioning, no calculations
        cursorEl.style.left = e.clientX + 'px';
        cursorEl.style.top = e.clientY + 'px';
    });
    
    console.log("Mouse move event listener added");
    
    // Add hover effect to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .button, .read-more, input[type="submit"], [role="button"], select, input[type="checkbox"], input[type="radio"]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursorEl.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', function() {
            cursorEl.classList.remove('hover');
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', function() {
        cursorEl.classList.add('click');
    });
    
    document.addEventListener('mouseup', function() {
        cursorEl.classList.remove('click');
    });
    
    // Add a small debug message to the page to indicate cursor is active
    const debugMsg = document.createElement('div');
    debugMsg.style.position = 'fixed';
    debugMsg.style.top = '10px';
    debugMsg.style.right = '10px';
    debugMsg.style.background = 'rgba(0,0,0,0.7)';
    debugMsg.style.color = '#00E5FF';
    debugMsg.style.padding = '5px 10px';
    debugMsg.style.fontSize = '12px';
    debugMsg.style.fontFamily = 'monospace';
    debugMsg.style.zIndex = '9999';
    debugMsg.style.pointerEvents = 'none';
    debugMsg.innerHTML = 'BRUTALIST CURSOR ACTIVE';
    document.body.appendChild(debugMsg);
    
    // Remove debug message after 3 seconds
    setTimeout(() => {
        debugMsg.style.opacity = '0';
        debugMsg.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            debugMsg.remove();
        }, 500);
    }, 3000);
    
    // Force a cursor move event to show it immediately
    document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
    }));
    
    // Reattach cursor effect after page transitions or AJAX loads
    // This helps when sites use turbolinks or similar technologies
    document.addEventListener('turbolinks:load', initCustomCursor);
    document.addEventListener('page:load', initCustomCursor);
    document.addEventListener('ajax:complete', initCustomCursor);
    
    console.log("Custom cursor completely initialized");
    
    // Store that cursor was initialized in sessionStorage
    // so other pages can detect it was already loaded
    try {
        sessionStorage.setItem('cursorInitialized', 'true');
    } catch (e) {
        console.log("Unable to use sessionStorage");
    }
}

// For sites with multiple pages, ensure cursor persists
// This technique helps the cursor persist across all pages by running the cursor initialization
// as soon as possible in case the site has multiple HTML files
(function() {
    // Only run this code in browsers (not SSR)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Initialize cursor immediately if possible
        if (document.readyState !== 'loading') {
            initCustomCursor();
        } else {
            // Otherwise wait for DOM to be ready
            document.addEventListener('DOMContentLoaded', initCustomCursor);
        }
    }
})();

/**
 * Enhance blog post items to make them fully clickable
 */
function initBlogPostItems() {
    // Get all blog post items
    const postItems = document.querySelectorAll('.post-item');
    
    postItems.forEach(item => {
        // Get the main link inside the post item
        const mainLink = item.querySelector('.post-item-link');
        // Get the Read More button
        const readMoreBtn = item.querySelector('.read-more');
        
        if (mainLink && readMoreBtn) {
            // Prevent the Read More button from triggering the parent link
            readMoreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Add a click event to the entire post item
            item.addEventListener('click', function(e) {
                // Only trigger if the click wasn't on the Read More button or its children
                if (!e.target.closest('.read-more')) {
                    mainLink.click();
                }
            });
            
            // Make the post item look clickable
            item.style.cursor = 'pointer';
        }
    });
}
