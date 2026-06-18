document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER SCROLL & BACK-TO-TOP CLASS ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 3. ACTIVE NAVIGATION LINK TRACKING ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // --- 4. TESTIMONIALS SLIDER ---
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  const slides = document.querySelectorAll('.slide');
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create Navigation Dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateSlider();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto running slider (every 7 seconds)
    let autoPlayInterval = setInterval(nextSlide, 7000);
    
    // Pause auto run on hover/interaction
    const resetAutoplay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 7000);
    };

    nextBtn.addEventListener('click', resetAutoplay);
    prevBtn.addEventListener('click', resetAutoplay);
    dots.forEach(d => d.addEventListener('click', resetAutoplay));
  }

  // --- 5. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- 6. APPOINTMENT BOOKING FORM VALIDATION & MODAL ---
  const bookingForm = document.getElementById('bookingForm');
  const formMsg = document.getElementById('formMsg');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  
  // Set Minimum Date for appointment to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const treatment = document.getElementById('treatment').value;
      const date = document.getElementById('date').value;
      
      // Basic Validation
      if (!name || !phone || !treatment || !date) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }
      
      if (phone.length < 10) {
        showFormMessage('Please enter a valid 10-digit phone number.', 'error');
        return;
      }

      // Populate Success Modal Details
      document.getElementById('mName').innerText = name;
      document.getElementById('mTreatment').innerText = treatment;
      
      // Format Date nicely
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      document.getElementById('mDate').innerText = formattedDate;

      // Show Success Modal
      successModal.classList.add('active');
      
      // Reset Form & Messages
      bookingForm.reset();
      formMsg.style.display = 'none';
    });

    if (closeModalBtn && successModal) {
      closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
      });
      
      // Close modal on clicking backdrop
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          successModal.classList.remove('active');
        }
      });
    }
  }

  function showFormMessage(msg, type) {
    formMsg.innerText = msg;
    formMsg.className = `form-message ${type}`;
    formMsg.style.display = 'block';
    
    // Auto scroll to message
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- 7. GSAP SCROLL AND JUMPING ANIMATIONS ---
  // Ensure GSAP and ScrollTrigger are loaded before initializing animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Dynamic stats counter function
    const animateCounters = () => {
      const stats = document.querySelectorAll('.stat-num');
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-val'));
        const obj = { value: 0 };
        
        gsap.to(obj, {
          value: target,
          duration: 2.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stats-bar',
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          onUpdate: () => {
            if (target === 5000) {
              stat.innerText = Math.floor(obj.value) + '+';
            } else if (target === 10 || target === 15) {
              stat.innerText = Math.floor(obj.value) + '+';
            } else if (target === 99) {
              stat.innerText = Math.floor(obj.value) + '%';
            } else {
              stat.innerText = Math.floor(obj.value);
            }
          }
        });
      });
    };
    animateCounters();

    // Hero Section Animations
    const heroTl = gsap.timeline();
    heroTl.from('.hero-badge', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })
    .from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-desc', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-buttons', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-img-container', {
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.2)'
    }, '-=1')
    .from('.h-card-1', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.6')
    .from('.h-card-2', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.5)'
    }, '-=0.8')
    .from('.scroll-indicator', {
      y: -20,
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'power1.inOut'
    }, '-=0.2');

<<<<<<< HEAD
<<<<<<< HEAD
    // Services Cards Scroll Trigger
    gsap.from('.service-card', {
=======
    // Services Cards Scroll Trigger disabled for debugging
    /* gsap.from('.service-card', {
>>>>>>> f3518166cbe8d6ae52484a05c2c917815127ed21
=======
    // Services Cards Scroll Trigger
    gsap.from('.service-card', {
>>>>>>> 0164d91 (Just a previous page of different colour)
      scrollTrigger: {
        trigger: '#services',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
<<<<<<< HEAD
<<<<<<< HEAD
    });
=======
    }); */
>>>>>>> f3518166cbe8d6ae52484a05c2c917815127ed21
=======
    });
>>>>>>> 0164d91 (Just a previous page of different colour)

    // About Us Left-Right slide trigger
    gsap.from('.about-img-container', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
      },
      x: -80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.about-experience-badge', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
      },
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'back.out(2)'
    });

    gsap.from('.about-info-content > *', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Testimonials Card trigger
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '#testimonials',
        start: 'top 75%',
      },
      scale: 0.95,
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Contact Section triggers
    gsap.from('.booking-form-wrapper', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.contact-info > *', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
      },
      x: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // FAQ Section trigger
    gsap.from('.faq-item', {
      scrollTrigger: {
        trigger: '#faq',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Interactive mouse glow follower
    const mouseGlow = document.getElementById('mouseGlow');
    if (mouseGlow) {
      // Start in the center of the screen
      gsap.set(mouseGlow, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

      window.addEventListener('mousemove', (e) => {
        gsap.to(mouseGlow, {
          x: e.clientX,
          y: e.clientY,
          duration: 1.5,
          ease: 'power2.out'
        });
      });
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
// Theme toggle logic
const themeBtn = document.getElementById('themeToggleBtn');
if (themeBtn) {
  // Determine initial theme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLight = savedTheme ? savedTheme === 'light' : !prefersDark;
  if (isLight) {
    document.body.classList.add('light-theme');
  }
  // Click handler to toggle theme
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const nowLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', nowLight ? 'light' : 'dark');
  });
}

>>>>>>> f3518166cbe8d6ae52484a05c2c917815127ed21
=======
>>>>>>> 0164d91 (Just a previous page of different colour)
  } else {
    // Fallback counter if GSAP is not available
    const animateFallbacks = () => {
      const stats = document.querySelectorAll('.stat-num');
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-val'));
        let current = 0;
        const increment = target / 50;
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(interval);
            if (target === 5000 || target === 10 || target === 15) {
              stat.innerText = target + '+';
            } else if (target === 99) {
              stat.innerText = target + '%';
            } else {
              stat.innerText = target;
            }
          } else {
            stat.innerText = Math.floor(current);
          }
        }, 30);
      });
    };

    // Trigger standard fallback counters with intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateFallbacks();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) observer.observe(statsBar);
  }

});
