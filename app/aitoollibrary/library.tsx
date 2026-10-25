"use client";

import { useMemo, useState } from "react";
import cursorIcon from "@lobehub/icons-static-svg/icons/cursor.svg";
import lovableIcon from "@lobehub/icons-static-svg/icons/lovable-color.svg";
import codexIcon from "@lobehub/icons-static-svg/icons/codex.svg";
import claudeCodeIcon from "@lobehub/icons-static-svg/icons/claudecode-color.svg";
import adobeFireflyIcon from "@lobehub/icons-static-svg/icons/adobefirefly-color.svg";
import claudeIcon from "@lobehub/icons-static-svg/icons/claude-color.svg";
import elevenLabsIcon from "@lobehub/icons-static-svg/icons/elevenlabs.svg";
import geminiIcon from "@lobehub/icons-static-svg/icons/gemini-color.svg";
import grokIcon from "@lobehub/icons-static-svg/icons/grok.svg";
import klingIcon from "@lobehub/icons-static-svg/icons/kling-color.svg";
import manusIcon from "@lobehub/icons-static-svg/icons/manus.svg";
import midjourneyIcon from "@lobehub/icons-static-svg/icons/midjourney.svg";
import nanoBananaIcon from "@lobehub/icons-static-svg/icons/nanobanana-color.svg";
import notebookLMIcon from "@lobehub/icons-static-svg/icons/notebooklm.svg";
import notionIcon from "@lobehub/icons-static-svg/icons/notion.svg";
import openAIIcon from "@lobehub/icons-static-svg/icons/openai.svg";
import perplexityIcon from "@lobehub/icons-static-svg/icons/perplexity-color.svg";
import runwayIcon from "@lobehub/icons-static-svg/icons/runway.svg";
import skyworkIcon from "@lobehub/icons-static-svg/icons/skywork-color.svg";
import sunoIcon from "@lobehub/icons-static-svg/icons/suno.svg";

const categories = [
  "전체",
  "범용 AI",
  "에이전트 AI",
  "검색·리서치",
  "문서·지식관리",
  "발표·시각화",
  "이미지",
  "영상",
  "음성·음악",
  "코딩·앱 제작",
] as const;

type Category = (typeof categories)[number];

