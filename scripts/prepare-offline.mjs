import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
function list(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=list('dist').filter(p=>!p.endsWith('sw.js')).map(p=>p.replace(/^dist\//,''));
const hash=crypto.createHash('sha256');for(const p of files)hash.update(fs.readFileSync(path.join('dist',p)));
const version=hash.digest('hex').slice(0,12);
const source=fs.readFileSync('public/sw.js','utf8').replace("const CACHE='mate-u-duo-v1';",`const CACHE='mate-u-duo-${version}';`).replace("[base.href,new URL('index.html',base).href,new URL('favicon.svg',base).href,new URL('manifest.webmanifest',base).href]",`${JSON.stringify(files)}.map(p=>new URL(p,base).href)`);
fs.writeFileSync('dist/sw.js',source);
console.log(`Offline: ${files.length} recursos precargados · ${version}`);
