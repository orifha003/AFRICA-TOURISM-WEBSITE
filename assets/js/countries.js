document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Match navigation behavior from script.js
  if (!hamburger && !navLinks) return;

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
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
  }


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
        'pointer-events: none;',
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


  // Flag entrance animation on page open (smooth left -> right)
  // Only runs once when the page loads.
  const flagImg = document.querySelector('.flag img');
  if (flagImg) {
    flagImg.style.opacity = '0';
    flagImg.style.transform = 'translateX(-200px)';

    flagImg.animate(
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

  // Paragraph entrance animation on page open (smooth right -> left)
  // Only runs once when the page loads.
  const paragraph = document.querySelector('.paragraph');
  if (paragraph) {
    paragraph.style.opacity = '0';
    paragraph.style.transform = 'translateX(200px)';

    paragraph.animate(
      [
        { opacity: 0, transform: 'translateX(200px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );
  }

  // --- Countries pages: click a .heading and reveal only its matching content ---
  // Requirement:
  // - Hide all .content and .visual initially
  // - Clicking a .heading should show only the .content that belongs to that heading
  // - No navigation code changes

  const headings = Array.from(document.querySelectorAll('.heading'));

  if (headings.length) {
    document.querySelectorAll('.content').forEach((el) => (el.style.display = 'none'));
    document.querySelectorAll('.visual').forEach((el) => (el.style.display = 'none'));

    const openPanelForHeading = (heading) => {
      // close all
      document.querySelectorAll('.content').forEach((el) => (el.style.display = 'none'));
      document.querySelectorAll('.visual').forEach((el) => (el.style.display = 'none'));

      const headingContainer = heading.closest('.heading-container') || heading.parentElement;
      if (!headingContainer) return;

      // On these pages, .content is the next sibling after .heading-container
      let node = headingContainer.nextElementSibling;

      // Skip non-element nodes just in case (nextElementSibling already does)
      while (node) {
        // Stop if we reach another heading-container (safety)
        if (node.classList && node.classList.contains('heading-container')) break;

        if (node.classList && node.classList.contains('content')) {
          node.style.display = '';
          node.querySelectorAll('.visual').forEach((v) => (v.style.display = ''));
          break; // only one content panel should open
        }

        node = node.nextElementSibling;
      }
    };

    headings.forEach((heading) => {
      heading.style.cursor = 'pointer';
      heading.addEventListener('click', () => openPanelForHeading(heading));
    });

    // Also handle clicks on the heading-container (in case user clicks container not h3)
    document.querySelectorAll('.heading-container').forEach((container) => {
      container.style.cursor = 'pointer';
      container.addEventListener('click', (e) => {
        const heading = container.querySelector('.heading');
        if (!heading) return;
        // avoid double-trigger if the click already happened on the .heading
        if (e.target && e.target.classList && e.target.classList.contains('heading')) return;
        openPanelForHeading(heading);
      });
    });
  }
});