const tools = [
  { name: "ChatGPT", category: "범용 AI", description: "아이디어, 글쓰기, 분석, 이미지와 코딩부터 웹 조사·에이전트 작업까지 지원하는 범용 AI", url: "https://chatgpt.com/", icon: openAIIcon },
  { name: "Claude", category: "범용 AI", description: "문서·슬라이드·스프레드시트·프로토타입 제작과 업무 위임을 지원하는 AI 워크스페이스", url: "https://claude.ai/", icon: claudeIcon },
  { name: "Gemini", category: "범용 AI", description: "검색과 문서 작성, 이미지·영상 생성 및 Google Workspace 연동을 지원하는 범용 AI", url: "https://gemini.google.com/", icon: geminiIcon },
  { name: "Grok", category: "범용 AI", description: "대화, 실시간 정보 탐색, 추론과 콘텐츠 생성을 지원하는 AI", url: "https://grok.com/", icon: grokIcon },
  { name: "Genspark", category: "에이전트 AI", description: "자료조사부터 문서, 슬라이드, 이미지와 웹페이지 제작까지 지원하는 AI 워크스페이스", url: "https://www.genspark.ai/", icon: "/aitoollibrary-assets/logos/genspark.png" },
  { name: "Manus", category: "에이전트 AI", description: "조사와 분석을 수행하고 슬라이드, 웹사이트와 디자인 결과물을 제작하는 AI 에이전트", url: "https://manus.im/", icon: manusIcon },
  { name: "Skywork", category: "에이전트 AI", description: "리서치를 기반으로 문서, 슬라이드, 시트와 웹 콘텐츠를 제작하는 AI 워크스페이스", url: "https://skywork.ai/", icon: skyworkIcon },
  { name: "Perplexity", category: "검색·리서치", description: "웹 자료를 검색하고 출처가 포함된 답변과 심층 조사 결과를 제공하는 AI 검색 서비스", url: "https://www.perplexity.ai/", icon: perplexityIcon },
  { name: "LINER", category: "검색·리서치", description: "웹과 논문을 검색하고 핵심 정보와 참고할 출처를 정리해 주는 리서치 AI", url: "https://app.liner.com/", icon: "/aitoollibrary-assets/logos/liner.ico" },
  { name: "Notion", category: "문서·지식관리", description: "문서, 데이터베이스, 프로젝트와 업무 정보를 한곳에서 관리하는 AI 워크스페이스", url: "https://www.notion.com/", icon: notionIcon },
  { name: "NotebookLM", category: "문서·지식관리", description: "등록한 문서와 자료를 기반으로 요약, 질의응답과 학습 콘텐츠를 만드는 AI 노트북", url: "https://notebooklm.google.com/", icon: notebookLMIcon },
  { name: "Canva", category: "발표·시각화", description: "프레젠테이션, 포스터, 카드뉴스와 SNS 콘텐츠를 제작하는 디자인 플랫폼", url: "https://www.canva.com/", icon: "/aitoollibrary-assets/logos/canva.svg" },
  { name: "Gamma", category: "발표·시각화", description: "입력한 내용을 바탕으로 프레젠테이션, 문서와 간단한 웹페이지를 제작하는 AI", url: "https://gamma.app/", icon: "/aitoollibrary-assets/logos/gamma.svg" },
  { name: "Napkin AI", category: "발표·시각화", description: "텍스트를 다이어그램, 인포그래픽과 비즈니스 시각자료로 변환하는 AI", url: "https://www.napkin.ai/", icon: "/aitoollibrary-assets/logos/napkin.png" },
  { name: "GPT Image", category: "이미지", description: "ChatGPT와 대화하며 이미지를 생성하고 원하는 부분을 수정할 수 있는 이미지 AI", url: "https://chatgpt.com/images", icon: openAIIcon },
  { name: "Nano Banana 2.1", category: "이미지", description: "이미지 생성·합성과 정밀 편집을 지원하는 Gemini의 이미지 모델. 2.1은 Google AI 유료 플랜에서 이용", url: "https://gemini.google/overview/image-generation/", icon: nanoBananaIcon },
  { name: "Midjourney", category: "이미지", description: "감도 높은 콘셉트 이미지와 창의적인 비주얼을 제작하는 이미지 생성 AI", url: "https://www.midjourney.com/", icon: midjourneyIcon },
  { name: "Adobe Firefly", category: "이미지", description: "이미지 생성과 편집을 지원하고 Adobe 제작 도구와 연계되는 생성형 AI", url: "https://firefly.adobe.com/", icon: adobeFireflyIcon },
  { name: "Kling AI", category: "영상", description: "텍스트와 이미지를 기반으로 고품질 영상을 생성하는 AI", url: "https://klingai.com/", icon: klingIcon },
  { name: "Higgsfield", category: "영상", description: "역동적인 카메라 움직임과 광고·SNS 스타일의 영상을 제작하는 AI", url: "https://higgsfield.ai/", icon: "/aitoollibrary-assets/logos/higgsfield.png" },
  { name: "Runway", category: "영상", description: "AI 영상 생성과 편집, 장면 변환과 시각효과 작업을 지원하는 제작 도구", url: "https://runwayml.com/", icon: runwayIcon },
  { name: "ElevenLabs", category: "음성·음악", description: "자연스러운 AI 음성, 내레이션, 더빙과 보이스 콘텐츠를 제작하는 AI", url: "https://elevenlabs.io/", icon: elevenLabsIcon },
  { name: "Suno", category: "음성·음악", description: "원하는 주제와 분위기를 입력해 노래, 음악과 배경음악을 생성하는 AI", url: "https://suno.com/", icon: sunoIcon },
  { name: "Codex", category: "코딩·앱 제작", description: "코드를 작성·수정하고 테스트와 개발 작업을 수행하는 OpenAI의 코딩 에이전트", url: "https://chatgpt.com/codex", icon: codexIcon },
  { name: "Claude Code", category: "코딩·앱 제작", description: "코드베이스를 이해하고 터미널과 개발 환경에서 구현·수정·테스트를 수행하는 코딩 에이전트", url: "https://claude.com/product/claude-code", icon: claudeCodeIcon },
  { name: "Cursor", category: "코딩·앱 제작", description: "AI와 대화하며 코드를 작성하고 기존 프로젝트를 수정하는 AI 코드 에디터", url: "https://cursor.com/", icon: cursorIcon },
  { name: "Lovable", category: "코딩·앱 제작", description: "만들고 싶은 서비스를 자연어로 설명해 웹서비스와 프로토타입을 제작하는 AI 개발 도구", url: "https://lovable.dev/", icon: lovableIcon },
  { name: "Google Flow", category: "영상", description: "Veo 기반 영상 생성으로 장면과 숏을 구성하고 이야기를 완성하는 AI 영상 제작 도구", url: "https://labs.google/flow/about", icon: "/aitoollibrary-assets/logos/flow.png" },
  { name: "Veo 3.1", category: "영상", description: "텍스트와 이미지로 오디오가 포함된 영상을 생성하는 Google의 영상 모델. Gemini와 Flow에서 이용", url: "https://deepmind.google/models/veo/", icon: "/aitoollibrary-assets/logos/veo.svg" },
] as const;

