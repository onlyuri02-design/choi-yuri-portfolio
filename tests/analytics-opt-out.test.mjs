import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const tracking = readFileSync(new URL('../public/site-analytics.js', import.meta.url), 'utf8');
const preferences = readFileSync(new URL('../public/analytics-preferences.js', import.meta.url), 'utf8');
const key = 'yc-analytics-excluded-v1';
function fixture(initial) {
  const values = new Map(initial ? [[key, '1']] : []);
  const events = {};
  const elements = Object.fromEntries(['analytics-status','analytics-exclude','analytics-include'].map(id => [id, {addEventListener(name, fn) {this[name] = fn;}}]));
  const calls = [];
  const context = vm.createContext({
    window: {addEventListener(name, fn) {events[name] = fn;}},
    document: {cookie:'',readyState:'complete',visibilityState:'visible',getElementById(id) {return elements[id];},addEventListener() {},createElement() {return {};},head:{appendChild() {}}},
    localStorage: {getItem(k) {return values.get(k) ?? null;}, setItem(k,v) {values.set(k,v);},removeItem(k) {values.delete(k);}},
    location: {hostname:'yurichoi.com',pathname:'/',hash:'#home'}, navigator: {},
    setTimeout(fn) {fn();}, clearTimeout() {}, fetch(url, options) {if(url==='/api/page-view')calls.push({url,options});return Promise.resolve({ok:true,json:async()=>({excluded:JSON.parse(options.body).excluded,registered:true})});}
  });
  return {context,events,elements,calls,values};
}
test('ordinary visitor counts; excluded browser makes no tracking request', () => {
  for (const excluded of [false,true]) {
    const f=fixture(excluded); vm.runInContext(tracking,f.context);
    assert.equal(f.calls.length,excluded ? 0 : 1);
    f.context.location.hash='#cv';f.events.hashchange();
    assert.equal(f.calls.length,excluded ? 0 : 2);
  }
});
test('exclude, reload, cross-tab navigation, and restore are reversible', () => {
  const f=fixture(false);vm.runInContext(tracking,f.context);vm.runInContext(preferences,f.context);
  f.elements['analytics-exclude'].click();
  assert.equal(f.values.get(key),'1');assert.match(f.elements['analytics-status'].textContent,/제외 중/);
  f.context.location.hash='#work';f.events.hashchange();assert.equal(f.calls.length,1);
  f.context.window.__ycPageCounts=false;vm.runInContext(tracking,f.context);assert.equal(f.calls.length,1);
  f.elements['analytics-include'].click();
  assert.equal(f.values.has(key),false);f.context.location.hash='#cv';f.events.hashchange();assert.equal(f.calls.length,2);
});
test('storage failure is shown, never falsely confirmed', () => {
  const f=fixture(false);f.context.localStorage.setItem=()=>{throw Error('blocked');};
  vm.runInContext(preferences,f.context);f.elements['analytics-exclude'].click();
  assert.match(f.elements['analytics-status'].textContent,/저장되지 않았습니다/);
});
test('hosting domains, automation and cookie-only exclusions never send a page view',()=>{
  for(const variant of ['hosting','webdriver','playwright','puppeteer','cookie']){
    const f=fixture(false);
    if(variant==='hosting')f.context.location.hostname='yuri-choi.yurinananana.chatgpt.site';
    if(variant==='webdriver')f.context.navigator.webdriver=true;
    if(variant==='playwright'||variant==='puppeteer')f.context.navigator.userAgent=variant;
    if(variant==='cookie')f.context.document.cookie='yc_analytics_excluded=1';
    vm.runInContext(tracking,f.context);assert.equal(f.calls.length,0,variant);
  }
});
