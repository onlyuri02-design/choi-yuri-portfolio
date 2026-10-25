import type {Metadata} from 'next';
import AIToolLibrary from './library';
import './library.css';

export const metadata:Metadata={
 title:'AI Tool Library — Yuri Choi',
 description:'어떤 AI를 어디에 써야 할까? 업무 목적에 맞는 도구를 찾아보세요. 9개 카테고리, 29개 AI 도구.',
 alternates:{canonical:'https://yurichoi.com/aitoollibrary'},
 openGraph:{title:'AI Tool Library — Yuri Choi',description:'업무 목적에 맞는 AI 도구를 찾아보세요.',url:'https://yurichoi.com/aitoollibrary',images:[{url:'https://yurichoi.com/aitoollibrary-assets/hero-floppy-disks.jpg'}]},
};
export default function AIToolLibraryPage(){return <AIToolLibrary/>;}
