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

      // Flag image slide for southAfrica.html (keep existing behavior)
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



