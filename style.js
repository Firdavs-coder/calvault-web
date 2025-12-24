// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    menuIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and step cards
document.querySelectorAll('.feature-card, .step-card, .pricing-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Screenshots Carousel Navigation
const screenshotsScroll = document.querySelector('.screenshots-scroll');
const screenshotsDots = document.querySelectorAll('.screenshots-dot');
const screenshotCards = document.querySelectorAll('.screenshot-card');

let currentCarouselIndex = 0;

// Click on dots to scroll to screenshot
screenshotsDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (screenshotsScroll && screenshotCards[index]) {
            currentCarouselIndex = index;
            
            // Calculate scroll position more accurately
            const card = screenshotCards[index];
            const containerLeft = screenshotsScroll.getBoundingClientRect().left;
            const cardLeft = card.getBoundingClientRect().left;
            const scrollLeft = screenshotsScroll.scrollLeft;
            const targetScroll = scrollLeft + (cardLeft - containerLeft);
            
            screenshotsScroll.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            
            // Update active dot immediately
            screenshotsDots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }
    });
});

// Update active dot on scroll
if (screenshotsScroll) {
    let scrollTimeout;
    screenshotsScroll.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Find which card is most visible
            const scrollLeft = screenshotsScroll.scrollLeft;
            const containerCenter = scrollLeft + (screenshotsScroll.offsetWidth / 2);
            
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            screenshotCards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                const distance = Math.abs(containerCenter - cardCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            currentCarouselIndex = closestIndex;
            
            screenshotsDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === closestIndex);
            });
        }, 100);
    });
}

// Auto-scroll carousel every 5 seconds
let autoScrollInterval;
if (screenshotsScroll && screenshotCards.length > 0) {
    const startAutoScroll = () => {
        return setInterval(() => {
            currentCarouselIndex = (currentCarouselIndex + 1) % screenshotCards.length;
            
            const card = screenshotCards[currentCarouselIndex];
            const containerLeft = screenshotsScroll.getBoundingClientRect().left;
            const cardLeft = card.getBoundingClientRect().left;
            const scrollLeft = screenshotsScroll.scrollLeft;
            const targetScroll = scrollLeft + (cardLeft - containerLeft);
            
            screenshotsScroll.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }, 5000);
    };
    
    autoScrollInterval = startAutoScroll();
    
    // Pause auto-scroll on hover
    screenshotsScroll.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    // Resume auto-scroll on mouse leave
    screenshotsScroll.addEventListener('mouseleave', () => {
        autoScrollInterval = startAutoScroll();
    });
}