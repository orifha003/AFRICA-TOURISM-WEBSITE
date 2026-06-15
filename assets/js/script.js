document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

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
});

