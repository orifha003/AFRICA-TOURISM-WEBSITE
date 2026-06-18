document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger && !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    // Ensure the mobile menu actually becomes visible when toggling
    navLinks.classList.toggle('active');

    // Debug/safety: if the element is missing the active class for any reason, force it
    if (navLinks.classList.contains('active') !== hamburger.classList.contains('active')) {
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

  // ===============================
  // Smooth enterence from the left for .about-intro
  // ===============================
  const aboutIntro = document.querySelector('.about-intro');
  if (aboutIntro) {
    aboutIntro.style.opacity = '0';
    aboutIntro.style.transform = 'translateX(-200px)';

    aboutIntro.animate(
      [
        { opacity: 0, transform: 'translateX(-200px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ],
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );
  }

  // ===============================
  // Interactive buttons for .welcome-container class
  // ===============================
  const welcomeContainerEl = document.querySelector('.welcome-container');
  if (welcomeContainerEl) {
    if (!welcomeContainerEl.querySelector('.welcome-container-card-actions')) {
      const actions = document.createElement('div');
      actions.className = 'welcome-container-card-actions';
      actions.style.cssText = [
        'display:flex;',
        'gap:12px;',
        'justify-content:center;',
        'margin-top:12px;'
      ].join('');

      const hideBtn = document.createElement('button');
      hideBtn.type = 'button';
      hideBtn.textContent = 'Hide Welcome';
      hideBtn.style.cssText = [
        'cursor:pointer;',
        'padding:10px 16px;',
        'border-radius:10px;',
        'border:1px solid rgba(0,0,0,0.15);',
        'background:rgba(0,0,0,0.06);',
        'color:#111;',
        'font-weight:700;'
      ].join('');

      const showBtn = document.createElement('button');
      showBtn.type = 'button';
      showBtn.textContent = 'Show Welcome';
      showBtn.style.cssText = [
        'cursor:pointer;',
        'padding:10px 16px;',
        'border-radius:10px;',
        'border:1px solid rgba(0,0,0,0.15);',
        'background:#d4af37;',
        'color:#111;',
        'font-weight:700;'
      ].join('');

      hideBtn.addEventListener('click', () => {
        welcomeContainerEl.style.display = 'none';
      });

      showBtn.addEventListener('click', () => {
        welcomeContainerEl.style.display = '';
      });

      welcomeContainerEl.insertAdjacentElement('afterend', actions);
      actions.appendChild(showBtn);
      actions.appendChild(hideBtn);
    }
  }

  // ===============================

  // ===============================
  // Realtime header timestamp (center + gold)

  // ===============================
  const header = document.querySelector('header.navigation');


  if (header) {
    const pad2 = (n) => String(n).padStart(2, '0');

    let stampEl = header.querySelector('#realtime-stamp');
    if (!stampEl) {
      stampEl = document.createElement('div');
      stampEl.id = 'realtime-stamp';
      stampEl.setAttribute('aria-live', 'polite');

      stampEl.style.cssText = [
        'margin: 8px auto 0 auto;',
        'font-size: 0.85rem;',
        'font-weight: 700;',
        'color: #d4af37;',
        'text-align: center;',
        'width: 100%;',
        'pointer-events: none;'
      ].join('');

      const nav = header.querySelector('nav');
      if (nav && nav.nextSibling) header.insertBefore(stampEl, nav.nextSibling);
      else header.appendChild(stampEl);
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
});


   



   
