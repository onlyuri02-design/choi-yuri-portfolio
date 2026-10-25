import notesDocument from './document';
import alphaWgsn from './alpha-wgsn';
import addAlphaOffline from './alpha-offline';
import addNikeHeritage from './nike-heritage';

// Keep the complete draft and cover in document.ts/assets, but do not send
// this unpublished note (including its metadata) to public visitors.
const visibleNotes = addNikeHeritage(addAlphaOffline(notesDocument))
  .replace(/<article\b[^>]*\bdata-note="social-stream"[^>]*>[\s\S]*?<\/article>/g, '')
  .replace(/<(figure|section|div)\b[^>]*\bdata-stream-only\b[^>]*>[\s\S]*?<\/\1>/g, '')
  .replace(/<p>(?:(?!<\/p>)[\s\S])*?<a href="#note\/social-stream"[\s\S]*?<\/p>/g, '')
  .replace(/,'social-stream':\{(?:[^{}"]|"(?:\\.|[^"\\])*")*\}/, '');

const visibleCount = (visibleNotes.match(/\bdata-topic="/g) ?? []).length;
export const publishedNotes = visibleNotes
  .replace('</body>', '<div style="padding:12px 24px;font-size:11px;text-align:right"><a href="/privacy">Privacy &amp; Analytics</a></div></body>')
  .replace(/(<[^>]+\bclass="count"[^>]*>)[^<]*/, `$1${visibleCount} NOTES`)
  .replace('</head>', '<link rel="stylesheet" href="/site-cursor.css"><script src="/site-cursor.js" defer></script><script src="/site-analytics.js" data-site-analytics-loader defer></script></head>').replace(
  /(<section class="story-context" data-alpha-only hidden>[\s\S]*?<\/section>)/,
  (section) => section + alphaWgsn,
);
