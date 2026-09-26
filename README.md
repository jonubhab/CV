# Digital CV

A data-driven CV site with three views — desktop, mobile, and a compact
single-page printable/PDF version — all reading from one `data.json` file.

## Files

```
index.html   style.css   script.js   → desktop version
mobile.html  mobile.css  mobile.js   → mobile version
doc.html     doc.css                 → compact A4 printable/PDF version (light only)
data.json                            → all CV content — edit this, everything updates
assets/                              → photo + institute logos (placeholders included)
```

## Running it

Browsers block a plain double-clicked HTML file from `fetch()`-ing a local
JSON file (a CORS restriction on the `file://` protocol, mainly in Chrome/Edge).
So don't just double-click `index.html` — serve the folder instead. From inside
this folder, run one of:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/index.html` in your browser. (Any other
static server — VS Code's "Live Server" extension, `npx serve`, etc. — works
too.) If you skip this, each page will show a message telling you the same
thing instead of failing silently.

## Editing your data

Everything in the sidebar and main content comes from `data.json`:
`profile`, `skills`, `languages`, `hobbies`, `education`, `experience`,
`extracurricular`, `projects`, `competitiveExams`. Edit values there and
reload any of the three pages to see the change everywhere.

A few fields still need your input:

- **`assets/photo.svg`** — replace with your real photo (any image format —
  update the `profile.photo` path in `data.json` if you rename/change the
  extension, e.g. to `assets/photo.jpg`).
- **`assets/logos/*.svg`** — placeholder institute logos. Replace each file
  in place (or point the `logo` field in `data.json` at a new file).
- **`certificateLink` / `github` fields** — currently `"PASTE_LINK_HERE"`.
  Add your real Google Drive certificate links and GitHub repo links here;
  until you do, the corresponding "view" (eye icon) buttons are shown
  greyed-out and disabled.
- **`extracurricular`** — one placeholder entry is included (club name,
  duration, role, description) — duplicate the object in the array for each
  club/activity you want to add.

## How each version works

- **Desktop** (`index.html`) — sticky top bar (photo, name, designation,
  download button, dark-mode toggle) with a fixed sidebar and scrolling main
  content below it. If opened on a phone-sized screen with a mobile user
  agent, it automatically redirects to `mobile.html`. Append `?view=desktop`
  to the URL to stay on the desktop layout anyway.
- **Mobile** (`mobile.html`) — same content and features, stacked into a
  single scrolling column for portrait screens.
- **Both** default to your system's light/dark preference on first visit,
  then remember your manual toggle choice (`localStorage`) after that.
- **Compact PDF** (`doc.html`) — a single A4-sized page in light mode only,
  no view buttons. Click "Download as PDF" (or reach it via the download
  button in the top bar of the desktop/mobile versions, which opens it and
  triggers printing automatically) and choose **"Save as PDF"** in your
  browser's print dialog.
