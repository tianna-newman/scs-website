// Navbar scroll effects + mobile menu handling
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }
});

// Homepage hero: "Learn More" button reveals video
document.addEventListener("DOMContentLoaded", function () {
  const learnMoreBtn = document.getElementById("learn-more-btn");
  const heroSection = document.querySelector(".hero-fullscreen");

  if (learnMoreBtn && heroSection) {
    learnMoreBtn.addEventListener("click", function () {
      heroSection.classList.add("show-video");
    });
  }
});

// Services page: service-hero card "Learn More" functionality
document.addEventListener("DOMContentLoaded", function () {
  const serviceHeroes = document.querySelectorAll(".service-hero");

  if (!serviceHeroes.length) return;

  serviceHeroes.forEach((hero) => {
    const btn = hero.querySelector(".service-learn-more");
    if (!btn) return;

    const videoUrl = btn.getAttribute("data-video-url");

    btn.addEventListener("click", function () {
      if (!videoUrl) return;

      hero.classList.add("show-video");

      setTimeout(() => {
        window.open(videoUrl, "_blank");
      }, 800);

      if (hero._resetTimer) {
        clearTimeout(hero._resetTimer);
      }

      hero._resetTimer = setTimeout(() => {
        hero.classList.remove("show-video");
      }, 5000);
    });
  });
});

// Contact form validation and submission handler
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const preferredDateInput = document.getElementById("preferredDate");
  const messageInput = document.getElementById("message");
  const serviceCheckboxes = Array.from(
    form.querySelectorAll('input[name="serviceType"]')
  );
  const privacyCheckbox = document.getElementById("privacyConsent");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const phoneError = document.getElementById("phone-error");
  const serviceError = document.getElementById("service-error");
  const messageError = document.getElementById("message-error");
  const privacyError = document.getElementById("privacy-error");

  let hasSubmitted = false;
  let lastSubmitTime = 0;

  const setFieldError = (el, message, showErrors) => {
    if (!el) return;
    if (message && showErrors) {
      el.textContent = message;
      el.style.display = "block";
    } else {
      el.textContent = "";
      el.style.display = "none";
    }
  };

  const resetStatus = () => {
    if (statusEl) {
      statusEl.textContent = "";
      statusEl.style.color = "";
    }
  };

  /**
   * 校验整个表单
   * @param {boolean} showErrors 是否显示错误提示
   * @returns {{valid: boolean, selectedServices: string[]}}
   */
  const validateForm = (showErrors) => {
    let valid = true;

    const nameVal = (nameInput?.value || "").trim();
    const emailVal = (emailInput?.value || "").trim();
    const phoneVal = (phoneInput?.value || "").trim();
    const messageVal = (messageInput?.value || "").trim();

    // Name: required, <= 80 chars
    let nameMsg = "";
    if (!nameVal) {
      nameMsg = "Please enter your name.";
      valid = false;
    } else if (nameVal.length > 80) {
      nameMsg = "Name is too long (max 80 characters).";
      valid = false;
    }
    setFieldError(nameError, nameMsg, showErrors);

    // Email: required, basic format
    let emailMsg = "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      emailMsg = "Please enter your email.";
      valid = false;
    } else if (!emailPattern.test(emailVal)) {
      emailMsg = "Please enter a valid email address.";
      valid = false;
    }
    setFieldError(emailError, emailMsg, showErrors);

    // Phone: required, Australian style, 10 digits, starts 04 or 08
    let phoneMsg = "";
    const digits = phoneVal.replace(/\D/g, "");
    if (!phoneVal) {
      phoneMsg = "Please enter your phone number.";
      valid = false;
    } else if (
      digits.length !== 10 ||
      !(digits.startsWith("04") || digits.startsWith("08"))
    ) {
      phoneMsg =
        "Please enter an Australian phone number starting with 04 or 08 (10 digits).";
      valid = false;
    }
    setFieldError(phoneError, phoneMsg, showErrors);

    // Services: at least one
    const selectedServices = serviceCheckboxes
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    let serviceMsg = "";
    if (!selectedServices.length) {
      serviceMsg = "Please select at least one service type.";
      valid = false;
    }
    setFieldError(serviceError, serviceMsg, showErrors);

    // Message: required, <= 2000 chars
    let messageMsg = "";
    if (!messageVal) {
      messageMsg = "Please provide job details.";
      valid = false;
    } else if (messageVal.length > 2000) {
      messageMsg = "Job details are too long (max 2000 characters).";
      valid = false;
    }
    setFieldError(messageError, messageMsg, showErrors);

    // Privacy consent
    let privacyMsg = "";
    if (!privacyCheckbox?.checked) {
      privacyMsg = "Please confirm you agree to the Privacy Policy.";
      valid = false;
    }
    setFieldError(privacyError, privacyMsg, showErrors);

    return { valid, selectedServices };
  };

  const updateSubmitState = () => {
    const { valid } = validateForm(hasSubmitted);
    if (submitBtn) {
      submitBtn.disabled = !valid;
    }
  };

  // 监听输入变化，动态更新按钮可用状态
  if (nameInput) nameInput.addEventListener("input", () => { resetStatus(); updateSubmitState(); });
  if (emailInput) emailInput.addEventListener("input", () => { resetStatus(); updateSubmitState(); });
  if (phoneInput) phoneInput.addEventListener("input", () => { resetStatus(); updateSubmitState(); });
  if (messageInput) messageInput.addEventListener("input", () => { resetStatus(); updateSubmitState(); });

  serviceCheckboxes.forEach((cb) =>
    cb.addEventListener("change", () => {
      resetStatus();
      updateSubmitState();
    })
  );

  if (privacyCheckbox) {
    privacyCheckbox.addEventListener("change", () => {
      resetStatus();
      updateSubmitState();
    });
  }

  // 初始禁用按钮
  updateSubmitState();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hasSubmitted = true;
    resetStatus();

    const { valid, selectedServices } = validateForm(true);
    updateSubmitState();

    if (!valid) {
      return;
    }

    // 简单防刷：两次提交间隔至少 15 秒
    const now = Date.now();
    if (now - lastSubmitTime < 15000) {
      if (statusEl) {
        statusEl.textContent =
          "You are sending enquiries too quickly. Please wait a few seconds and try again.";
        statusEl.style.color = "red";
      }
      return;
    }
    lastSubmitTime = now;

    if (statusEl) {
      statusEl.textContent = "Sending...";
      statusEl.style.color = "";
    }
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    const payload = {
      name: (nameInput?.value || "").trim(),
      email: (emailInput?.value || "").trim(),
      phone: (phoneInput?.value || "").trim(),
      preferredDate: (preferredDateInput?.value || "").trim(),
      message: (messageInput?.value || "").trim(),
      serviceType: selectedServices,
      privacyConsent: !!privacyCheckbox?.checked,
    };

    try {
      const res = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        // 成功：跳转到感谢页面
        window.location.href = "thanks.html";
      } else {
        // 失败：给一点提示再跳 error.html（也可以只跳转）
        if (statusEl) {
          statusEl.textContent =
            "Failed to send. " +
            (result.error || "Please try again or contact us directly.");
          statusEl.style.color = "red";
        }
        window.location.href = "error.html";
      }
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent = "Network error — please try again later.";
        statusEl.style.color = "red";
      }
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
});
