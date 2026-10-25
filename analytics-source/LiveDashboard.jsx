import React,{useEffect,useState,useCallback,useRef} from 'react';
import {MetricCard,DataComponent,DataTable,EvidenceChart,SortableItem,SortableRegion} from '../../data-app-public.jsx';
import './live.css';
const today=()=>new Date(Date.now()+9*3600000).toISOString().slice(0,10);
const clock=s=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(s));
const names={'/#home':'홈','/#work':'Work','/#cv':'커리어','/#cv/summary':'커리어 요약','/#process':'Work Process','/#press':'Media & Press','/#project':'프로젝트','/#case':'케이스 스터디','/notes':'Notes','/#case/yuriyuri':'YURI&YURI','/#case/dkma':'DKMA','/#case/chaeum':'THE CHAEUM','/#case/madeca-md':'MADECA MD'};
const label=p=>names[p]||p.replace('/notes#note/','노트 · ').replace('/#case/','케이스 · ').replace('/#project/','프로젝트 · ');
const countries=new Intl.DisplayNames(['ko'],{type:'region'});
const location=r=>[r.country==='Unknown'?'지역 확인 불가':countries.of(r.country),r.region!=='Unknown'?r.region:null,r.city!=='Unknown'&&r.city!==r.region?r.city:null,r.country!=='Unknown'&&r.region==='Unknown'&&r.city==='Unknown'?'세부 지역 확인 불가':null].filter(Boolean).join(' · ');
export function LiveDashboard(){
 const [day,setDay]=useState(today),[data,setData]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(true),[auto,setAuto]=useState(true),[selected,setSelected]=useState(''),[excluded,setExcluded]=useState('확인 중');
 const generation=useRef(0);
 const refresh=useCallback(async()=>{
  const id=++generation.current;
  try{const r=await fetch('/api/analytics?day='+encodeURIComponent(day),{credentials:'same-origin',cache:'no-store'});
   if(!r.ok)throw Error(r.status===401?'소유자 계정으로 로그인해야 볼 수 있어요.':'집계를 가져오지 못했어요. 다시 시도해 주세요.');
   const next=await r.json();if(id!==generation.current)return;setData(next);setError('');
   try{localStorage.setItem('yc-analytics-excluded-v1','1');document.cookie='yc_analytics_excluded=1; Path=/; Max-Age=31536000; SameSite=Lax; Secure';setExcluded('현재 주소의 이 브라우저 제외 중');}catch{setExcluded('제외 설정 저장 실패 · Privacy에서 확인');}
  }catch(e){if(id===generation.current)setError(e.message);}finally{if(id===generation.current)setBusy(false);}
 },[day]);
 useEffect(()=>{setData(null);setBusy(true);setSelected('');refresh();return()=>{generation.current++;};},[refresh]);
 useEffect(()=>{if(!auto)return;const timer=setInterval(()=>{if(document.visibilityState==='visible')refresh();},15000);return()=>clearInterval(timer);},[auto,refresh]);
 const valid=data?.day===day,row=valid?data.history.find(r=>r.day===day):null;
 const events=valid?data.activity:[],detail=valid?data.detail:null,active=valid?data.presence:[];
 const detailAvailable=valid&&data.startedAt&&day>=new Date(new Date(data.startedAt).getTime()+9*3600000).toISOString().slice(0,10);
 const scoped=events.filter(r=>!selected||r.browser===selected),display=scoped.map(r=>({...r,time:clock(r.at),name:label(r.page),location:location(r),browser:r.browser||'식별 불가'}));
 const geography=valid?data.regions.map(r=>({...r,location:location(r)})):[],history=valid?data.history:[],devices=valid?data.devices:[];
 const layout=[{id:'live:metrics',kind:'metrics',items:['visitors','views','visits','active']},{id:'live:log',items:['activity-log']},{id:'live:breakdowns',items:['regions','devices']},{id:'live:history',items:['visitor-history','view-history']}];
 return <div className="portfolio-analytics live-dashboard">
 <div className="live-controls"><label>집계일 <input aria-label="집계일" type="date" value={day} max={today()} min={data?.earliest} onChange={e=>{if(e.target.value)setDay(e.target.value);}}/></label><button onClick={()=>setDay(today())}>오늘</button><button onClick={refresh} disabled={busy}>새로고침</button><label><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/>15초 자동 갱신</label><span className="live-status" role="status"><i className={error?'error':''}/>{error?'갱신 오류':data?clock(data.generatedAt)+' 갱신 · 한국시간':'불러오는 중'}</span></div>
 <div className="live-owner"><span>{excluded} · yurichoi.com에서는 별도 설정이 필요해요.</span><a href="https://yurichoi.com/privacy#analytics-settings" target="_blank" rel="noreferrer">yurichoi.com 본인 방문 제외 설정 ↗</a></div>
 {error&&<div role="alert" className="live-error">{error} {data&&'아래는 마지막 확인 기록입니다.'} <a href="/signin-with-chatgpt?return_to=%2Fanalytics" target="_top">다시 로그인</a></div>}
 {data?.localPreview&&<p className="analytics-note">로컬 미리보기 · 아래는 로컬 테스트 저장소이며 실제 사이트 방문 통계가 아닙니다.</p>}
 <SortableRegion id="analytics:canvas" variant="canvas" columns={12} rows={layout} authoredRevision={2} label="방문 통계">
 <SortableItem id="visitors" span={3} kind="metric" label="추정 방문자"><MetricCard id="visitors" queryId="traffic_daily" title="추정 방문자" value={!valid?'—':row?row.estimated_visitors+'명':'기록 없음'} sourceRows={row?[row]:[]} displayRows={row?[row]:[]} loading={busy} description="같은 날짜의 IP·브라우저 정보를 중복 제거한 추정치. 실제 사람 수는 아닙니다."><p className="metric-note">{day} · 일별 중복 제거</p></MetricCard></SortableItem>
 <SortableItem id="views" span={3} kind="metric" label="조회수"><MetricCard id="views" queryId="traffic_daily" title="조회수" value={!valid?'—':row?row.views+'회':'기록 없음'} sourceRows={row?[row]:[]} displayRows={row?[row]:[]} loading={busy}><p className="metric-note">새로고침·다른 페이지 열람 포함</p></MetricCard></SortableItem>
 <SortableItem id="visits" span={3} kind="metric" label="방문 세션"><MetricCard id="visits" queryId="activity_summary" title="방문 세션" value={!valid?'—':detailAvailable?detail.visits+'회':data.startedAt?'수집 이전':'수집 대기'} sourceRows={detailAvailable?[detail]:[]} displayRows={detailAvailable?[detail]:[]} loading={busy} description="상세 수집 이후 추정 세션. 30분 이상 활동이 없으면 새 방문으로 구분합니다."><p className="metric-note">상세 수집 이후 · 30분 단위 구분</p></MetricCard></SortableItem>
 <SortableItem id="active" span={3} kind="metric" label="최근 활동"><MetricCard id="active" queryId="live_presence" title="최근 5분 활동" value={!valid||error?'—':data.active+'명'} sourceRows={active} displayRows={valid?[{active:data.active}]:[]} loading={busy} description="현재 기준 최근 5분간 활동 신호가 수신된 IP·브라우저 조합. 정확한 현재 접속 인원은 아닙니다."><p className="metric-note">날짜 선택과 무관한 현재 기준</p></MetricCard></SortableItem>
 <SortableItem id="activity-log" span={12} label="방문 기록"><DataComponent id="activity-log" title="최근 방문 기록" queryId="traffic_activity" kind="table" variant="card" sourceRows={scoped} displayRows={display} loading={busy}>
 <div className="live-log-head"><span>{detail?detail.views+'건 중 최근 '+events.length+'건':'상세 기록 수집 대기'}{selected?' · 선택한 브라우저만 표시':''}</span>{selected&&<button onClick={()=>setSelected('')}>전체 기록으로</button>}</div>
 <DataTable rows={display} caption="접속 시각, 페이지, 기기와 대략적인 지역" onRowSelect={r=>{if(r.browser!=='식별 불가')setSelected(r.browser);}} rowActionLabel={r=>'이 브라우저의 기록 보기: '+r.browser} columns={[{field:'time',label:'접속 시각'},{field:'name',label:'열어 본 페이지',presentation:'identity',secondaryField:'page'},{field:'location',label:'추정 지역'},{field:'device',label:'기기'},{field:'browser',label:'방문 식별값'}]}/>
 <p className="analytics-note">{data?.startedAt?'상세 기록 시작: '+new Date(data.startedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})+' · 이전 이동 경로는 복원하지 않아요.':'새 기능 적용 후 첫 집계부터 상세 기록이 쌓여요.'} {valid&&data.returning>0?'이전 날짜에도 기록된 추정 방문자 '+data.returning+'명.':''}</p></DataComponent></SortableItem>
 <SortableItem id="regions" span={7} label="접속 지역"><DataComponent id="regions" title="접속 지역" kind="table" queryId="traffic_regions_daily" variant="card" sourceRows={valid?data.regions:[]} displayRows={geography} loading={busy}><DataTable rows={geography} caption="지역별 조회수" searchable={false} columns={[{field:'location',label:'추정 지역'},{field:'views',label:'조회수'},{field:'estimated_visitors',label:'추정 방문자'}]}/><p className="analytics-note">IP 기반 추정. 실제 위치와 다를 수 있으며 도시 정보가 없으면 확인 불가로 남겨요.</p></DataComponent></SortableItem>
 <SortableItem id="devices" span={5} label="접속 기기"><DataComponent id="devices" title="접속 기기별 조회" queryId="traffic_devices" kind="table" variant="card" sourceRows={devices} displayRows={devices} loading={busy}><DataTable rows={devices} caption="기기별 조회수" searchable={false} columns={[{field:'device',label:'기기'},{field:'views',label:'조회수'}]}/><p className="analytics-note">상세 수집 이후의 조회 기준 · 이전 기록에는 기기 정보가 없어요.</p></DataComponent></SortableItem>
 <SortableItem id="visitor-history" span={6} label="일별 방문자"><EvidenceChart id="visitor-history" title="일별 추정 방문자 · 최근 30일" queryId="traffic_daily" variant="card" rows={history} sourceRows={history} height={250} loading={busy} spec={{type:'line',x:'day',y:'estimated_visitors',valueDecimals:0}}/></SortableItem>
 <SortableItem id="view-history" span={6} label="일별 조회수"><EvidenceChart id="view-history" title="일별 조회수 · 최근 30일" queryId="traffic_daily" variant="card" rows={history} sourceRows={history} height={250} loading={busy} spec={{type:'bar',x:'day',y:'views',valueDecimals:0}}/></SortableItem>
 </SortableRegion>
 <p className="analytics-note live-foot">상세 기록은 최근 30일만 보관해요. 본인 제외는 설정한 브라우저와 주소에 적용되며 다른 기기·브라우저에서는 각각 설정해야 해요. 과거 기록에서 본인·테스트 방문을 소급해 완전히 제거한 통계는 아닙니다. 추세 차트는 날짜 선택과 무관하게 최근 30일을 보여주며, 오늘은 중간 집계예요.</p>
 </div>;
}
