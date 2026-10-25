import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const code=readFileSync(new URL('../public/site-engagement.js',import.meta.url),'utf8');
function fixture({excluded=false,hidden=false,focus=true,hostname='yurichoi.com',navigator={}}={}) {
  let now=0, wall=Date.parse('2026-10-07T03:00:00Z'), interval;
  const events={},timers=[],calls=[],values=new Map(excluded?[['yc-analytics-excluded-v1','1']]:[]);
  const on=(name,fn)=>{(events[name]??=[]).push(fn);};
  const context=vm.createContext({
    window:{__ycEngagementPageKey:()=>context.location.pathname==='/notes'?'/notes'+context.location.hash:'/'+context.location.hash,addEventListener:on},
    document:{visibilityState:hidden?'hidden':'visible',hasFocus:()=>focus,addEventListener:on},
    navigator,location:{hostname,pathname:'/',hash:'#home'},
    localStorage:{getItem:k=>values.get(k)??null},performance:{now:()=>now},
    Date:class extends Date {static now(){return wall+now;}},
    setInterval(fn){interval=fn;},setTimeout(fn,delay){timers.push({fn,at:now+delay});},
    fetch(url,options){calls.push({url,...JSON.parse(options.body)});return Promise.resolve();}
  });
  vm.runInContext(code,context);
  const event=(name,data={})=>(events[name]||[]).forEach(fn=>fn(data));
  function advance(ms,{tick=true}={}) {
    const target=now+ms;
    if(!tick){now=target;return;}
    while(now<target){now=Math.min(now+1000,target);for(const t of timers.filter(t=>!t.done&&t.at<=now)){t.done=true;t.fn();}interval();}
  }
  return {context,calls,values,event,advance,setFocus:v=>{focus=v;},setWall:v=>{wall=v;},total:page=>calls.filter(c=>!page||c.page===page).reduce((s,c)=>s+c.activeMs,0),starts:()=>calls.reduce((s,c)=>s+c.starts,0)};
}
test('visible focused time accumulates; background/blur do not, focus resumes same view',()=>{
  const f=fixture();assert.equal(f.starts(),1);f.advance(10000);
  f.setFocus(false);f.event('blur');assert.equal(f.total(),10000);
  f.advance(60000);assert.equal(f.total(),10000);
  f.setFocus(true);f.event('focus');f.advance(5000);f.context.document.visibilityState='hidden';f.event('visibilitychange');
  assert.equal(f.total(),15000);assert.equal(f.starts(),1);
  f.advance(60000);assert.equal(f.total(),15000);
});
test('idle stops at 60 seconds, interactions resume without backfilling idle time',()=>{
  const f=fixture();f.advance(180000);assert.equal(f.total(),60000);assert.equal(f.starts(),1);
  f.event('scroll');f.advance(10000);f.event('pagehide');assert.equal(f.total(),70000);
});
test('route transition flushes old page and starts new note; same aggregate route counts separate views',()=>{
  const f=fixture();f.advance(5000);f.context.location.pathname='/notes';f.context.location.hash='#note/travel';f.event('hashchange');f.advance(1000);f.advance(4000);f.event('pagehide');
  assert.equal(f.total('/#home'),5000);assert.equal(f.total('/notes#note/travel'),4000);assert.equal(f.starts(),2);
  assert.ok(f.calls.every(c=>c.url==='/api/page-engagement'&&c.activeMs<=15000));
});
test('excluded browser, privacy signals, local preview and initially hidden tab do not send',()=>{
  for(const options of [{excluded:true},{navigator:{doNotTrack:'1'}},{navigator:{globalPrivacyControl:true}},{hostname:'127.0.0.1'},{hostname:'localhost'},{hidden:true},{focus:false}]) {
    const f=fixture(options);f.advance(30000);f.event('pagehide');assert.equal(f.calls.length,0);
  }
});
test('cross-tab opt-out discards pending time immediately, re-inclusion starts fresh',()=>{
  const f=fixture();f.advance(8000);f.values.set('yc-analytics-excluded-v1','1');f.event('storage',{key:'yc-analytics-excluded-v1'});f.advance(30000);f.event('pagehide');assert.equal(f.total(),0);
  f.values.clear();f.event('pageshow');f.advance(5000);f.event('pagehide');assert.equal(f.total(),5000);
});
test('same-tab opt-out is checked before every flush; storage failure fails closed',()=>{
  const f=fixture();f.advance(8000);f.values.set('yc-analytics-excluded-v1','1');f.event('pagehide');assert.equal(f.total(),0);
  const g=fixture();g.advance(8000);g.context.localStorage.getItem=()=>{throw Error('blocked');};g.event('pagehide');assert.equal(g.total(),0);
});
test('pagehide plus hidden event does not double count; bfcache restore resumes without offscreen time',()=>{
  const f=fixture();f.advance(5000);f.event('pagehide');f.context.document.visibilityState='hidden';f.event('visibilitychange');f.advance(120000);assert.equal(f.total(),5000);
  f.context.document.visibilityState='visible';f.event('pageshow',{persisted:true});f.advance(5000);f.event('pagehide');assert.equal(f.total(),10000);assert.equal(f.starts(),2);
});
test('sleep gaps do not create hours of active time; KST midnight starts a new daily measurement',()=>{
  const f=fixture();f.advance(5000);f.advance(3600000,{tick:false});f.advance(1000);assert.equal(f.total(),5000);
  f.event('pointerdown');f.advance(5000);f.setWall(Date.parse('2026-10-08T03:00:00Z'));f.advance(1000);f.event('pagehide');assert.equal(f.starts(),2);assert.equal(f.total(),11000);
});
test('no personal identifiers, storage writes, or extra event data leave the browser',()=>{
  const f=fixture();f.event('pointerdown',{clientX:100,clientY:200,key:'private'});f.advance(16000);f.event('pagehide');
  assert.equal(f.values.size,0);for(const c of f.calls)assert.deepEqual(Object.keys(c),['url','page','activeMs','starts']);
});