const usageTags: Record<string, string[]> = {
  ChatGPT: ["글쓰기", "웹 조사", "에이전트 작업"], Claude: ["문서 제작", "슬라이드", "업무 위임"], Gemini: ["Google Workspace", "이미지·영상", "리서치"], Grok: ["실시간 정보", "추론"],
  Genspark: ["자료조사", "슬라이드", "웹페이지"], Manus: ["업무 자동화", "리서치"], Skywork: ["보고서", "슬라이드", "시트"], Perplexity: ["출처 검색", "심층 조사"], LINER: ["논문 검색", "자료 정리"], Notion: ["프로젝트 관리", "문서 정리"], NotebookLM: ["자료 요약", "학습", "질의응답"], Canva: ["SNS 콘텐츠", "프레젠테이션"], Gamma: ["슬라이드", "웹페이지"], "Napkin AI": ["다이어그램", "인포그래픽"], "GPT Image": ["이미지 생성", "이미지 편집"], "Nano Banana 2.1": ["이미지 합성", "정밀 편집"], Midjourney: ["콘셉트 이미지", "아트워크"], "Adobe Firefly": ["이미지 편집", "Adobe 연동"], "Kling AI": ["영상 생성", "이미지→영상"], Higgsfield: ["카메라 연출", "광고 영상"], Runway: ["영상 편집", "시각효과"], ElevenLabs: ["내레이션", "더빙"], Suno: ["노래 제작", "배경음악"], Codex: ["코드 작성", "버그 수정", "개발 작업"], "Claude Code": ["터미널 개발", "코드 수정"], Cursor: ["코드 에디터", "프로젝트 수정"], Lovable: ["웹서비스", "프로토타입"], "Google Flow": ["장면 구성", "숏 제작"], "Veo 3.1": ["영상 생성", "네이티브 오디오"]
};

