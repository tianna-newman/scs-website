// Navbar scroll effects + mobile menu handling
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Add 'scrolled' class when user scrolls down
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Execute once on load (handles page refresh at mid-scroll position)
  handleScroll();
  // Listen for scroll events
  window.addEventListener('scroll', handleScroll);

  // Smooth scrolling for anchor links (href="#xxx")
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Mobile menu toggle (activates if .nav-toggle is added in future)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
});

// Homepage hero: "Learn More" button reveals video
document.addEventListener('DOMContentLoaded', function () {
  const learnMoreBtn = document.getElementById('learn-more-btn');
  const heroSection = document.querySelector('.hero-fullscreen');

  if (learnMoreBtn && heroSection) {
    learnMoreBtn.addEventListener('click', function () {
      heroSection.classList.add('show-video');
    });
  }
});

// Services page: service-hero card "Learn More" functionality
// 1. Click triggers "Opening video…" state and opens YouTube in new tab
// 2. Auto-revert to original state after 5 seconds maximum
document.addEventListener('DOMContentLoaded', function () {
  const serviceHeroes = document.querySelectorAll('.service-hero');

  if (!serviceHeroes.length) return;

  serviceHeroes.forEach(hero => {
    const btn = hero.querySelector('.service-learn-more');
    if (!btn) return;

    const videoUrl = btn.getAttribute('data-video-url');

    btn.addEventListener('click', function () {
      if (!videoUrl) return;

      // Switch to "video page" state (background slides away, shows "Opening video…")
      hero.classList.add('show-video');

      // Open YouTube in new tab after 0.8s (matches CSS animation timing)
      setTimeout(() => {
        window.open(videoUrl, '_blank');
      }, 800);

      // Clear any existing reset timer to avoid duplicates
      if (hero._resetTimer) {
        clearTimeout(hero._resetTimer);
      }

      // Auto-revert to original state after 5 seconds
      hero._resetTimer = setTimeout(() => {
        hero.classList.remove('show-video');
      }, 5000);
    });
  });
});

// Contact form validation, inline error messages & submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  // Fields
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const preferredDateInput = document.getElementById('preferredDate');
  const messageInput = document.getElementById('message');
  const serviceCheckboxes = form.querySelectorAll('input[name="serviceType"]');
  const privacyCheckbox = document.getElementById('privacyConsent');

  // Error <p> elements
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const serviceError = document.getElementById('service-error');
  const messageError = document.getElementById('message-error');
  const privacyError = document.getElementById('privacy-error');

  const RATE_LIMIT_MS = 30_000; // 30 秒防刷
  let lastSubmitTime = 0;

  function setError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  function clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.style.display = 'none';
  }

  function validateForm(showErrors) {
    let valid = true;

    const nameVal = (nameInput && nameInput.value || '').trim();
    const emailVal = (emailInput && emailInput.value || '').trim();
    const phoneRaw = (phoneInput && phoneInput.value) || '';
    const msgVal = (messageInput && messageInput.value || '').trim();

    // ===== Full name =====
    if (!nameVal) {
      valid = false;
      if (showErrors) setError(nameError, 'Full name is required.');
    } else if (nameVal.length > 80) {
      valid = false;
      if (showErrors) setError(nameError, 'Full name is too long (max 80 characters).');
    } else {
      if (showErrors) clearError(nameError);
    }

    // ===== Email =====
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      valid = false;
      if (showErrors) setError(emailError, 'Email is required.');
    } else if (!emailPattern.test(emailVal)) {
      valid = false;
      if (showErrors) setError(emailError, 'Please enter a valid email address.');
    } else {
      if (showErrors) clearError(emailError);
    }

    // ===== Phone (AU only: 10 digits, starts with 04 or 08) =====
    const phoneDigits = phoneRaw.replace(/\D/g, '');
    if (!phoneDigits) {
      valid = false;
      if (showErrors) setError(phoneError, 'Phone number is required.');
    } else if (
      phoneDigits.length !== 10 ||
      !(phoneDigits.startsWith('04') || phoneDigits.startsWith('08'))
    ) {
      valid = false;
      if (showErrors) {
        setError(
          phoneError,
          'Please enter a valid Australian phone number (10 digits starting with 04 or 08).'
        );
      }
    } else {
      if (showErrors) clearError(phoneError);
    }

    // ===== Service type (at least one) =====
    const selectedServices = Array.from(serviceCheckboxes).filter(cb => cb.checked);
    if (selectedServices.length === 0) {
      valid = false;
      if (showErrors) setError(serviceError, 'Please select at least one service type.');
    } else {
      if (showErrors) clearError(serviceError);
    }

    // ===== Message / Job details =====
    if (!msgVal) {
      valid = false;
      if (showErrors) setError(messageError, 'Job details cannot be empty.');
    } else if (msgVal.length > 2000) {
      valid = false;
      if (showErrors) setError(messageError, 'Job details are too long (max 2000 characters).');
    } else {
      if (showErrors) clearError(messageError);
    }

    // ===== Privacy consent =====
    if (!privacyCheckbox || !privacyCheckbox.checked) {
      valid = false;
      if (showErrors)
        setError(
          privacyError,
          'Please tick this box so we can use your details to respond to your enquiry.'
        );
    } else {
      if (showErrors) clearError(privacyError);
    }

    // 最终统一控制按钮
    if (submitBtn) {
      submitBtn.disabled = !valid;
    }

    return valid;
  }

  // —— 实时校验：输入 / 勾选时都重新校验一次 ——
  function attachLiveValidation() {
    const inputs = [nameInput, emailInput, phoneInput, messageInput, preferredDateInput];

    inputs.forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        validateForm(true);
        if (statusEl) statusEl.textContent = '';
      });
    });

    serviceCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        validateForm(true);
        if (statusEl) statusEl.textContent = '';
      });
    });

    if (privacyCheckbox) {
      privacyCheckbox.addEventListener('change', () => {
        validateForm(true);
        if (statusEl) statusEl.textContent = '';
      });
    }
  }

  attachLiveValidation();

  // 初始跑一遍：按钮禁用，但不显示红字
  validateForm(false);

  // ===== 提交逻辑 =====
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // 提交时再校验一次，显示错误
    if (!validateForm(true)) {
      if (statusEl) {
        statusEl.textContent = 'Please fix the fields shown in red.';
        statusEl.style.color = 'red';
      }
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      if (statusEl) {
        statusEl.textContent =
          'You are sending enquiries too quickly. Please wait a moment and try again.';
        statusEl.style.color = 'red';
      }
      return;
    }
    lastSubmitTime = now;

    const selectedServices = Array.from(serviceCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      preferredDate: preferredDateInput ? preferredDateInput.value.trim() : '',
      message: messageInput.value.trim(),
      serviceType: selectedServices,
      privacyConsent: !!(privacyCheckbox && privacyCheckbox.checked)
    };

    try {
      if (statusEl) {
        statusEl.textContent = 'Sending...';
        statusEl.style.color = '';
      }

      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        // 成功：跳转感谢页
        window.location.href = 'thanks.html';
      } else {
        // 后端返回失败：跳转错误页
        window.location.href = 'error.html';
      }
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent = 'Network error — please try again later.';
        statusEl.style.color = 'red';
      }
      // 网络错误也跳错误页
      window.location.href = 'error.html';
    }
  });
});
