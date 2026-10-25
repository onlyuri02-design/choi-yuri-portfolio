'use client';
import {useEffect, useState, type ReactNode} from 'react';

export function useMobileLayout() {
 const [mobile, setMobile] = useState(false);
 useEffect(() => {
  const media = window.matchMedia('(max-width: 700px)');
  const update = () => setMobile(media.matches);
  update();
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
 }, []);
 return mobile;
}

// Desktop keeps its original DOM; only long mobile detail receives a disclosure.
export function MobileDisclosure({title, children, enabled = true}: {title: ReactNode; children: ReactNode; enabled?: boolean}) {
 const mobile = useMobileLayout();
 if (!mobile || !enabled) return <>{children}</>;
 return <details className="mobile-disclosure"><summary>{title}</summary><div className="mobile-disclosure-body">{children}</div></details>;
}
