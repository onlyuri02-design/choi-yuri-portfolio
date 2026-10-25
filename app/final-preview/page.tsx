import FinalPortfolio from './portfolio';
import './style.css';
import './revision.css';
import './process-editorial.css';
import './review-v4.css';
import '../process-options/process-options.css';
import './process-final.css';
import './work-bubbles.css';
import './process-finish.css';
import './approved-design.css';
import './ai-workflow.css';
import './september-update.css';
import './yuriyuri-case.css';
import './integrated-growth.css';
import './cv-contact.css';
import './approved-revision.css';
import './career-summary.css';
import './leadership-archive.css';
import './responsive-width.css'; // Keep responsive page-width rules after page-specific styles.
import './mobile-disclosure.css';
import './notes-menu.css';
import './career-ribbon.css';

export default function FinalPreviewPage({initialRoute='home'}:{initialRoute?:string}){return <FinalPortfolio initialRoute={initialRoute}/>;}
