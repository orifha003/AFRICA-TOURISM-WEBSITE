document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      // Ensure the mobile menu actually becomes visible when toggling
      navLinks.classList.toggle('active');

      // Debug/safety: if the element is missing the active class for any reason, force it
      if (
        navLinks.classList.contains('active') !==
        hamburger.classList.contains('active')
      ) {
        navLinks.classList.add('active');
      }
    });

    // Close the menu after clicking a link (mobile UX)
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ===============================
  // Realtime footer timestamp (center + gold)
  // (moved from header per request)
  // ===============================
  const footer = document.querySelector('footer.footer');
  if (footer) {
    const pad2 = (n) => String(n).padStart(2, '0');

    let stampEl = footer.querySelector('#realtime-stamp');
    if (!stampEl) {
      stampEl = document.createElement('div');
      stampEl.id = 'realtime-stamp';
      stampEl.setAttribute('aria-live', 'polite');

      stampEl.style.cssText = [
        'margin: 0 auto;',
        'font-size: 0.85rem;',
        'font-weight: 700;',
        'color: #d4af37;',
        'text-align: center;',
        'width: 100%;',
        'pointer-events: none;'
      ].join('');

      footer.appendChild(stampEl);
    }

    const updateStamp = () => {
      const now = new Date();
      const stamp = [
        now.getFullYear(), '-', pad2(now.getMonth() + 1), '-', pad2(now.getDate()),
        ' ', pad2(now.getHours()), ':', pad2(now.getMinutes()), ':', pad2(now.getSeconds())
      ].join('');
      stampEl.textContent = `Live: ${stamp}`;
    };

    updateStamp();
    setInterval(updateStamp, 1000);
  }

  // ===============================
  // Enquiry form validation rules
  // ===============================
  const form = document.querySelector('form.enquiry-form') || document.querySelector('form');
  if (form) {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    const setInvalid = (el, msg) => {
      if (!el) return;
      el.setCustomValidity(msg || 'Invalid value');
    };

    const clearInvalid = (el) => {
      if (!el) return;
      el.setCustomValidity('');
    };

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const v = nameInput.value.trim();
        if (v.length < 3) setInvalid(nameInput, 'Full name must be at least 3 characters.');
        else clearInvalid(nameInput);
      });

      const v = nameInput.value.trim();
      if (v.length < 3) setInvalid(nameInput, 'Full name must be at least 3 characters.');
    }

    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailInput.addEventListener('input', () => {
        const v = emailInput.value.trim();
        if (!emailRegex.test(v)) setInvalid(emailInput, 'Please enter a valid email address.');
        else clearInvalid(emailInput);
      });

      const v = emailInput.value.trim();
      if (v && !emailRegex.test(v)) setInvalid(emailInput, 'Please enter a valid email address.');
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const v = phoneInput.value.trim();
        // Optional field: validate only when user types something
        if (!v) {
          clearInvalid(phoneInput);
          return;
        }
        const phoneRegex = /^[0-9+()\s-]{7,}$/;
        if (!phoneRegex.test(v)) setInvalid(phoneInput, 'Please enter a valid phone number.');
        else clearInvalid(phoneInput);
      });
    }

    if (messageInput) {
      messageInput.addEventListener('input', () => {
        const v = messageInput.value.trim();
        if (v.length < 10) setInvalid(messageInput, 'Message must be at least 10 characters.');
        else clearInvalid(messageInput);
      });

      const v = messageInput.value.trim();
      if (v.length < 10) setInvalid(messageInput, 'Message must be at least 10 characters.');
    }

    const showErrorReEnter = () => {
      const box = form.querySelector('.form-feedback') || (() => {
        const b = document.createElement('div');
        b.className = 'form-feedback';
        b.setAttribute('role', 'alert');
        b.style.cssText = [
          'margin-top: 16px;',
          'padding: 12px 14px;',
          'border-radius: 10px;',
          'font-weight: 700;',
          'letter-spacing: 0.3px;',
          'background: rgba(255, 80, 80, 0.18);',
          'color: #ffb3b3'
        ].join('');
        form.appendChild(b);
        return b;
      })();

      box.textContent = 'ERROR PLEASE RE ENTER!!!';
    };

    // ===============================
    // Dynamically load enquiry form content
    // (only injects a textarea+message container if missing)
    // ===============================
    const mountDynamicContent = () => {
      if (!form) return;

      // If a message placeholder/slot is missing, inject it before the submit button.
      const messageEl = form.querySelector('textarea[name="message"]');
      if (!messageEl) {
        const enquiryMessageWrap = document.createElement('div');
        enquiryMessageWrap.className = 'enquiry-message';

        enquiryMessageWrap.innerHTML = `
          <label for="message">Message:</label>
          <textarea name="message" placeholder="ENTER YOUR MESSAGE" ></textarea>
          <i class="fa-solid fa-message"></i>
        `;

        const submitBtn = form.querySelector('button[type="submit"], button[type="submit"]');
        if (submitBtn && submitBtn.parentElement) submitBtn.parentElement.insertAdjacentElement('beforebegin', enquiryMessageWrap);
        else form.appendChild(enquiryMessageWrap);
      }

      // Refresh references after injection
      const freshMessageInput = form.querySelector('textarea[name="message"]');
      if (freshMessageInput && messageInput !== freshMessageInput) {
        // rebind local variable
        messageInput = freshMessageInput;
      }
    };

    mountDynamicContent();

    form.addEventListener('submit', (e) => {
      if (nameInput) {
        const v = nameInput.value.trim();
        if (v.length < 3) {
          e.preventDefault();
          nameInput.reportValidity();
          showErrorReEnter();
          return;
        }
      }

      if (emailInput) {
        const v = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(v)) {
          e.preventDefault();
          emailInput.reportValidity();
          showErrorReEnter();
          return;
        }
      }

      if (phoneInput) {
        const v = phoneInput.value.trim();
        if (v) {
          const phoneRegex = /^[0-9+()\s-]{7,}$/;
          if (!phoneRegex.test(v)) {
            e.preventDefault();
            phoneInput.reportValidity();
            showErrorReEnter();
            return;
          }
        }
      }

      if (messageInput) {
        const v = messageInput.value.trim();
        if (v.length < 10) {
          e.preventDefault();
          messageInput.reportValidity();
          showErrorReEnter();
          return;
        }
      }
    });

  }

  // Animate contact text container on page load (left -> right)
  const contactContainer = document.querySelector('.contact-container');
  if (contactContainer) {
    // Ensure it starts from the left and is hidden before the animation begins
    contactContainer.style.opacity = '0';
    contactContainer.style.transform = 'translateX(-200px)';

    // Smooth entrance on page load only
    contactContainer.animate(
      [
        { opacity: 0, transform: 'translateX(-200px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );
  }
});


