"use client";

import { useEffect } from 'react';

export default function SiteCursor() {
  useEffect(() => {
    // Start after hydration so pointer movement cannot alter SSR attributes early.
    // The root layout persists through navigation; load the shared runtime once.
    if (document.querySelector('script[data-site-cursor-loader]')) return;
    const script = document.createElement('script');
    script.src = '/site-cursor.js';
    script.dataset.siteCursorLoader = '';
    document.head.appendChild(script);
  }, []);
  return null;
}
