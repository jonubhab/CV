/* Apply the OS/browser's light-or-dark preference immediately, so
   there's no flash of the wrong theme. Loaded synchronously in
   <head>, before the stylesheet, by both index.html and
   mobile.html. There is no manual toggle — the page always
   follows the system setting, live. */
(function () {
  var query = window.matchMedia('(prefers-color-scheme: dark)');

  function applySystemTheme() {
    document.documentElement.setAttribute('data-theme', query.matches ? 'dark' : 'light');
  }

  applySystemTheme();

  // Keep it in sync if the user changes their OS/browser theme
  // while the page is open.
  if (query.addEventListener) {
    query.addEventListener('change', applySystemTheme);
  } else if (query.addListener) {
    query.addListener(applySystemTheme); // older Safari
  }
})();
