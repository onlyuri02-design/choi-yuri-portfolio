import type { Metadata } from "next";
import "./globals.css";
import SiteCursor from './site-cursor';
import SiteAnalytics from './site-analytics';
export const metadata: Metadata = {
  title: "Yuri Choi — Product & Brand Business Leader",
  description: "최유리의 브랜드·비즈니스 포트폴리오. Beauty · Medical Beauty · Fashion, 제품과 손익의 의사결정부터 글로벌 실행까지.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><head><link rel="stylesheet" href="/site-cursor.css"/></head><body>{children}<div style={{padding:'12px 24px',fontSize:'11px',textAlign:'right'}}><a href="/privacy">Privacy &amp; Analytics</a></div><SiteCursor/><SiteAnalytics/></body></html>;
}
