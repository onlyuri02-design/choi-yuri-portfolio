"use client";

import { useEffect } from 'react';

export default function SiteAnalytics() {
  useEffect(() => {
    if (document.querySelector('script[data-site-analytics-loader]')) return;
    const script = document.createElement('script');
    script.src = '/site-analytics.js';
    script.dataset.siteAnalyticsLoader = '';
    document.head.appendChild(script);
  }, []);
  return null;
}
