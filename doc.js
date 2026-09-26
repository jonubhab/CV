function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}


function renderDocEntry(container, item, { logoAlt, title, meta, sub, desc }) {
  const entry = el('div', 'doc-entry');
  const logo = document.createElement('img');
  logo.className = 'doc-entry__logo';
  logo.src = item.logo;
  logo.alt = logoAlt;
  entry.appendChild(logo);

  const body = el('div', 'doc-entry__body');
  body.innerHTML = `
    <div class="doc-entry__top"><span class="doc-entry__title">${title}</span><span class="doc-entry__meta">${meta}</span></div>
    <div class="doc-entry__sub">${sub}</div>` +
    (desc !== undefined ? `<div class="doc-entry__desc">${desc}</div>` : '');
  entry.appendChild(body);
  container.appendChild(entry);
}

function render(data) {
  document.title = data.profile.name;
  document.getElementById('docPhoto').src = data.profile.photo;
  document.getElementById('docPhoto').alt = data.profile.name;
  document.getElementById('docName').textContent = data.profile.name;
  document.getElementById('docRole').textContent = data.profile.designation;
  document.getElementById('docQuick').innerHTML =
    data.profile.personalEmail + '<br>' + data.profile.phone + '<br>' + data.profile.github;


  // Contact
  const contact = document.getElementById('docContact');
  const p = data.profile;
  [['Name', p.name], ['DOB', p.dob], ['Address', p.address],
   ['Institute Email', p.instituteEmail], ['Personal Email', p.personalEmail],
   ['GitHub', p.github], ['Phone', p.phone]].forEach(([label, value]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="label">${label}</span><span class="value">${value}</span>`;
    contact.appendChild(li);
  });

  // Skills
  const skills = document.getElementById('docSkills');
  data.skills.forEach(group => {
    const g = el('div', 'doc-skill-group');
    g.appendChild(el('div', 'doc-skill-group__label', group.label));
    g.appendChild(el('div', 'doc-tag-row', group.items.join(' · ')));
    skills.appendChild(g);
  });

  // Languages
  const languages = document.getElementById('docLanguages');
  data.languages.forEach(lang => {
    const item = el('div', 'doc-lang');
    item.appendChild(el('div', 'doc-lang__name', lang.name));
    const bars = el('div', 'doc-lang__bars');
    ['speaking', 'reading', 'writing'].forEach(skill => {
      const width = lang[skill] || '50%';
      const span = document.createElement('span');
      span.innerHTML = `<span class="doc-lang__track"><span class="doc-lang__fill" style="width:${width}"></span></span>${skill.charAt(0).toUpperCase()}`;
      bars.appendChild(span);
    });
    item.appendChild(bars);
    languages.appendChild(item);
  });

  // Hobbies
  const hobbies = document.getElementById('docHobbies');
  hobbies.appendChild(el('div', 'doc-skill-group',
    '<div class="doc-skill-group__label">Music</div><div class="doc-tag-row">' + data.hobbies.music.join(' · ') + '</div>'));
  hobbies.appendChild(el('div', 'doc-skill-group',
    '<div class="doc-skill-group__label">Sports</div><div class="doc-tag-row">' + data.hobbies.sports.join(' · ') + '</div>'));

  // Education
  const education = document.getElementById('docEducation');
  data.education.forEach(item => {
    renderDocEntry(education, item, {
      logoAlt: item.institute + ' logo',
      title: item.institute,
      meta: `${item.duration}<br>${item.location}`,
      sub: `${item.degree} <br> ${item.subject}`,
      desc: `${item.result}`
    });
  });

  // Experience
  const experience = document.getElementById('docExperience');
  data.experience.forEach(item => {
    renderDocEntry(experience, item, {
      logoAlt: item.institute + ' logo',
      title: item.institute,
      meta: `${item.duration}<br>${item.location}`,
      sub: item.program,
      desc: item.description
    });
  });

  // Extracurricular
  const extracurricular = document.getElementById('docExtracurricular');
  data.extracurricular.forEach(item => {
    renderDocEntry(extracurricular, item, {
      logoAlt: item.club + ' logo',
      title: item.club,
      meta: item.duration,
      sub: item.role,
      desc: item.description
    });
  });

  // Projects
  const projects = document.getElementById('docProjects');
  data.projects.forEach(item => {
    const card = el('div', 'doc-project');
    card.innerHTML = `<div class="doc-project__name">${item.name}</div><div class="doc-project__desc">${item.description}</div>`;
    projects.appendChild(card);
  });

  // Exams
  const exams = document.getElementById('docExams');
  data.competitiveExams.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="date">${item.date}</td><td>${item.exam}</td><td>${item.institute}</td><td class="result">${item.result}</td>`;
    exams.appendChild(tr);
  });
}

async function boot() {
  document.getElementById('printBtn').addEventListener('click', () => window.print());
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    render(data);

    const params = new URLSearchParams(window.location.search);
    if (params.get('autoprint') === '1') {
      setTimeout(() => window.print(), 400);
    }
  } catch (err) {
    document.getElementById('page').innerHTML =
      '<div style="padding:40px;font-size:13px;">Could not load data.json (' + err.message + '). Serve this folder over a local server (e.g. <code>python3 -m http.server</code>) instead of opening the file directly.</div>';
  }
}

boot();
