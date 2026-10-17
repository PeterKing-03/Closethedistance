// Điều hướng: link có #r=... thì mở màn hình nấu, không thì mở màn hình soạn.
(function () {
  function logo(size = 40) {
    return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="#4A3B36" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M32 22s-9-5.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 11-9 11z" fill="#E07A5F"/>
        <rect x="6" y="32" width="8" height="6" rx="3" fill="#C9604A"/>
        <rect x="50" y="32" width="8" height="6" rx="3" fill="#C9604A"/>
        <path d="M12 28 h40 v20 a8 8 0 0 1 -8 8 h-24 a8 8 0 0 1 -8 -8z" fill="#F2CC8F"/>
        <path d="M9 28 h46"/>
        <circle cx="26" cy="40" r="1.6" fill="#4A3B36" stroke="none"/><circle cx="38" cy="40" r="1.6" fill="#4A3B36" stroke="none"/>
        <path d="M29.5 44 q2.5 2.5 5 0" stroke-width="2"/>
      </g></svg>`;
  }

  window.App = { logo };

  function route() {
    const root = document.getElementById('app');
    const m = location.hash.match(/^#r=([A-Za-z0-9_-]+)/);
    if (m) Cook.mount(root, m[1]);
    else Composer.mount(root);
  }

  window.addEventListener('hashchange', () => location.reload());
  route();
})();
