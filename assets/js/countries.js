document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');

      // Debug/safety: if the element is missing the active class for any reason, force it
      if (navLinks.classList.contains('active') !== hamburger.classList.contains('active')) {
        navLinks.classList.add('active');
      }

      // Slide menu from left (CSS uses left: -100% and left: 0)
      if (navLinks.classList.contains('active')) {
        navLinks.style.left = '0';
      } else {
        navLinks.style.left = '-100%';
      }

      // Flag image slide for southAfrica.html
      const flagImg = document.querySelector('.flag img');
      if (flagImg) {
        const shouldOpen = navLinks.classList.contains('active');
        flagImg.style.willChange = 'transform';
        flagImg.style.transition = 'transform 420ms ease';

        if (shouldOpen) {
          flagImg.style.transform = 'translateX(-100%)';
          requestAnimationFrame(() => {
            flagImg.style.transform = 'translateX(0)';
          });
        } else {
          flagImg.style.transform = 'translateX(0)';
          flagImg.style.transition = '';
        }
      }
    });

    // Close the menu after clicking a link (mobile UX)
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navLinks.style.left = '-100%';
      });
    });
  }

  // --- Countries pages: only show .content and .visual under the clicked .heading (all screens) ---
  const headings = Array.from(document.querySelectorAll('.heading'));

  if (headings.length) {
    // Hide everything initially
    document.querySelectorAll('.content').forEach((el) => (el.style.display = 'none'));
    document.querySelectorAll('.visual').forEach((el) => (el.style.display = 'none'));

    headings.forEach((heading) => {
      heading.style.cursor = 'pointer';

      heading.addEventListener('click', () => {
        // Close all other panels first
        document.querySelectorAll('.content').forEach((el) => (el.style.display = 'none'));
        document.querySelectorAll('.visual').forEach((el) => (el.style.display = 'none'));

        const section = heading.closest('section') || document;

        // Show only blocks after the clicked heading until the next heading (or end of section)
        let node = heading.nextElementSibling;
        while (node) {
          if (node.classList && node.classList.contains('heading')) break;
          if (node.closest && node.closest('section') !== section) break;

          if (node.classList && (node.classList.contains('content') || node.classList.contains('visual'))) {
            node.style.display = '';
          }

          node = node.nextElementSibling;
        }
      });
    });
  }

});

