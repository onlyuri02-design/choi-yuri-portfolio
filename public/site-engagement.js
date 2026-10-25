/* Aggregate active foreground time. No cookies, visitor IDs or storage writes. */
(function () {
  'use strict';
  if (window.__ycEngagement || !window.__ycEngagementPageKey) return;
  window.__ycEngagement = true;
  var clock = function () { return performance.now(); };
  var day = function () { return new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10); };
  var page = '', navigation = '', date = '', pending = 0, started = false;
  var last = clock(), activity = last, running = false, leaving = false, readyAt = 0;
  function allowed() {
    if (window.__ycAnalyticsAllowed && !window.__ycAnalyticsAllowed()) return false;
    if (['yurichoi.com','www.yurichoi.com'].indexOf(location.hostname)===-1 || navigator.webdriver===true || /bot|crawler|spider|headless|preview|playwright|puppeteer|selenium|webdriver/i.test(navigator.userAgent||'')) return false;
    if (/(?:^|;\s*)yc_analytics_excluded=1(?:;|$)/.test(document.cookie||'')) return false;
    try { if (localStorage.getItem('yc-analytics-excluded-v1') === '1') return false; } catch (_) { return false; }
    return !navigator.globalPrivacyControl && navigator.doNotTrack !== '1' &&
      location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
  }
  function discard() { page = ''; navigation = ''; pending = 0; started = false; running = false; }
  function send(ms, starts) {
    if (!page || !allowed()) return;
    // Best effort, no retries: a lost reply must not duplicate time or views.
    try {
      fetch('/api/page-engagement', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page, activeMs: ms, starts: starts }),
        credentials: 'same-origin', referrerPolicy: 'no-referrer', keepalive: true
      }).catch(function () {});
    } catch (_) { /* Navigation must not depend on analytics. */ }
  }
  function accrue(now) {
    if (!allowed()) { discard(); last = now; return; }
    var delta = now - last;
    // Discard sleep/throttling gaps. Stop after 60 seconds without interaction.
    if (running && delta >= 0 && delta <= 5000) pending += Math.max(0, Math.min(now, activity + 60000) - last);
    last = now;
  }
  function flush() {
    if (!allowed()) { discard(); return; }
    var ms = Math.floor(pending);
    pending -= ms;
    while (ms > 0) { var chunk = Math.min(ms, 15000); send(chunk, 0); ms -= chunk; }
  }
  function sample() {
    var now = clock();
    accrue(now);
    if (!allowed() || leaving || now < readyAt) { running = false; return; }
    var next = window.__ycEngagementPageKey();
    var route = location.pathname + location.hash;
    var today = day();
    if (next !== page || route !== navigation || today !== date) {
      flush(); discard(); page = next; navigation = route; date = today;
    }
    running = !!page && document.visibilityState === 'visible' && document.hasFocus() && now < activity + 60000;
    if (running && !started) { started = true; send(0, 1); }
    if (pending >= 15000 || !running) flush();
  }
  function interact() {
    // Flush the idle period before resuming so idle time is never backfilled.
    sample(); activity = clock(); sample();
  }
  function routeChanged() {
    accrue(clock()); flush(); discard(); activity = clock(); readyAt = activity + 300;
    setTimeout(sample, 300);
  }
  window.addEventListener('hashchange', routeChanged);
  window.addEventListener('popstate', routeChanged);
  window.addEventListener('yc:navigation', routeChanged);
  window.addEventListener('blur', sample);
  window.addEventListener('focus', interact);
  window.addEventListener('storage', function (event) {
    if (event.key === 'yc-analytics-excluded-v1' || event.key === null) { discard(); last = clock(); activity = last; sample(); }
  });
  window.addEventListener('pagehide', function () { accrue(clock()); flush(); running = false; leaving = true; });
  window.addEventListener('pageshow', function (event) {
    leaving = false; last = clock(); activity = last;
    if (event.persisted) started = false;
    sample();
  });
  document.addEventListener('visibilitychange', function () {
    sample();
    if (document.visibilityState === 'visible') interact();
  });
  ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'].forEach(function (event) {
    document.addEventListener(event, interact, { passive: true });
  });
  setInterval(sample, 1000);
  sample();
})();
