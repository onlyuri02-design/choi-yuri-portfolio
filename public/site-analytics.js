/* First-party traffic counts. No client IDs; only a local opt-out preference. */
(function () {
  'use strict';
  if (window.__ycPageCounts) return;
  window.__ycPageCounts = true;
  function allowed() {
    if (['yurichoi.com','www.yurichoi.com'].indexOf(location.hostname) === -1) return false;
    if (navigator.webdriver === true || /bot|crawler|spider|headless|preview|playwright|puppeteer|selenium|webdriver/i.test(navigator.userAgent || '')) return false;
    if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return false;
    if (/(?:^|;\s*)yc_analytics_excluded=1(?:;|$)/.test(document.cookie || '')) return false;
    try { return localStorage.getItem('yc-analytics-excluded-v1') !== '1'; } catch (_) { return false; }
  }
  window.__ycAnalyticsAllowed = allowed;
  // Remove the previous GA preferences and cookies; no new cookies are created.
  window['ga-disable-G-KSBEQSBXZL'] = true;
  try { localStorage.removeItem('yc-analytics-consent-v1'); } catch (_) {}
  document.cookie.split(';').map(function (c) { return c.trim().split('=')[0]; })
    .filter(function (n) { return /^_ga(?:_|$)/.test(n); }).forEach(function (n) {
      ['', location.hostname, '.' + location.hostname, '.yurichoi.com'].forEach(function (domain) {
        document.cookie = n + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  var lastPage = '';
  var sourceHost='';
  try { sourceHost=document.referrer?new URL(document.referrer).hostname:''; } catch (_) {}
  var timer;
  var notes = ['travel','tailoring','fandom','fragrance','alpha','alpha-offline','beauty','vacation','grinder','fashion','beetle','lemme','trend','glp1-fashion','ai-wellness','nike-heritage'];
  // Keep historical aggregate/detail keys stable after the public URL migration.
  function legacyRoute(){
    var path=location.pathname.replace(/\/$/,'')||'/';
    if(/^\/notes\//.test(path))return '/notes#note/'+path.slice(7);
    if(path==='/notes')return path+location.hash;
    if(path==='/'||path==='/final-preview')return '/'+(location.hash||'#home');
    return '/#'+path.slice(1);
  }
  function pageKey() {
    if (/^\/notes(?:\/|$)/.test(location.pathname)) {
      var detail = document.getElementById('detail');
      var slug = location.pathname.replace(/^\/notes\/?/,'')||location.hash.replace(/^#note\//, '');
      return detail && !detail.hidden && getComputedStyle(detail).display !== 'none' && notes.indexOf(slug) !== -1
        ? '/notes#note/' + slug : '/notes';
    }
    if (location.pathname !== '/' && location.pathname !== '/final-preview' && !/^\/(work|process|press|cv|project|case)(?:\/|$)/.test(location.pathname)) return '';
    var route = legacyRoute().replace('/#','');
    var aliases = { resume: 'home', portfolio: 'work', business: 'process', leadership: 'project', profitability: 'project', 'business-strategy': 'project' };
    var section = aliases[route] || route.split('/')[0] || 'home';
    return '/#' + (['home','work','process','press','cv','project','case'].indexOf(section) !== -1 ? section : 'home');
  }
  function count() {
    if (!allowed()) return;
    // Check on every navigation, including changes made in another tab.
    try { if (localStorage.getItem('yc-analytics-excluded-v1') === '1') return; } catch (_) {}
    if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
    if (document.visibilityState === 'hidden') return;
    var page = pageKey();
    var navigation = location.pathname + location.hash;
    if (!page || navigation === lastPage) return;
    lastPage = navigation;
    fetch('/api/page-view', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: page, route: legacyRoute(), referrer:sourceHost }), credentials: 'same-origin',
      referrerPolicy: 'no-referrer', keepalive: true
    }).catch(function () { /* Counting must not interrupt the website. */ });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(count, 250); }
  window.addEventListener('hashchange', schedule);
  window.addEventListener('popstate', schedule);
  window.addEventListener('yc:navigation', schedule);
  window.addEventListener('pageshow', function (event) { if (event.persisted) { lastPage = ''; schedule(); } });
  document.addEventListener('visibilitychange', schedule);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  // Only named navigation/contact actions. Never send link addresses, form values or text.
  document.addEventListener('click',function(event){
    if (!allowed()) return;
    try { if(localStorage.getItem('yc-analytics-excluded-v1')==='1')return; }catch(_){return;}
    if(navigator.globalPrivacyControl||navigator.doNotTrack==='1'||location.hostname==='localhost'||location.hostname==='127.0.0.1')return;
    var a=event.target.closest&&event.target.closest('a[href],.revision-cv-form button[type="submit"]');if(!a)return;
    var href=a.getAttribute('href')||'',action='';
    if(a.matches('.revision-cv-form button[type="submit"]'))action='CV 다운로드 버튼';
    else if(/^mailto:/i.test(href))action='이메일 문의';
    else if(/^tel:/i.test(href))action='전화 문의';
    else {try{var u=new URL(href,location.href);
      if(/(^|\.)instagram\.com$/.test(u.hostname))action='인스타그램';
      else if(/(^|\.)yuriyuri\.co\.uk$/.test(u.hostname)||/(^|\.)yuriyuri\.com$/.test(u.hostname))action='YURI&YURI 방문';
      else if(u.origin===location.origin){
        if(u.pathname==='/api/cv/download')action='CV 다운로드 버튼';
        else if(/^#cv(?:\/|$)/.test(u.hash)||/^\/cv(?:\/|$)/.test(u.pathname))action='CV 열기';
        else if(u.hash==='#work'||u.pathname==='/work')action='Work 열기';
        else if(u.pathname==='/notes')action='Notes 열기';
        else if(/^#case\//.test(u.hash)||/^\/case\//.test(u.pathname))action='케이스 상세';
      }
    }catch(_){}}
    var page=pageKey();if(!page||!action)return;
    fetch('/api/page-view',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',referrerPolicy:'no-referrer',keepalive:true,
      body:JSON.stringify({page:page,route:legacyRoute(),kind:'click',action:action})}).catch(function(){});
  },true);
  // Presence is a separate signal: heartbeats never add a view or visitor.
  var lastInteraction = Date.now();
  ['pointerdown','keydown','scroll','touchstart'].forEach(function (name) {
    document.addEventListener(name,function(){lastInteraction=Date.now();},{passive:true});
  });
  if (typeof setInterval === 'function') setInterval(function () {
    if (!allowed()) return;
    try { if (localStorage.getItem('yc-analytics-excluded-v1') === '1') return; } catch (_) { return; }
    if (navigator.globalPrivacyControl || navigator.doNotTrack === '1' || document.visibilityState !== 'visible' ||
      (document.hasFocus && !document.hasFocus()) || Date.now()-lastInteraction>60000 ||
      location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
    var page=pageKey(); if(!page || !lastPage) return;
    fetch('/api/page-view',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
      body:JSON.stringify({page:page,route:legacyRoute(),kind:'heartbeat'}),referrerPolicy:'no-referrer',keepalive:true}).catch(function(){});
  },30000);
  // Reuse the same validated, aggregate route names for foreground-time counts.
  window.__ycEngagementPageKey = pageKey;
  var engagement = document.createElement('script');
  engagement.src = '/site-engagement.js';
  document.head.appendChild(engagement);
})();
