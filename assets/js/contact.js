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

