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

  // Flag entrance animation on page open (smooth left -> right)
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

  // countries pages: click a .heading and reveal only its matching content
  // Hide all .content and .visual initially
  // Clicking a .heading should show only the .content that belongs to that heading
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

  //  Lightbox for .visual images/videos (click to view larger)
  const ensureLightbox = () => {
    let overlay = document.querySelector('[data-lightbox-overlay="true"]');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.setAttribute('data-lightbox-overlay', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = [
      'position:fixed;',
      'inset:0;',
      'background:rgba(0,0,0,0.75);',
      'display:none;',
      'align-items:center;',
      'justify-content:center;',
      'z-index:100000;',
      'padding:20px;',
    ].join('');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'position:relative;',
      'max-width:1100px;',
      'max-height:90vh;',
      'width:100%;',
      'display:flex;',
      'align-items:center;',
      'justify-content:center;',
    ].join('');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = [
      'position:absolute;',
      'top:-12px;',
      'right:-12px;',
      'width:44px;',
      'height:44px;',
      'border-radius:50%;',
      'border:2px solid rgba(255,255,255,0.6);',
      'background:rgba(0,0,0,0.6);',
      'color:#fff;',
      'font-size:28px;',
      'line-height:40px;',
      'cursor:pointer;',
      'box-shadow:0 10px 25px rgba(0,0,0,0.4);',
    ].join('');

    const content = document.createElement('div');
    content.style.cssText = [
      'max-width:100%;',
      'max-height:90vh;',
      'display:flex;',
      'align-items:center;',
      'justify-content:center;',
    ].join('');

    panel.appendChild(closeBtn);
    panel.appendChild(content);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = () => {
      overlay.style.display = 'none';
      content.innerHTML = '';
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display === 'flex') close();
    });

    return overlay;
  };

  const overlay = ensureLightbox();
  const getOverlayContentEl = () => {
    const content = overlay.querySelector('div');
    return content;
  };

  const openInLightbox = (node) => {
    const content = getOverlayContentEl();
    if (!content) return;

    content.innerHTML = '';

    const tag = node && node.tagName ? node.tagName.toLowerCase() : '';
    if (tag === 'img') {
      const img = document.createElement('img');
      img.src = node.currentSrc || node.src;
      img.alt = node.alt || '';
      img.style.cssText = [
        'max-width:100%;',
        'max-height:90vh;',
        'border-radius:12px;',
        'box-shadow:0 18px 50px rgba(0,0,0,0.45);',
      ].join('');
      content.appendChild(img);
    } else if (tag === 'video') {
      const src = node.currentSrc || node.src;
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.cssText = [
        'max-width:100%;',
        'max-height:90vh;',
        'border-radius:12px;',
        'box-shadow:0 18px 50px rgba(0,0,0,0.45);',
      ].join('');
      if (src) video.src = src;
      // If video has <source>, clone them
      const sources = node.querySelectorAll('source');
      if (sources && sources.length) {
        sources.forEach((s) => {
          const source = document.createElement('source');
          source.src = s.src;
          source.type = s.type;
          video.appendChild(source);
        });
      }
      content.appendChild(video);
    }

    overlay.style.display = 'flex';
  };

  // Only attach when there are .visual elements
  const visuals = document.querySelectorAll('.visual');
  if (visuals.length) {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;

      // Only open when clicking an actual img/video inside .visual
      const withinVisual = target.closest && target.closest('.visual');
      if (!withinVisual) return;

      if (target.tagName && (target.tagName.toLowerCase() === 'img' || target.tagName.toLowerCase() === 'video')) {
        e.preventDefault();
        openInLightbox(target);
      }
    });
  }
});



