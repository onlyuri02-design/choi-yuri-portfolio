// Reproducible local preview when the legacy node_modules has Windows access errors.
// Keeps the user's source checkout authoritative; the preview is a disposable copy.
import fs from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stage=path.join(root,'work','preview');
const items=['app','public','build','worker','db','drizzle','vite.config.ts','next.config.ts','tsconfig.json','postcss.config.mjs','.openai'];
async function sync(){await fs.mkdir(stage,{recursive:true});for(const item of items)await fs.cp(path.join(root,item),path.join(stage,item),{recursive:true,force:true});}
await sync();
await fs.mkdir(path.join(stage,'.tmp'),{recursive:true});
let timer;let syncing=false;
for(const dir of ['app','public'])watch(path.join(root,dir),{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(async()=>{if(syncing)return;syncing=true;try{await sync()}finally{syncing=false}},250)});
if(!process.argv.includes('--watch-only')){
  const cli=path.join(stage,'node_modules','vinext','dist','cli.js');
  try{await fs.access(cli)}catch{throw new Error('Preview dependencies are missing. Install the existing package.json and pnpm-lock.yaml in work/preview first.');}
  const child=spawn(process.execPath,[cli,'dev'],{cwd:stage,stdio:'inherit',env:{...process.env,TEMP:path.join(stage,'.tmp'),TMP:path.join(stage,'.tmp')}});
  process.on('SIGINT',()=>child.kill('SIGINT'));process.on('SIGTERM',()=>child.kill('SIGTERM'));
  child.on('exit',code=>process.exit(code??0));
}else console.log('Watching app and public; preview copy stays synchronized.');
