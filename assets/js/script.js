(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const nav = qs('[data-nav]');
  const navToggle = qs('[data-nav-toggle]');
  if (nav && navToggle) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    };
    navToggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (nav.contains(t) || navToggle.contains(t)) return;
      setOpen(false);
    });
    qsa('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  // Footer year
  const year = qs('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // Theme toggle (dark/light)
  const root = document.documentElement;
  const themeBtn = qs('[data-theme-toggle]');
  const storageKey = 'portfolio.theme';

  const getPreferred = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.textContent = theme === 'light' ? 'Dark' : 'Light';
  };

  try { applyTheme(getPreferred()); } catch { /* ignore */ }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(storageKey, next); } catch { /* ignore */ }
      applyTheme(next);
    });
  }

  // Projects + modal
  const projectsRoot = qs('[data-projects]');
  const modalBackdrop = qs('[data-modal-backdrop]');
  const modalTitle = qs('[data-modal-title]');
  const modalBody = qs('[data-modal-body]');
  const closeModalBtn = qs('[data-close-modal]');

  const escapeHtml = (v) => String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const renderPills = (items = []) => {
    if (!items.length) return '<span class="small">—</span>';
    return `<div class="tags">${items.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join('')}</div>`;
  };

  const renderBullets = (items = []) => {
    if (!items.length) return '<span class="small">—</span>';
    return `
      <ul style="margin:0;color:var(--muted);padding-left:18px">
        ${items.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
      </ul>
    `;
  };

  const renderLinks = (links = {}) => {
    const buttons = [];
    if (links.liveUrl) buttons.push({ label: 'Live', url: links.liveUrl });
    if (links.repoUrl) buttons.push({ label: 'Repo', url: links.repoUrl });
    if (links.docsUrl) buttons.push({ label: 'Docs', url: links.docsUrl });

    if (!buttons.length) return '';

    return `
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
        ${buttons.map((b) => `
          <a class="btn btn-ghost" href="${escapeHtml(b.url)}" target="_blank" rel="noreferrer">${escapeHtml(b.label)}</a>
        `).join('')}
      </div>
    `;
  };

  const projects = [
    {
      id: 'globalix',
      name: 'Globalix Mobile App',
      desc: 'Mobile app for the Globalix platform. Built with a modern React Native + Expo workflow and integrated with a web/admin + API stack.',
      cardTags: ['React Native', 'Expo', 'TypeScript'],
      meta: {
        runtime: ['Expo / React Native', 'Node.js (backend services)'],
        languages: ['TypeScript', 'JavaScript'],
        environments: ['iOS', 'Android', 'Web (admin/dashboard)'],
        tools: ['Expo', 'React Native', 'Next.js (admin)', 'Express.js (API)', 'PostgreSQL'],
        devops: ['Docker (service containerization)'],
        highlights: ['Cross-platform mobile UI', 'Platform architecture: mobile + admin + backend', 'Containerized service(s) via Dockerfile'],
        links: {
          repoUrl: 'https://github.com/globalix-group/globalix-mobile-app',
          docsUrl: 'https://github.com/globalix-group'
        }
      }
    },
    {
      id: 'cfcs',
      name: 'Church Financial Control System (CFCS)',
      desc: 'React web app for church finance control and reporting. Deployed as a static SPA on Vercel.',
      cardTags: ['React', 'JavaScript', 'Vercel'],
      meta: {
        runtime: ['Browser', 'Node.js (build tooling)'],
        languages: ['JavaScript'],
        environments: ['Web'],
        tools: ['React', 'Vercel (deployment)'],
        devops: ['CI/CD via Vercel'],
        highlights: ['SPA workflow', 'Production deployment on Vercel'],
        links: {
          repoUrl: 'https://github.com/Emmanuel123456789123456789/cfcs-app',
          liveUrl: 'https://cfcs-app.vercel.app'
        }
      }
    },
    {
      id: 'techzone',
      name: 'TechZone Store',
      desc: 'Front-end store demo: filters, cart, and checkout UI with localStorage.',
      cardTags: ['HTML', 'CSS', 'JavaScript'],
      meta: {
        runtime: ['Browser'],
        languages: ['JavaScript', 'HTML', 'CSS'],
        environments: ['Web'],
        tools: ['Vanilla JS', 'localStorage'],
        devops: [],
        highlights: ['Cart persistence (localStorage)', 'Product modal', 'Responsive grid'],
        links: {}
      }
    },
    {
      id: 'primehomes',
      name: 'PrimeHomes Realty',
      desc: 'Real estate listings UI with filters and property detail modal.',
      cardTags: ['HTML', 'CSS', 'JavaScript'],
      meta: {
        runtime: ['Browser'],
        languages: ['JavaScript', 'HTML', 'CSS'],
        environments: ['Web'],
        tools: ['Vanilla JS'],
        devops: [],
        highlights: ['Filter by price/location', 'Property details modal', 'Contact agent form'],
        links: {}
      }
    },
    {
      id: 'divinebites',
      name: 'Divine Bites Restaurant',
      desc: 'Multi-page restaurant website with a modern responsive layout and interactive UI sections.',
      cardTags: ['HTML', 'CSS', 'JavaScript'],
      meta: {
        runtime: ['Browser'],
        languages: ['JavaScript', 'HTML', 'CSS'],
        environments: ['Web'],
        tools: ['Vanilla JS'],
        devops: [],
        highlights: ['Multi-page structure', 'Responsive navigation', 'Clean UI sections'],
        links: {}
      }
    }
  ];

  const setModalOpen = (open) => {
    if (!modalBackdrop) return;
    modalBackdrop.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const openProject = (id) => {
    const p = projects.find((x) => x.id === id);
    if (!p || !modalTitle || !modalBody) return;

    const meta = p.meta || {};
    const links = meta.links || {};

    modalTitle.textContent = p.name;
    modalBody.innerHTML = `
      <p class="lead" style="margin:0">${escapeHtml(p.desc)}</p>
      ${renderLinks(links)}
      <div style="height:12px"></div>

      <div class="grid grid-2">
        <div class="project">
          <h3>Runtime</h3>
          ${renderPills(meta.runtime || [])}
        </div>
        <div class="project">
          <h3>Languages</h3>
          ${renderPills(meta.languages || [])}
        </div>
        <div class="project">
          <h3>Environments</h3>
          ${renderPills(meta.environments || [])}
        </div>
        <div class="project">
          <h3>Tools</h3>
          ${renderPills(meta.tools || [])}
        </div>
        <div class="project">
          <h3>DevOps</h3>
          ${renderBullets(meta.devops || [])}
        </div>
        <div class="project">
          <h3>Highlights</h3>
          ${renderBullets(meta.highlights || [])}
        </div>
      </div>
    `;

    setModalOpen(true);
  };

  if (projectsRoot) {
    const contactHref = qs('#contact') ? '#contact' : '../../#contact';

    projectsRoot.innerHTML = projects.map((p) => {
      const tags = (p.cardTags || []).slice(0, 3);
      return `
        <article class="project">
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.desc)}</p>
          <div class="tags">${tags.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join('')}</div>
          <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" type="button" data-open-project="${escapeHtml(p.id)}">View details</button>
            <a class="btn btn-ghost" href="${contactHref}">Contact</a>
          </div>
        </article>
      `;
    }).join('');

    qsa('[data-open-project]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-project');
        if (id) openProject(id);
      });
    });
  }

  if (modalBackdrop && closeModalBtn) {
    closeModalBtn.addEventListener('click', () => setModalOpen(false));
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) setModalOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    });
  }

  // Contact form (no backend)
  const contactForm = qs('[data-contact-form]');
  if (contactForm) {
    const notice = qs('[data-form-notice]');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get('name') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const message = String(fd.get('message') || '').trim();
      const okEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

      const problems = [];
      if (name.length < 2) problems.push('Please enter your name.');
      if (!okEmail(email)) problems.push('Please enter a valid email.');
      if (message.length < 10) problems.push('Please add a message (10+ characters).');

      if (notice) {
        notice.setAttribute('aria-hidden', 'false');
        if (problems.length) {
          notice.style.borderColor = 'rgba(255,107,107,.35)';
          notice.style.background = 'rgba(255,107,107,.12)';
          notice.textContent = problems[0];
          return;
        }
        notice.style.borderColor = 'color-mix(in srgb, var(--brand-2) 30%, transparent)';
        notice.style.background = 'color-mix(in srgb, var(--brand-2) 10%, transparent)';
        notice.textContent = 'Message sent (demo). I’ll reply soon.';
      }

      contactForm.reset();
    });
  }

  // Scroll reveal (IntersectionObserver)
  try {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      const revealTargets = qsa('.card, .project, .skill')
        .filter((el) => el instanceof HTMLElement)
        .filter((el) => !el.closest('.modal') && !el.closest('[data-modal-backdrop]'));

      revealTargets.forEach((el) => el.classList.add('reveal'));

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach((el) => io.observe(el));
      } else {
        revealTargets.forEach((el) => el.classList.add('is-in'));
      }
    }
  } catch { /* ignore */ }
})();
