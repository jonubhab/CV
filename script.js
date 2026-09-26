/* ============================================================
   Digital CV — Desktop script
   Loads data.json and renders the sidebar + main content,
   handles theme toggling and the PDF download shortcut.
   ============================================================ */

(function redirectToMobileIfNeeded() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'desktop') return; // explicit opt-out
  var isNarrow = window.matchMedia('(max-width: 700px)').matches;
  var isMobileUA = /Android|iPhone|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent) && !/iPad/i.test(navigator.userAgent);
  if (isNarrow && isMobileUA) {
    window.location.replace('mobile.html');
  }
})();

const ICONS = {
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 19h16"/></svg>'
};

function isPlaceholderLink(url) {
  return !url || url === '#' || /PASTE_LINK_HERE/i.test(url);
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function viewLink(url, label) {
  const a = document.createElement('a');
  a.className = 'view-link' + (isPlaceholderLink(url) ? ' view-link--disabled' : '');
  a.href = isPlaceholderLink(url) ? '#' : url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.title = isPlaceholderLink(url) ? 'Link not added yet in data.json' : label;
  a.innerHTML = ICONS.eye + '<span>' + label + '</span>';
  return a;
}

/* ---------------- Theme ---------------- */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('cv-theme', theme); } catch (e) {}
}

