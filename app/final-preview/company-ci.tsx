import './company-ci.css';

const companies = {
  dongkook: { alt: 'Dongkook', width: 482, height: 151 },
  hugel: { alt: 'HUGEL', width: 727, height: 164 },
};

/** Optical sizing: HUGEL's uppercase wordmark and symbol carry more visual weight. */
export function CompanyCI({ company }: { company: keyof typeof companies }) {
  return <img className={`company-ci company-ci-${company}`}
    src={`/portfolio/september-update/${company}-ci.png`} {...companies[company]} />;
}
