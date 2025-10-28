document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.querySelector('.main-nav');
  const body = document.body;
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let isMenuOpen = false;
  let lastScrollPosition = 0;
  let scrollTimeout;

  // Handle menu toggle with animation frame for better performance
  menuToggle?.addEventListener('click', function(e) {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    requestAnimationFrame(() => {
      mobileMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      body.style.overflow = isMenuOpen ? 'hidden' : '';
    });
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      requestAnimationFrame(() => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        body.style.overflow = '';
      });
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

  function onScroll() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        const currentScroll = window.pageYOffset;
        
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


  window.addEventListener('scroll', onScroll, { passive: true });

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