function initIcons() {
  document.querySelectorAll('.icon-sun').forEach(n => n.innerHTML = ICONS.sun);
  document.querySelectorAll('.icon-moon').forEach(n => n.innerHTML = ICONS.moon);
  document.querySelectorAll('.icon-download').forEach(n => n.innerHTML = ICONS.download);
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---------------- Renderers ---------------- */

function renderProfile(data) {
  document.getElementById('topbarPhoto').src = data.profile.photo;
  document.getElementById('topbarPhoto').alt = data.profile.name;
  document.getElementById('topbarName').textContent = data.profile.name;
  document.getElementById('topbarRole').textContent = data.profile.designation;
  document.title = data.profile.name + ' — CV';
}

function renderContact(data) {
  const list = document.getElementById('contactList');
  const p = data.profile;
  const rows = [
    ['Name', p.name],
    ['Date of Birth', p.dob],
    ['Address', p.address],
    ['Institute Email', p.instituteEmail],
    ['Personal Email', p.personalEmail],
    ['GitHub', p.github],
    ['Phone', p.phone]
  ];
  rows.forEach(([label, value]) => {
    const li = document.createElement('li');
    const isLink = label === 'GitHub' || label.includes('Email');
    li.innerHTML = `<span class="label">${label}</span>` +
      (isLink
        ? `<a class="value" href="${label === 'GitHub' ? value : 'mailto:' + value}" target="_blank" rel="noopener">${value}</a>`
        : `<span class="value">${value}</span>`);
    list.appendChild(li);
  });
}

function renderSkills(data) {
  const container = document.getElementById('skillsList');
  data.skills.forEach(group => {
    const g = el('div', 'skill-group');
    g.appendChild(el('div', 'skill-group__label', group.label));
    const row = el('div', 'tag-row');
    group.items.forEach(item => row.appendChild(el('span', 'tag', item)));
    g.appendChild(row);
    container.appendChild(g);
  });
}

function renderLanguages(data) {
  const container = document.getElementById('languagesList');
  data.languages.forEach(lang => {
    const item = el('div', 'lang-item');
    item.appendChild(el('div', 'lang-item__name', lang.name));
    const bars = el('div', 'lang-bars');
    ['speaking', 'reading', 'writing'].forEach(skill => {
      const bar = el('div', 'lang-bar');
      const label = skill.charAt(0).toUpperCase() + skill.slice(1);
      const width = lang[skill] || '50%';
      bar.innerHTML = `<div class="lang-bar__track"><div class="lang-bar__fill" style="width:${width}"></div></div>${label}`;
      bars.appendChild(bar);
    });
    item.appendChild(bars);
    container.appendChild(item);
  });
}

function renderHobbies(data) {
  const container = document.getElementById('hobbiesList');
  const musicGroup = el('div', 'hobby-group');
  musicGroup.appendChild(el('div', 'hobby-group__label', 'Music'));
  const musicRow = el('div', 'tag-row');
  data.hobbies.music.forEach(item => musicRow.appendChild(el('span', 'tag', item)));
  musicGroup.appendChild(musicRow);

  const sportsGroup = el('div', 'hobby-group');
  sportsGroup.appendChild(el('div', 'hobby-group__label', 'Sports'));
  const sportsRow = el('div', 'tag-row');
  data.hobbies.sports.forEach(item => sportsRow.appendChild(el('span', 'tag', item)));
  sportsGroup.appendChild(sportsRow);

  container.appendChild(musicGroup);
  container.appendChild(sportsGroup);
}

function renderEducation(data) {
  const container = document.getElementById('educationList');
  data.education.forEach(item => {
    const entry = el('div', 'entry');
    const logo = document.createElement('img');
    logo.className = 'entry__logo';
    logo.src = item.logo;
    logo.alt = item.institute + ' logo';
    entry.appendChild(logo);

    const body = el('div', 'entry__body');
    const top = el('div', 'entry__top');
    top.appendChild(el('div', 'entry__title', item.institute));
    top.appendChild(el('div', 'entry__meta', item.duration));
    body.appendChild(top);
    body.appendChild(el('div', 'entry__loc', item.location));

    const lines = el('div', 'entry__lines');
    lines.appendChild(el('div', null, `<strong>${item.degree}</strong>`));
    lines.appendChild(el('div', null, item.subject));
    lines.appendChild(el('div', null, `${item.result}`));
    body.appendChild(lines);

    const foot = el('div', 'entry__foot');
    foot.appendChild(el('span'));

    if (item.institute==="Indian Institute of Science Education and Research (IISER)")
      foot.appendChild(viewLink(item.certificateLink, 'Transcript'));
    else
      foot.appendChild(viewLink(item.certificateLink, 'Certificate'));
    body.appendChild(foot);

    entry.appendChild(body);
    container.appendChild(entry);
  });
}

function renderExperience(data) {
  const container = document.getElementById('experienceList');
  data.experience.forEach(item => {
    const entry = el('div', 'entry');
    const logo = document.createElement('img');
    logo.className = 'entry__logo';
    logo.src = item.logo;
    logo.alt = item.institute + ' logo';
    entry.appendChild(logo);

    const body = el('div', 'entry__body');
    const top = el('div', 'entry__top');
    top.appendChild(el('div', 'entry__title', item.institute));
    top.appendChild(el('div', 'entry__meta', item.duration));
    body.appendChild(top);
    body.appendChild(el('div', 'entry__loc', item.location));
    body.appendChild(el('div', 'entry__subtitle', item.program));
    body.appendChild(el('div', 'entry__desc', item.description));

    const foot = el('div', 'entry__foot');
    foot.appendChild(el('span'));
    foot.appendChild(viewLink(item.certificateLink, 'Certificate'));
    body.appendChild(foot);

    entry.appendChild(body);
    container.appendChild(entry);
  });
}

function renderExtracurricular(data) {
  const container = document.getElementById('extracurricularList');
  data.extracurricular.forEach(item => {
    const entry = el('div', 'entry');
    const logo = document.createElement('img');
    logo.className = 'entry__logo';
    logo.src = item.logo;
    logo.alt = item.club + ' logo';
    entry.appendChild(logo);

    const body = el('div', 'entry__body');
    const top = el('div', 'entry__top');
    top.appendChild(el('div', 'entry__title', item.club));
    top.appendChild(el('div', 'entry__meta', item.duration));
    body.appendChild(top);
    body.appendChild(el('div', 'entry__subtitle', item.role));
    body.appendChild(el('div', 'entry__desc', item.description));

    entry.appendChild(body);
    container.appendChild(entry);
  });
}

function renderProjects(data) {
  const container = document.getElementById('projectsGrid');
  data.projects.forEach(item => {
    const card = el('div', 'project-card');
    const top = el('div', 'project-card__top');
    top.appendChild(el('div', 'project-card__name', item.name));
    top.appendChild(viewLink(item.github, 'Repo'));
    card.appendChild(top);
    card.appendChild(el('div', 'project-card__desc', item.description));
    container.appendChild(card);
  });
}

function renderExams(data) {
  const tbody = document.getElementById('examsBody');
  data.competitiveExams.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="date">${item.date}</td>
      <td>${item.exam}</td>
      <td>${item.institute}</td>
      <td class="result">${item.result}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ---------------- Boot ---------------- */

async function boot() {
  initIcons();
  initThemeToggle();
  // downloadBtn is a plain <a download> pointing at assets/Anubhab Sen - CV.pdf —
  // no JS needed to trigger it. To regenerate that PDF after editing data.json,
  // open doc.html locally and use its own "Download as PDF" button.

  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    renderProfile(data);
    renderContact(data);
    renderSkills(data);
    renderLanguages(data);
    renderHobbies(data);
    renderEducation(data);
    renderExperience(data);
    renderExtracurricular(data);
    renderProjects(data);
    renderExams(data);
  } catch (err) {
    document.getElementById('app').innerHTML =
      '<div class="load-note">Could not load <code>data.json</code> (' + err.message + ').<br>' +
      'If you opened this file directly, browsers block local file requests — run a tiny local server instead, e.g.<br>' +
      '<code>python3 -m http.server</code> in this folder, then open <code>http://localhost:8000</code>.</div>';
  }
}

boot();
