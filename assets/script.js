/* ============================================================
   Free Eggbert Documentation — script.js
   Shared JavaScript for navigation, theming, and search.
   ============================================================ */

'use strict';

/* ---- Navigation structure ---- */
const NAV = [
  { section: 'Getting Started' },
  { id: 'index',          label: 'Home',              href: 'index.html' },
  { id: 'overview',       label: 'Project Overview',  href: 'overview.html' },
  { id: 'getting-started',label: 'Getting Started',   href: 'getting-started.html' },
  { id: 'build',          label: 'Build & Compile',   href: 'build.html' },
  { id: 'running',        label: 'Running the Game',  href: 'running.html' },
  { id: 'platform-support',label:'Platform Support',  href: 'platform-support.html' },

  { section: 'Gameplay' },
  { id: 'gameplay',       label: 'Gameplay Overview',  href: 'gameplay.html' },
  { id: 'controls',       label: 'Controls',           href: 'controls.html' },
  { id: 'assets',         label: 'Assets & Files',     href: 'assets.html' },
  { id: 'levels',         label: 'Levels & Worlds',    href: 'levels.html' },

  { section: 'Architecture' },
  { id: 'architecture',      label: 'Architecture',       href: 'architecture.html' },
  { id: 'project-structure', label: 'Project Structure',  href: 'project-structure.html' },
  { id: 'rendering',         label: 'Rendering',          href: 'rendering.html' },
  { id: 'input',             label: 'Input System',       href: 'input.html' },
  { id: 'audio',             label: 'Audio System',       href: 'audio.html' },
  { id: 'configuration',     label: 'Configuration',      href: 'configuration.html' },

  { section: 'Reference' },
  { id: 'ref-index',        label: 'Reference Index',    href: 'reference/index.html' },
  { id: 'action-codes',     label: 'Action Codes',       href: 'reference/action-codes.html' },
  { id: 'object-types',     label: 'Object Types',       href: 'reference/object-types.html' },
  { id: 'sound-effects',    label: 'Sound Effects',      href: 'reference/sound-effects.html' },
  { id: 'game-phases',      label: 'Game Phases',        href: 'reference/game-phases.html' },
  { id: 'image-channels',   label: 'Image Channels',     href: 'reference/image-channels.html' },
  { id: 'data-structures',  label: 'Data Structures',    href: 'reference/data-structures.html' },
  { id: 'compile-flags',    label: 'Compile Flags',      href: 'reference/compile-flags.html' },
  { id: 'game-constants',   label: 'Game Constants',     href: 'reference/game-constants.html' },

  { section: 'Modules' },
  { id: 'modules-index',   label: 'Modules Index',     href: 'modules/index.html' },
  { id: 'cdecor',          label: 'CDecor',            href: 'modules/cdecor.html' },
  { id: 'cpixmap',         label: 'CPixmap',           href: 'modules/cpixmap.html' },
  { id: 'csound',          label: 'CSound',            href: 'modules/csound.html' },
  { id: 'cevent',          label: 'CEvent',            href: 'modules/cevent.html' },
  { id: 'cnetwork',        label: 'CNetwork',          href: 'modules/cnetwork.html' },
  { id: 'ui-components',   label: 'UI Components',     href: 'modules/ui.html' },
  { id: 'network-system',  label: 'Network System',    href: 'systems/network.html' },

  { section: 'Development' },
  { id: 'dev-index',       label: 'Dev Guide Index',   href: 'development/index.html' },
  { id: 'known-issues',    label: 'Known Issues',      href: 'development/known-issues.html' },
  { id: 'decompilation',   label: 'Decompilation Notes',href:'development/decompilation-notes.html' },
  { id: 'reverse-engineering', label: 'Reverse Engineering', href: 'reverse-engineering.html' },
  { id: 'vs-original',     label: 'vs. Speedy Blupi',  href: 'free-eggbert-vs-original.html' },
  { id: 'known-limitations',label:'Known Limitations', href: 'known-limitations.html' },
  { id: 'roadmap',         label: 'Roadmap',           href: 'roadmap.html' },
  { id: 'faq',             label: 'FAQ',               href: 'faq.html' },

  { section: 'Tutorials' },
  { id: 'tutorials-index', label: 'Tutorials Index',   href: 'tutorials/index.html' },
  { id: 'tut-building',    label: 'Building',          href: 'tutorials/building.html' },
  { id: 'tut-running',     label: 'Running',           href: 'tutorials/running.html' },
];

/* ---- Detect base path from <body data-depth="N"> ---- */
function getBase() {
  const depth = parseInt(document.body.dataset.depth || '0', 10);
  if (depth === 0) return './';
  return Array(depth).fill('..').join('/') + '/';
}

/* ---- Build sidebar HTML ---- */
function buildSidebar(base, activeId) {
  const lines = ['<div class="sidebar-search-wrap">',
    '<input class="sidebar-search" type="search" placeholder="Filter…" id="sidebar-filter" autocomplete="off">',
    '</div><nav class="sidebar-nav">'];

  for (const item of NAV) {
    if (item.section) {
      lines.push(`<div class="nav-section">${item.section}</div>`);
    } else {
      const active = item.id === activeId ? ' class="active"' : '';
      lines.push(`<a href="${base}${item.href}"${active} data-label="${item.label.toLowerCase()}">${item.label}</a>`);
    }
  }

  lines.push('</nav>');
  return lines.join('\n');
}

/* ---- Build header HTML ---- */
function buildHeader(base) {
  return `<div class="header-inner">
  <button id="menu-toggle" aria-label="Toggle menu">☰</button>
  <a href="${base}index.html" class="site-logo">
    <span class="logo-egg"></span>
    Free Eggbert Docs
  </a>
  <div class="header-spacer"></div>
  <div class="header-search">
    <input id="search-input" type="search" placeholder="Search…" autocomplete="off">
  </div>
  <button id="theme-toggle" aria-label="Toggle dark mode">🌙 Dark</button>
</div>`;
}

/* ---- Dark mode ---- */
function initTheme() {
  const stored = localStorage.getItem('fe-docs-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeBtn(theme);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('fe-docs-theme', next);
  updateThemeBtn(next);
}

/* ---- Sidebar filter ---- */
function initSidebarFilter() {
  const input = document.getElementById('sidebar-filter');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('#sidebar .sidebar-nav a').forEach(a => {
      const label = a.dataset.label || a.textContent.toLowerCase();
      a.classList.toggle('hidden', q.length > 0 && !label.includes(q));
    });
  });
}

/* ---- Mobile sidebar ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  // Create overlay
  let overlay = document.getElementById('sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    overlay.style.display = open ? 'block' : 'none';
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  });
}

/* ---- Back to top ---- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.title = 'Back to top';
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Anchor links on headings ---- */
function initAnchors() {
  document.querySelectorAll('h2[id], h3[id], h4[id]').forEach(h => {
    const a = document.createElement('a');
    a.className = 'anchor';
    a.href = '#' + h.id;
    a.innerHTML = '#';
    h.appendChild(a);
  });
}

/* ---- Main init function (called from each page) ---- */
function initPage(pageId) {
  const base = getBase();

  // Inject header
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = buildHeader(base);

  // Inject sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = buildSidebar(base, pageId);

  // Theme
  initTheme();

  // Theme toggle
  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'theme-toggle') toggleTheme();
  });

  // Sidebar filter
  initSidebarFilter();

  // Mobile menu
  initMobileMenu();

  // Back to top
  initBackToTop();

  // Anchor links
  initAnchors();
}
