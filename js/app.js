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

  // Lời nhắn từ nhà sáng tạo: hiện đầu tiên, người dùng bấm "Bắt đầu" để vào.
  function intro(root, onStart) {
    const { h, ui, topbar } = C;
    function render() {
      root.className = 'intro-page';
      root.innerHTML = '';
      const start = h('button', { class: 'btn btn-primary btn-lg intro-start', type: 'button', onclick: () => { window.scrollTo(0, 0); onStart(); }, html: `<span>${L.t('intro.start')}</span>` + ui('right') });
      root.append(
        topbar(render),
        h('main', { class: 'intro' },
          h('section', { class: 'card intro-card' },
            h('div', { class: 'intro-art', html: logo(92) + '<span class="intro-heart h1"></span><span class="intro-heart h2"></span><span class="intro-heart h3"></span>' }),
            h('div', { class: 'intro-kicker' }, L.t('intro.title')),
            h('p', { class: 'intro-body hand' }, L.t('intro.body')),
            h('div', { class: 'intro-sign hand' }, '— Close the distance'),
            start)));
      start.focus({ preventScroll: true });
    }
    render();
  }

  window.App = { logo, intro };

  function route() {
    const root = document.getElementById('app');
    const m = location.hash.match(/^#r=([A-Za-z0-9_-]+)/);
    if (m) Cook.mount(root, m[1]);
    else Composer.mount(root);
  }

  window.addEventListener('hashchange', () => location.reload());
  route();
})();
