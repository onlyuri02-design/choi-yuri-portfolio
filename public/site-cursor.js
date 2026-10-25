(() => {
  function init() {
    if (document.getElementById('site-cursor')) return;
    const root = document.documentElement;
    const mouseAvailable = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const pointer = document.createElement('img');
    pointer.id = 'site-cursor';
    pointer.alt = '';
    pointer.setAttribute('aria-hidden', 'true');
    pointer.draggable = false;
    let ready = false;
    let frame = 0;
    let x = 0;
    let y = 0;

    function hide() {
      cancelAnimationFrame(frame);
      frame = 0;
      root.classList.remove('site-cursor-active');
    }
    function paint() {
      frame = 0;
      // Keep the cover's original size and arrow-tip hotspot on every page.
      pointer.style.transform = `translate3d(${x - 26}px, ${y - 9}px, 0)`;
      root.classList.add('site-cursor-active');
    }
    function move(event) {
      if (event.pointerType !== 'mouse' || !mouseAvailable.matches || !ready) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    pointer.addEventListener('load', () => { ready = pointer.naturalWidth > 0; });
    pointer.addEventListener('error', () => { ready = false; hide(); });
    pointer.src = '/cover-final/cursor.png';
    document.body.appendChild(pointer);
    ready = pointer.complete && pointer.naturalWidth > 0;

    // Document capture covers headers, footers, menus and newly mounted routes.
    document.addEventListener('pointermove', move, { capture: true, passive: true });
    document.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') hide();
    }, { capture: true, passive: true });
    document.addEventListener('pointerout', event => {
      if (!event.relatedTarget) hide();
    }, { capture: true, passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('pagehide', hide);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) hide();
    });
    mouseAvailable.addEventListener('change', hide);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
