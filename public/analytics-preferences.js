(function () {
  'use strict';
  var key = 'yc-analytics-excluded-v1';
  var status = document.getElementById('analytics-status');
  var exclude = document.getElementById('analytics-exclude');
  var include = document.getElementById('analytics-include');
  if (!status || !exclude || !include) return;
  function render() {
    try {
      var excluded = localStorage.getItem(key) === '1' || /(?:^|;\s*)yc_analytics_excluded=1(?:;|$)/.test(document.cookie||'');
      status.textContent = excluded ? '이 브라우저의 방문은 집계에서 제외 중입니다.' : '이 브라우저의 방문은 집계 대상입니다.';
      exclude.disabled = excluded;
      include.disabled = !excluded;
    } catch (_) {
      status.textContent = '브라우저 저장소에 접근할 수 없어 설정을 확인할 수 없습니다.';
    }
  }
  function setExcluded(value) {
    try {
      if (value) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
      document.cookie='yc_analytics_excluded='+(value?'1':'')+'; Path=/; Max-Age='+(value?'31536000':'0')+'; SameSite=Lax; Secure';
      render();
      fetch('/api/analytics/exclude-self',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({excluded:value})}).then(function(response){
        if(!response.ok)throw Error('Server exclusion failed');return response.json();
      }).then(function(result){
        if(result.excluded){localStorage.setItem(key,'1');render();status.textContent=result.registered?'이 브라우저의 방문은 서버에서도 제외 중입니다. 식별 가능한 기존 상세 기록도 집계에서 제외됩니다.':'이 브라우저의 이후 방문은 제외 중입니다. 기존 기록의 서버 식별은 불가합니다.';}
      }).catch(function(){status.textContent='브라우저 제외는 저장됐지만 서버 제외 등록에 실패했습니다. 새로고침 후 다시 시도해 주세요.';exclude.disabled=false;});
    } catch (_) {
      status.textContent = '설정이 저장되지 않았습니다. 브라우저의 사이트 저장소 허용 여부를 확인해 주세요.';
    }
  }
  exclude.addEventListener('click', function () { setExcluded(true); });
  include.addEventListener('click', function () { setExcluded(false); });
  window.addEventListener('storage', render);
  render();
  // Upgrade a previously saved browser-only preference to the server registry.
  try { if(localStorage.getItem(key)==='1'||/(?:^|;\s*)yc_analytics_excluded=1(?:;|$)/.test(document.cookie||''))setExcluded(true); } catch (_) {}
})();
