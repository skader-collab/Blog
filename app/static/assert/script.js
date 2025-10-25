document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.querySelector('nav');
  let isMenuOpen = false;
  let lastScrollPosition = 0;
  let scrollTimeout;

  // Handle menu toggle with animation frame for better performance
  menuToggle?.addEventListener('click', function(e) {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    requestAnimationFrame(() => {
      mobileMenu.classList.toggle('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
      isMenuOpen = false;
      requestAnimationFrame(() => {
        mobileMenu.classList.remove('active');
      });
    }
  });

  // Optimize scroll performance
  function onScroll() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        const currentScroll = window.pageYOffset;
        
        // Handle header visibility
        if (currentScroll > lastScrollPosition && currentScroll > 100) {
          requestAnimationFrame(() => {
            header.style.transform = 'translateY(-100%)';
          });
        } else {
          requestAnimationFrame(() => {
            header.style.transform = 'translateY(0)';
          });
        }

        lastScrollPosition = currentScroll;
        scrollTimeout = null;
      }, 100);
    }
  }

  // Throttle scroll event
  window.addEventListener('scroll', onScroll, { passive: true });

  // Handle window resize efficiently
  let resizeTimeout;
  window.addEventListener('resize', function() {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        if (window.innerWidth > 768 && isMenuOpen) {
          isMenuOpen = false;
          requestAnimationFrame(() => {
            mobileMenu.classList.remove('active');
          });
        }
        resizeTimeout = null;
      }, 100);
    }
  });

  // Initialize intersection observer for lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
});