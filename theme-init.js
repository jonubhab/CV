(function () {
  var query = window.matchMedia('(prefers-color-scheme: dark)');

  function applySystemTheme() {
    document.documentElement.setAttribute('data-theme', query.matches ? 'dark' : 'light');
  }

  applySystemTheme();


  if (query.addEventListener) {
    query.addEventListener('change', applySystemTheme);
  } else if (query.addListener) {
    query.addListener(applySystemTheme); // older Safari
  }
})();
