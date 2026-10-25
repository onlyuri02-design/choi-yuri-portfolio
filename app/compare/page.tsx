"use client";
import { useState } from "react";
import "./compare.css";
type View = "builder" | "resume" | "both";
export default function Compare(){
 const [view,setView]=useState<View>("builder");
 return <main className="compare-workspace"><header className="compare-toolbar"><div><strong>YURI CHOI</strong><span>DESIGN COMPARISON</span></div><nav aria-label="비교할 디자인 선택">{([["resume","A · RÉSUMÉ"],["builder","B · BUSINESS BUILDER"],["both","나란히 비교"]] as [View,string][]).map(([id,label])=><button key={id} aria-pressed={view===id} onClick={()=>setView(id)}>{label}</button>)}</nav><a href={view==="resume"?"/":"/builder"} target="_blank" rel="noreferrer">전체 화면 ↗</a></header><div className={"compare-frames "+(view==="both"?"split":"single")}><section hidden={view==="builder"} aria-label="A 레쥬메 디자인"><div className="pane-label">A / EDITORIAL RÉSUMÉ<a href="/" target="_blank" rel="noreferrer">열기 ↗</a></div><iframe src="/" title="A: 흰색 레쥬메 사이트" /></section><section hidden={view==="resume"} aria-label="B 기존 템플릿 디자인"><div className="pane-label">B / BUSINESS BUILDER<a href="/builder" target="_blank" rel="noreferrer">열기 ↗</a></div><iframe src="/builder" title="B: 기존 템플릿에 새 자료를 반영한 사이트" /></section></div></main>
}

