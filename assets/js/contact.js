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
  // Contact form validation rules
  // ===============================
  const form = document.querySelector('form');
  if (form) {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    const phoneInput = form.querySelector('input[name="phone"]');

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

      // initial
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

    if (messageInput) {
      messageInput.addEventListener('input', () => {
        const v = messageInput.value.trim();
        if (v.length < 10) setInvalid(messageInput, 'Message must be at least 10 characters.');
        else clearInvalid(messageInput);
      });

      const v = messageInput.value.trim();
      if (v.length < 10) setInvalid(messageInput, 'Message must be at least 10 characters.');
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

    // Feedback + email recipient processing + final gate on submit
    const showFeedback = (msg, type) => {
      // Create feedback box if missing
      let box = form.querySelector('.form-feedback');
      if (!box) {
        box = document.createElement('div');
        box.className = 'form-feedback';
        box.setAttribute('role', 'alert');
        box.style.cssText = [
          'margin-top: 16px;',
          'padding: 12px 14px;',
          'border-radius: 10px;',
          'font-weight: 700;',
          'letter-spacing: 0.3px;'
        ].join('');
        form.appendChild(box);
      }

      const isError = type === 'error';
      box.style.backgroundColor = isError ? 'rgba(255, 80, 80, 0.18)' : 'rgba(70, 220, 120, 0.18)';
      box.style.color = isError ? '#ffb3b3' : '#b9ffd0';
      box.textContent = msg;
    };

    // (Removed accidental duplicate showErrorReEnter definition to avoid redeclaration)


    // Recipient processing (use email field as recipient if provided, otherwise fallback)
    const getRecipientEmail = () => {
      // Your form field names: phone/name/email/message
      // Here we process the email recipient using the provided email input.
      if (emailInput && emailInput.value.trim()) return emailInput.value.trim();
      return 'info@africaUNCOVERED.com';
    };

    const showErrorReEnter = () => {
      showFeedback('ERROR PLEASE RE ENTER!!!', 'error');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();


      // Clear existing invalid states quickly
      if (nameInput) nameInput.setCustomValidity('');
      if (emailInput) emailInput.setCustomValidity('');
      if (messageInput) messageInput.setCustomValidity('');
      if (phoneInput) phoneInput.setCustomValidity('');

      // Validate again (same rules)
      const nameOk = !nameInput || nameInput.value.trim().length >= 3;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailOk = !emailInput || emailRegex.test(emailInput.value.trim());
      const messageOk = !messageInput || messageInput.value.trim().length >= 10;

      // phone optional but validate if filled
      let phoneOk = true;
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      if (phoneInput && phoneVal) {
        const phoneRegex = /^[0-9+()\s-]{7,}$/;
        phoneOk = phoneRegex.test(phoneVal);
      }

      if (!nameOk) {
        if (nameInput) nameInput.setCustomValidity('Full name must be at least 3 characters.');
        nameInput && nameInput.reportValidity();
        showErrorReEnter();
        return;
      }

      if (!emailOk) {
        if (emailInput) emailInput.setCustomValidity('Please enter a valid email address.');
        emailInput && emailInput.reportValidity();
        showErrorReEnter();
        return;
      }

      if (!messageOk) {
        if (messageInput) messageInput.setCustomValidity('Message must be at least 10 characters.');
        messageInput && messageInput.reportValidity();
        showErrorReEnter();
        return;
      }

      if (!phoneOk) {
        if (phoneInput) phoneInput.setCustomValidity('Please enter a valid phone number.');
        phoneInput && phoneInput.reportValidity();
        showErrorReEnter();
        return;
      }

      // Email recipient processing functionality
      const recipient = getRecipientEmail();
      const subject = encodeURIComponent('Africa Uncovered - Contact Submission');
      const body = encodeURIComponent(
        `Name: ${nameInput ? nameInput.value.trim() : ''}\n` +
        `Email: ${emailInput ? emailInput.value.trim() : ''}\n` +
        `Phone: ${phoneInput ? phoneInput.value.trim() : ''}\n` +
        `Message: ${messageInput ? messageInput.value.trim() : ''}`
      );

      showFeedback('Submitting your message...', 'success');

      // Open mail client (no backend provided in project)
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

      showFeedback('Message ready to send. Your email client will open.', 'success');
    });
  }

  // Google interactive map (embed-free JS via iframe) - Polokwane, South Africa
  const ensureGoogleMap = () => {
    const mapHost = document.querySelector('.contact-form');
    if (!mapHost) return;

    // Create container once
    let mapWrap = mapHost.querySelector('#google-map-wrapper');
    if (!mapWrap) {
      mapWrap = document.createElement('div');
      mapWrap.id = 'google-map-wrapper';
      mapWrap.style.cssText = [
        'width: 100%;',
        'margin-top: 18px;',
        'display: flex;',
        'justify-content: center;'
      ].join('');

      // Insert just before closing main content area by appending within form section
      mapHost.appendChild(mapWrap);
    }

    // Build Maps embed URLs (no API key required)
    // Locations (as requested):
    // - Polokwane, South Africa
    // - Kruger National Park, South Africa
    // - Lion Sand Game Reserve, South Africa
    // - Victoria Falls, Zimbabwe
    // - Pony Trek Safari, Lesotho
    // - Okavango Delta, Botswana
    // - Hluhluwe / Hlane Royal National Park, Eswatini
    // - Mana Pools National Park, Zimbabwe
    const locations = [
      'polokwane, south africa',
      'kruger national park, south africa',
      'lion sand game reserve, south africa',
      'victoria falls, zimbabwe',
      'pony trekk safari, lesotho',
      'okavango delta, botswana',
      'hlane royal nation park eswatini',
      'mana pools national park, zimbabwe'
    ];

    // Create a simple multi-location map selector via iframes (first shown immediately)
    // If a previous iframe exists, reuse it.
    const query = encodeURIComponent(locations[0]);
    const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;


    // Create/replace iframe
    const iframeId = 'google-map-iframe';
    let iframe = mapWrap.querySelector(`#${iframeId}`);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.setAttribute('loading', 'lazy');
      iframe.style.cssText = [
        'width: 100%;',
        'max-width: 720px;',
        'height: 360px;',
        'border: 0;',
        'border-radius: 12px;'
      ].join('');
      iframe.allow = 'fullscreen';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      mapWrap.appendChild(iframe);
    }

    iframe.src = embedUrl;
  };

  ensureGoogleMap();

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