export default function AIToolLibrary() {
  const [selected, setSelected] = useState<Category>("전체");
  const [query, setQuery] = useState("");
  const visibleTools = useMemo(
    () => tools.filter((tool) => (selected === "전체" || tool.category === selected) &&
      [tool.name, tool.category, ...(usageTags[tool.name] || [])].join(" ").toLowerCase().includes(query.trim().toLowerCase())),
    [selected, query],
  );

  const selectCategory = (category: Category) => {
    setSelected(category);
    window.dispatchEvent(new CustomEvent("category_select", { detail: { category } }));
  };

  const trackToolClick = (name: string, category: string) => {
    window.dispatchEvent(new CustomEvent("tool_click", { detail: { name, category } }));
  };

  return (
    <main className="atl-page">
      <header className="site-header">
        <a className="brand" href="/aitoollibrary" aria-label="AI Tool Library 홈">
          <span className="brand-mark" aria-hidden="true">AI</span>
          <span>AI Tool Library</span>
        </a>
        <a className="header-note" href="/" target="_blank" rel="noopener noreferrer">YURI CHOI ↗</a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
        <div className="hero-text">
        <p className="eyebrow">A CURATED DIRECTORY / 2026.10</p>
        <h1 id="hero-title">AI Tool<br /><mark>Library.</mark></h1>
        <p className="hero-copy">
          어떤 AI를 어디에 써야 할까?
          <br className="desktop-break" /> 업무 목적에 맞는 도구를 찾아보세요.
        </p>
        </div>
        <img className="hero-image" src="/aitoollibrary-assets/hero-floppy-disks.jpg" alt="주황색 배경 위에 겹쳐 놓인 초록색, 노란색, 파란색과 흰색 플로피디스크" width={4125} height={6214} fetchPriority="high" />
        </div>
        <div className="hero-meta"><span>{categories.length - 1} CATEGORIES · {tools.length} TOOLS</span><span>최근 업데이트: 2026.10</span></div>
      </section>

      <section className="directory" aria-labelledby="directory-title">
        <div className="directory-heading">
          <div>
            <p className="section-kicker">EXPLORE BY CATEGORY</p>
            <h2 id="directory-title">AI 도구 둘러보기</h2>
          </div>
          <p className="result-count" aria-live="polite">
            <strong>{visibleTools.length}</strong>개의 도구
          </p>
        </div>

        <div className="search-box">
          <label htmlFor="tool-search">도구 검색</label>
          <div className="search-input-wrap"><span aria-hidden="true">⌕</span><input id="tool-search" type="search" placeholder="도구 이름 또는 용도 검색 — Codex, 슬라이드, 영상…" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" onClick={() => setQuery("")} disabled={!query} aria-label="검색어 지우기">×</button></div>
        </div>
        <div className="category-scroll">
          <div className="category-list" role="group" aria-label="도구 카테고리">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                
                aria-pressed={selected === category}
                className={selected === category ? "category active" : "category"}
                onClick={() => selectCategory(category)}
              >
                {category} <small>{category === "전체" ? tools.length : tools.filter((tool) => tool.category === category).length}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="tool-grid">
          {visibleTools.map((tool) => (
            <a
              key={tool.name}
              className="tool-card"
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackToolClick(tool.name, tool.category)}
              aria-label={`${tool.name} 공식 사이트 열기 (새 탭)`}
            >
              <div className="card-top">
                <span className="tool-monogram" aria-hidden="true">
                  <img src={tool.icon} alt="" width="36" height="36" />
                </span>
                <span className="external-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="card-content">
                <span className="tool-category">{tool.category}</span>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="usage-tags">{usageTags[tool.name].map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <span className="card-action">공식 사이트 열기 <span aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
        {visibleTools.length === 0 && <div className="empty-state"><h3>일치하는 도구가 없습니다.</h3><p>다른 이름이나 용도로 검색하거나 카테고리를 변경해 보세요.</p><button type="button" onClick={() => { setQuery(""); setSelected("전체"); }}>전체 도구 보기 →</button></div>}
      </section>

      <footer>
        <a className="brand footer-brand" href="/aitoollibrary" aria-label="AI Tool Library 홈">
          <span className="brand-mark" aria-hidden="true">AI</span>
          <span>AI Tool Library</span>
        </a>
        <p>각 서비스의 정보와 이용 조건은 공식 사이트에서 확인해 주세요.</p>
        <p>© 2026 AI Tool Library</p>
      </footer>
    </main>
  );
}
