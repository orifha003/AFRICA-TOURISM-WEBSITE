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

 
  // Realtime footer timestamp (center + gold)
  // (moved from header per request)
  
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
});



