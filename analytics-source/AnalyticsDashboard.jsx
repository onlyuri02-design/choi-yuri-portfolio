import React,{useEffect,useState,useCallback,useRef} from 'react';
import {MetricCard,DataComponent,EvidenceChart,SortableItem,SortableRegion} from '../../data-app-public.jsx';
import './live.css';
import world from './world-countries.json';
const today=()=>new Date(Date.now()+9*3600000).toISOString().slice(0,10);
const clock=s=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(s));
const date=s=>new Date(new Date(s).getTime()+9*3600000).toISOString().slice(0,10);
const names={'/#home':'Home','/#work':'Work','/#cv':'GET MY CV','/#cv/summary':'Career summary','/#process':'Work Process','/#press':'Media & Press','/#project':'프로젝트','/#case':'케이스 스터디','/notes':'Notes','/#case/yuriyuri':'YURI&YURI','/#case/dkma':'DKMA','/#case/chaeum':'THE CHAEUM','/#case/madeca-md':'MADECA MD','/notes#note/nike-heritage':'나이키 · 헤리티지'};
const label=p=>names[p]||p.replace('/notes#note/','노트 · ').replace('/#case/','케이스 · ').replace('/#project/','프로젝트 · ');
const countries=new Intl.DisplayNames(['ko'],{type:'region'});
const country=c=>/^[A-Z]{2}$/.test(c)?countries.of(c):'지역 확인 불가';
const flag=c=>/^[A-Z]{2}$/.test(c)?String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt(0))):'—';
const place=r=>[country(r.country),r.region!=='Unknown'?r.region:null,r.city!=='Unknown'&&r.city!==r.region?r.city:null].filter(Boolean).join(' · ');
function Bars({id,title,queryId,rows,field,value,note,busy,empty='기록 없음',...layout}){
 const maximum=Math.max(1,...rows.map(r=>Number(r[value])||0));
 return <SortableItem id={id} span={12} label={title} {...layout}><DataComponent id={id} title={title} queryId={queryId} kind="chart" variant="plain" sourceRows={rows} displayRows={rows} loading={busy}><div className="sq-bars" data-reviewed-rows>{rows.map((r,i)=><div className="sq-bar-row" key={String(r[field])+i}><div className="sq-bar-label">{r[field]}</div><div className="sq-bar-line"><span className="sq-bar-track" aria-hidden="true"><span style={{width:(Number(r[value])||0)/maximum*100+'%'}}/></span><strong>{Number(r[value]).toLocaleString()}</strong></div></div>)}</div>{!busy&&!rows.length&&<p className="analytics-note">{empty}</p>}{note&&<p className="analytics-note">{note}</p>}</DataComponent></SortableItem>;
}
function Geography({rows,busy,id,...layout}){
 const [selected,setSelected]=useState('');
 const totals=Object.values(rows.reduce((out,r)=>{const code=r.country;out[code]??={country:code,name:country(code),visits:0};out[code].visits+=r.visits;return out;},{})).sort((a,b)=>b.visits-a.visits);
 const scope=selected?rows.filter(r=>r.country===selected):rows;
 const values=new Map(totals.map(r=>[r.country,r.visits])),max=Math.max(1,...values.values());
 return <SortableItem id={id} span={12} label="접속 지역" {...layout}><DataComponent id="regions" title="접속 국가·지역 · 방문 횟수" queryId="traffic_regions_daily" kind="chart" variant="plain" sourceRows={rows} displayRows={rows} loading={busy}>
 <div className="geo-top" data-reviewed-rows>{totals.slice(0,3).map(r=><button key={r.country} aria-pressed={selected===r.country} onClick={()=>setSelected(r.country)}><strong>{r.visits}</strong><span>{flag(r.country)} {r.name}</span></button>)}</div>
 <svg className="geo-map" viewBox="0 0 560 240" role="img" aria-label="국가별 방문 횟수 지도. 회색은 기록 없음, 진할수록 방문이 많음.">{world.map(p=>{const n=values.get(p.code)||0;return <path key={p.name} d={p.d} fill={n?'var(--text)':'var(--border)'} fillOpacity={n?.35+.65*n/max:1} stroke="var(--background)" strokeWidth=".4" tabIndex={n?0:undefined} role={n?'button':undefined} aria-label={n?country(p.code)+' '+n+'회':undefined} onClick={()=>{if(n)setSelected(p.code);}} onKeyDown={e=>{if(n&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setSelected(p.code);}}}><title>{country(p.code)==='-99'?p.name:country(p.code)}: {n?n+'회':'기록 없음'}</title></path>;})}</svg>
 <div className="geo-legend"><span>연한 회색: 기록 없음</span><span>진한 색: 방문 많음</span>{selected&&<button onClick={()=>setSelected('')}>모든 국가</button>}</div>
 <div className="geo-detail" data-reviewed-rows>{(selected?scope.map(r=>({name:r.location,visits:r.visits})):totals).map((r,i)=><div key={i}><span>{r.name}</span><strong>{r.visits}회</strong></div>)}</div>
 {!busy&&!rows.length&&<p className="analytics-note">선택 기간에 지역별 방문 기록이 없습니다.</p>}
 <p className="analytics-note">지도는 국가 단위입니다. 세션의 선택 기간 첫 기록 기준. 한국 세부 지역은 서버가 제공할 때만 표시하며, 현재 도시 정보는 확인 불가입니다. 경계: Natural Earth.</p></DataComponent></SortableItem>;
}
export function LiveDashboard(){
 const [day,setDay]=useState(today),[days,setDays]=useState(1),[data,setData]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(true),[auto,setAuto]=useState(true),[selected,setSelected]=useState(''),[limit,setLimit]=useState(12),[excluded,setExcluded]=useState('확인 중');
 const generation=useRef(0);
 const refresh=useCallback(async()=>{
  const id=++generation.current;
  try{const r=await fetch('/api/analytics?day='+encodeURIComponent(day)+'&days='+days,{credentials:'same-origin',cache:'no-store'});
   if(!r.ok)throw Error(r.status===401?'소유자 계정으로 로그인해야 볼 수 있어요.':'집계를 가져오지 못했어요. 다시 시도해 주세요.');
   const next=await r.json();if(id!==generation.current)return;setData(next);setError('');
   try{localStorage.setItem('yc-analytics-excluded-v1','1');document.cookie='yc_analytics_excluded=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure';setExcluded('이 주소·브라우저의 본인 방문 제외 중');}catch{setExcluded('방문 제외 설정을 확인해 주세요');}
  }catch(e){if(id===generation.current)setError(e.message);}finally{if(id===generation.current)setBusy(false);}
 },[day,days]);
 useEffect(()=>{setData(null);setBusy(true);setSelected('');setLimit(12);refresh();return()=>{generation.current++;};},[refresh]);
 useEffect(()=>{if(!auto)return;const timer=setInterval(()=>{if(document.visibilityState==='visible')refresh();},15000);return()=>clearInterval(timer);},[auto,refresh]);
 const valid=data?.day===day&&data?.days===days,detail=valid?data.detail:null,events=valid?data.activity:[];
 const available=valid&&data.startedAt&&day>=date(data.startedAt);
 const interactions=valid&&data.interactionStartedAt&&day>=date(data.interactionStartedAt);
 const scoped=events.filter(r=>!selected||r.browser===selected),shown=scoped.slice(0,limit);
 const display=scoped.map(r=>({...r,time:clock(r.at),name:label(r.page),location:place(r)}));
 const geography=valid?data.regions.map(r=>({...r,location:place(r)})):[],history=valid?data.history:[],devices=valid?data.devices:[];
 const pages=valid?data.pages.map(r=>({...r,name:label(r.page)})):[],channels=valid?data.channels:[],clicks=valid?data.clicks.map(r=>({...r,name:r.action+' · '+label(r.page)})):[];
 const layout=[{id:'live:metrics',kind:'metrics',items:['traffic-overview']},...['active','activity-log','regions','channels','pages','devices','clicks','activity-trend'].map(id=>({id:'live:'+id,items:[id]})),{id:'live:history',items:['visitor-history','view-history']}];
 const value=k=>!valid?'—':available?Number(detail[k]||0).toLocaleString():data.startedAt?'수집 이전':'수집 대기';
 return <div className="portfolio-analytics live-dashboard">
 <div className="live-controls"><div className="period-buttons" aria-label="집계 기간">{[1,7,30].map(n=><button key={n} aria-pressed={days===n} onClick={()=>setDays(n)}>{n===1?'일별':n+'일'}</button>)}</div><label>종료일 <input aria-label="집계일" type="date" value={day} max={today()} min={data?.earliest} onChange={e=>{if(e.target.value)setDay(e.target.value);}}/></label><button onClick={()=>{setDay(today());setDays(1);}}>오늘</button><button onClick={refresh} disabled={busy}>새로고침</button><label><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/>15초 갱신</label></div>
 <div className="live-period"><span>{valid?data.from+' — '+day:day} · 한국시간</span><span role="status">{error?'갱신 오류':data?clock(data.generatedAt)+' 기준':'불러오는 중'}</span></div>
 <div className="live-owner"><span>{excluded}</span><a href="https://yurichoi.com/privacy#analytics-settings" target="_blank" rel="noreferrer">yurichoi.com·다른 기기 제외 설정 ↗</a></div>
 {error&&<div role="alert" className="live-error">{error} {data&&'아래는 마지막 확인 기록입니다.'} <a href="/signin-with-chatgpt?return_to=%2Fanalytics" target="_top">다시 로그인</a></div>}
 {data?.localPreview&&<p className="analytics-note">로컬 테스트 데이터 · 실제 사이트 방문 통계가 아닙니다.</p>}
 <p className="analytics-note">{valid&&data.startedAt?'상세 수집 시작 '+new Date(data.startedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})+' 이후 기록입니다.':'상세 기록은 기능 적용 후부터 쌓입니다.'} 방문자는 IP·브라우저 조합의 추정치로 실제 사람 수와 다를 수 있어요.{detail?.unidentified>0?' 식별 불가 조회 '+detail.unidentified+'건은 조회수에만 포함됩니다.':''}</p>
 <SortableRegion id="analytics:canvas" variant="canvas" columns={12} rows={layout} authoredRevision={3} label="방문 통계">
 <SortableItem id="traffic-overview" span={12} label="방문 요약"><div className="summary-metrics">{[["visits","방문 횟수","Visits","30분 비활동 이후 새 방문"],["visitors","추정 순방문자","Unique visitors","선택 기간 전체 중복 제거"],["views","조회수","Pageviews","새로고침·페이지 이동 포함"]].map(([id,title,en,note])=><DataComponent key={id} id={id} queryId="activity_summary" title={title} kind="metric" variant="plain" sourceRows={available?[detail]:[]} displayRows={available?[detail]:[]} loading={busy}><strong className="summary-value">{value(id)}</strong><p className="metric-note">{en}<br/>{note}</p></DataComponent>)}</div></SortableItem>
 <SortableItem id="active" span={12} label="최근 활동"><DataComponent id="active" queryId="live_presence" title="최근 5분 활동" kind="metric" variant="plain" sourceRows={valid?data.presence:[]} displayRows={valid?[{active:data.active}]:[]} loading={busy}><div className="live-presence"><i/><strong>{valid&&!error?data.active:'—'}</strong><span>개의 방문 식별값에서 활동 신호 수신<br/><small>현재 기준 · 선택 기간과 별개 · 정확한 동시 접속 인원은 아닙니다.</small></span></div></DataComponent></SortableItem>
 <SortableItem id="activity-log" span={12} label="방문 기록"><DataComponent id="activity-log" title="방문 기록 / Activity log" queryId="traffic_activity" kind="table" variant="plain" sourceRows={scoped} displayRows={display} loading={busy}>
 <div className="live-log-head"><span>{detail?detail.views+'건 중 최근 '+events.length+'건':'수집 대기'}{selected?' · 방문 ID '+selected:''}</span>{selected&&<button onClick={()=>{setSelected('');setLimit(12);}}>전체 기록으로</button>}</div>
 <div className="activity-feed" data-reviewed-rows>{shown.map((r,i)=><React.Fragment key={r.at+'-'+i}>{(i===0||date(shown[i-1].at)!==date(r.at))&&<h3>{date(r.at)}</h3>}<button className="activity-entry" disabled={!r.browser} aria-label={(r.browser?'이 방문 ID 기록 보기: ':'식별 불가: ')+label(r.page)} onClick={()=>{setSelected(r.browser);setLimit(12);}}><time dateTime={r.at}>{clock(r.at)}</time><span className="activity-flag">{flag(r.country)}</span><span className="activity-content"><span className="activity-location">{place(r)}</span><strong>{label(r.page)}</strong><small>{r.device} · {r.browser?'ID '+r.browser:'방문자 식별 불가'} · {r.channel||'유입 경로 수집 전'}</small></span><span aria-hidden="true">›</span></button></React.Fragment>)}</div>
 {!busy&&!shown.length&&<p className="live-empty">{available?'선택 기간에 수집된 방문 기록이 없습니다.':'상세 기록 수집 전입니다.'}</p>}{limit<scoped.length&&<button className="more-records" onClick={()=>setLimit(n=>n+30)}>방문 기록 더 보기 ({scoped.length-limit})</button>}
 <p className="analytics-note">IP 원문 대신 가명 방문 ID를 표시합니다. 같은 ID를 누르면 이 기간의 이동 기록을 모아 볼 수 있어요. 최대 최근 500건.</p></DataComponent></SortableItem>
 <Geography id="regions" rows={geography} busy={busy}/>
 <Bars id="channels" title="유입 경로 · 방문 횟수" queryId="traffic_channels" rows={channels} field="channel" value="visits" busy={busy} empty={interactions?'기록 없음':'유입 경로 수집 전'} note="세션의 첫 페이지 기준. 직접·출처 미상에는 앱·메신저·출처를 전달하지 않은 링크도 포함됩니다. 이전 기록은 수집 전으로 구분합니다."/>
 <Bars id="pages" title="인기 페이지 · 조회수" queryId="traffic_pages" rows={pages.slice(0,12)} field="name" value="views" busy={busy} note={pages.length>12?'상위 12개 페이지를 표시합니다.':null}/>
 <Bars id="devices" title="접속 기기 · 방문 횟수" queryId="traffic_devices" rows={devices} field="device" value="visits" busy={busy} note="세션의 선택 기간 첫 기록 기준 · 기기 유형은 브라우저 정보로 추정합니다."/>
 <Bars id="clicks" title="버튼 클릭 · CV·문의·이동" queryId="traffic_clicks" rows={clicks} field="name" value="clicks" busy={busy} empty={interactions?'수집 시작 이후 기록된 버튼 클릭이 없습니다.':'버튼 클릭 수집 전'} note="CV 열기·다운로드 버튼, 이메일·전화·인스타그램·자사몰·Work·Notes·케이스 링크. 클릭은 다운로드 성공이나 실제 문의 완료를 뜻하지 않습니다."/>
 <SortableItem id="activity-trend" span={12} label="방문 추세"><EvidenceChart id="activity-trend" title="선택 기간 · 일별 방문 횟수" queryId="traffic_trend" variant="plain" rows={valid?data.trend:[]} sourceRows={valid?data.trend:[]} height={240} loading={busy} spec={{type:'line',x:'day',y:'visits',valueDecimals:0}}><p className="analytics-note">수집된 날짜만 표시합니다. 오늘은 중간 집계입니다.</p></EvidenceChart></SortableItem>
 <SortableItem id="visitor-history" span={6} label="이전 일별 방문자"><EvidenceChart id="visitor-history" title="이전 집계 포함 · 일별 추정 방문자" queryId="traffic_daily" variant="plain" rows={history} sourceRows={history} height={210} loading={busy} spec={{type:'line',x:'day',y:'estimated_visitors',valueDecimals:0}}/></SortableItem>
 <SortableItem id="view-history" span={6} label="이전 일별 조회수"><EvidenceChart id="view-history" title="이전 집계 포함 · 일별 조회수" queryId="traffic_daily" variant="plain" rows={history} sourceRows={history} height={210} loading={busy} spec={{type:'bar',x:'day',y:'views',valueDecimals:0}}/></SortableItem>
 </SortableRegion>
 <p className="analytics-note live-foot">하단 이전 집계 차트는 날짜 선택과 무관하게 최근 30일을 보여줍니다. 과거 본인·테스트 방문을 소급해 완전히 제거한 값은 아닙니다. 다른 브라우저·기기는 각각 제외 설정이 필요하며, 미설정 테스트와 식별되지 않은 봇이 섞일 수 있어요. 상세 기록은 최근 30일만 조회합니다.</p>
 </div>;
}
