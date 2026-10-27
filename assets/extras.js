/* Extras: theme, sound, language, project modal, github, lab, terminal, game, easter egg, 3D reveal */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const store = {get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
const GH_USER = 'sachin-jangir8290';
const EMAIL = 'sachinjangir8082@gmail.com';

function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
 t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600)}

/* ---------- theme ---------- */
const themeBtn=$('#themeBtn');
function setTheme(t,anim){const h=document.documentElement;if(anim){h.classList.add('theme-anim');setTimeout(()=>h.classList.remove('theme-anim'),600)}
 h.dataset.theme=t;themeBtn.textContent=t=='dark'?'☀️':'🌙';themeBtn.title=t=='dark'?'Light mode':'Dark mode';store.set('theme',t)}
setTheme(store.get('theme')||'light');
themeBtn.onclick=()=>{setTheme(document.documentElement.dataset.theme=='dark'?'light':'dark',true);sfx('pop')};

/* ---------- sound effects (Web Audio, off by default) ---------- */
let soundOn=store.get('sound')=='1',actx=null;const soundBtn=$('#soundBtn');
function paintSound(){soundBtn.textContent=soundOn?'🔊':'🔇';soundBtn.title=soundOn?'Sound off':'Sound on'}paintSound();
function sfx(type){if(!soundOn)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume();
 const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime,f={tick:880,pop:520,ok:660,bad:180,jump:440,coin:990}[type]||600;
 o.type=type=='bad'?'sawtooth':'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*(type=='bad'?.5:1.6),t+.12);
 g.gain.setValueAtTime(type=='tick'?.025:.07,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g).connect(actx.destination);o.start(t);o.stop(t+.18)}catch(_){}}
window.portfolioSfx=sfx;
soundBtn.onclick=()=>{soundOn=!soundOn;store.set('sound',soundOn?'1':'0');paintSound();sfx('ok');toast(soundOn?'🔊 Sound effects on':'🔇 Sound effects off')};
let lastTick=0;document.addEventListener('pointerover',e=>{if(e.target.closest('a,button')&&performance.now()-lastTick>90){lastTick=performance.now();sfx('tick')}});
document.addEventListener('click',e=>{if(e.target.closest('a,button'))sfx('pop')});

/* ---------- project modal ---------- */
const PROJECTS=[
 {img:'img/project-1.webp',type:'Web App · 2026',title:'Project One',desc:'A fast analytics web app with real-time charts, clean dashboards and smooth micro-interactions. Replace this text with the real story: the problem, your solution and the result.',role:'Frontend Developer',tech:['React','Chart.js','Tailwind','REST API'],link:'#'},
 {img:'img/project-2.webp',type:'3D Website · 2025',title:'Project Two',desc:'An immersive WebGL landing page with an interactive 3D planet, scroll-driven animation and great performance on mobile.',role:'Creative Developer',tech:['Three.js','GSAP','WebGL','Vite'],link:'#'},
 {img:'img/project-3.webp',type:'Dashboard · 2025',title:'Project Three',desc:'A clean, light-themed analytics dashboard focused on clarity, accessibility and responsive data visualisation.',role:'UI Developer',tech:['JavaScript','D3.js','CSS Grid','Figma'],link:'#'},
 {img:'img/project-4.webp',type:'Branding · 2024',title:'Project Four',desc:'A playful brand identity system: logo, colour palette, icons and stationery mockups for a modern digital studio.',role:'Designer',tech:['Figma','Illustrator','Brand System'],link:'#'},
];
const pm=document.createElement('div');pm.className='pm';pm.innerHTML=`<div class="pm-box" role="dialog" aria-modal="true"><div class="pm-img"><button class="pm-x" aria-label="Close">✕</button></div>
<div class="pm-body"><div><small class="pm-type"></small><h2 class="pm-title"></h2><p class="pm-desc"></p></div><div class="pm-meta"><div><span>Role</span><b class="pm-role"></b></div><div><span>Tech</span><div class="pm-tags"></div></div><a class="pill pm-link" target="_blank" rel="noopener">View project <i>↗</i></a></div></div>
<div class="pm-nav"><button data-d="-1">← Prev</button><button data-d="1">Next →</button></div></div>`;document.body.appendChild(pm);
let pmi=0;function openPM(i){pmi=(i+PROJECTS.length)%PROJECTS.length;const p=PROJECTS[pmi];pm.querySelector('.pm-img').style.backgroundImage=`url(${p.img})`;
 pm.querySelector('.pm-type').textContent=p.type;pm.querySelector('.pm-title').textContent=p.title;pm.querySelector('.pm-desc').textContent=p.desc;pm.querySelector('.pm-role').textContent=p.role;
 pm.querySelector('.pm-tags').innerHTML=p.tech.map(t=>`<i>${t}</i>`).join('');const a=pm.querySelector('.pm-link');a.href=p.link;a.style.display=p.link&&p.link!='#'?'':'none';
 pm.classList.add('open');document.body.style.overflow='hidden'}
function closePM(){pm.classList.remove('open');document.body.style.overflow=''}
$$('#work .proj').forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();openPM(i)}));
pm.addEventListener('click',e=>{if(e.target==pm||e.target.closest('.pm-x'))closePM();const b=e.target.closest('.pm-nav button');if(b)openPM(pmi+ +b.dataset.d)});
addEventListener('keydown',e=>{if(!pm.classList.contains('open'))return;if(e.key=='Escape')closePM();if(e.key=='ArrowRight')openPM(pmi+1);if(e.key=='ArrowLeft')openPM(pmi-1)});

/* ---------- github stats ---------- */
const LC={JavaScript:'#f7df1e',TypeScript:'#3178c6',HTML:'#e34f26',CSS:'#1572b6',Python:'#3776ab',SCSS:'#c6538c',Vue:'#41b883',Shell:'#89e051',Java:'#b07219',PHP:'#777bb4'};
async function loadGH(){const box=$('#ghGrid');if(!box)return;
 try{const [u,repos]=await Promise.all([fetch(`https://api.github.com/users/${GH_USER}`).then(r=>{if(!r.ok)throw 0;return r.json()}),fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`).then(r=>r.ok?r.json():[])]);
  const stars=repos.reduce((a,r)=>a+r.stargazers_count,0),langs={};repos.forEach(r=>{if(r.language)langs[r.language]=(langs[r.language]||0)+1});
  const tot=Object.values(langs).reduce((a,b)=>a+b,0)||1,top=Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const card=(n,l)=>`<div class="gh-card r in"><b data-gh="${n}">0</b><span>${l}</span></div>`;
  box.innerHTML=card(u.public_repos,'Public repos')+card(u.followers,'Followers')+card(stars,'Stars earned')+card(u.following,'Following')+
  `<div class="gh-card gh-langs"><b style="font-size:22px">Top languages</b><div class="gh-bar">${top.map(([k,v])=>`<i style="width:0;background:${LC[k]||'#ff3d1f'}" data-w="${v/tot*100}"></i>`).join('')}</div>
   <div class="gh-leg">${top.map(([k,v])=>`<em style="--c:${LC[k]||'#ff3d1f'}">${k} ${Math.round(v/tot*100)}%</em>`).join('')||'<em>No public code yet</em>'}</div></div>`+
  `<div class="gh-card gh-repos"><b style="font-size:22px">Latest repos</b>${repos.slice(0,4).map(r=>`<a href="${r.html_url}" target="_blank" rel="noopener"><b>${r.name}</b><small>★ ${r.stargazers_count} · ${r.language||'—'}</small></a>`).join('')||'<span>No public repos yet</span>'}</div>`+
  `<div class="gh-card gh-chart"><b style="font-size:22px;margin-bottom:14px">Contributions</b><img src="https://ghchart.rshah.org/ff3d1f/${GH_USER}" alt="GitHub contribution chart" loading="lazy" onerror="this.parentNode.style.display='none'"></div>`;
  requestAnimationFrame(()=>{$$('.gh-bar i').forEach(i=>i.style.width=i.dataset.w+'%');
   $$('[data-gh]').forEach(el=>{const n=+el.dataset.gh,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));k<1&&requestAnimationFrame(f)})(t0)})});
 }catch(e){box.innerHTML=`<p class="gh-err">GitHub stats couldn't load right now. <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener" style="color:var(--acc)">Visit my GitHub ↗</a></p>`}}
const ghSec=$('#github');if(ghSec){const o=new IntersectionObserver(e=>{if(e[0].isIntersecting){o.disconnect();loadGH()}},{rootMargin:'300px'});o.observe(ghSec)}

/* ---------- lab interactions ---------- */
const rb=$('.ripple-btn');if(rb)rb.addEventListener('click',e=>{const r=rb.getBoundingClientRect(),i=document.createElement('i'),s=Math.max(r.width,r.height);
 i.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;rb.appendChild(i);setTimeout(()=>i.remove(),700)});
$$('.flip').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));
$$('.spot-txt').forEach(el=>el.parentNode.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--x',(e.clientX-r.left)+'px');el.style.setProperty('--y',(e.clientY-r.top)+'px')}));

/* ---------- easter egg ---------- */
function ghostParty(){toast('👻 Boo! You found the secret ghost party!');sfx('coin');
 for(let i=0;i<22;i++){const g=document.createElement('img');g.src='logo.png';g.alt='';g.className='egg-ghost';const W=innerWidth,H=innerHeight,fromLeft=Math.random()<.5;
  g.style.setProperty('--x0',(fromLeft?-120:W+40)+'px');g.style.setProperty('--y0',Math.random()*H+'px');g.style.setProperty('--x1',(fromLeft?W+120:-160)+'px');g.style.setProperty('--y1',Math.random()*H+'px');
  g.style.setProperty('--r',(Math.random()*720-360)+'deg');g.style.setProperty('--d',(2.5+Math.random()*2.5)+'s');g.style.width=(40+Math.random()*60)+'px';g.style.animationDelay=Math.random()*1.2+'s';
  document.body.appendChild(g);setTimeout(()=>g.remove(),6500)}}
window.ghostParty=ghostParty;
let clicks=0,ct=0;$('.logo').addEventListener('click',e=>{e.preventDefault();const now=Date.now();clicks=now-ct<700?clicks+1:1;ct=now;if(clicks>=5){clicks=0;ghostParty()}else if(clicks==1)scrollTo({top:0,behavior:'smooth'})});
const KON=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let kp=0;
addEventListener('keydown',e=>{kp=e.key==KON[kp]?kp+1:(e.key==KON[0]?1:0);if(kp==KON.length){kp=0;ghostParty()}});

/* ---------- terminal ---------- */
const out=$('#termOut'),tin=$('#termIn');
if(out&&tin){
 const hist=[];let hi=0;
 const print=(h,cls)=>{const d=document.createElement('div');if(cls)d.className=cls;d.innerHTML=h;out.appendChild(d);out.scrollTop=out.scrollHeight};
 const CMDS={
  help:()=>`Available commands:
  <span class="c">about</span>       who is Sachin
  <span class="c">skills</span>      tech stack
  <span class="c">projects</span>    selected work
  <span class="c">experience</span>  journey so far
  <span class="c">github</span>      open GitHub profile
  <span class="c">contact</span>     how to reach me
  <span class="c">theme</span>       toggle dark / light
  <span class="c">game</span>        play Ghost Run
  <span class="c">ghost</span>       👻 ???
  <span class="c">date</span>        current date & time
  <span class="c">clear</span>       clear the screen`,
  about:()=>`Sachin Jangir — Frontend Developer from India 🇮🇳
Building fast, interactive & 3D web experiences.
Currently at <span class="c">Bright Beans Digital</span>.`,
  whoami:()=>'visitor@sachin.dev — welcome! 👋',
  skills:()=>`<span class="g">frontend</span>  HTML · CSS · JavaScript · React · Tailwind
<span class="g">3d/motion</span> Three.js · WebGL · GSAP
<span class="g">backend</span>   Node.js · Python
<span class="g">design</span>    Figma · UI/UX
<span class="g">tools</span>     Git · Vite · VS Code`,
  projects:()=>PROJECTS.map((p,i)=>`<span class="c">[${i+1}]</span> ${p.title} <span class="m">— ${p.type}</span>`).join('\n')+'\n<span class="m">Type "open 1" to view a project.</span>',
  experience:()=>`<span class="g">2025 — now</span>   Frontend Developer @ Bright Beans Digital
<span class="g">2024 — 2025</span>  Web Developer Intern
<span class="g">2020 — 2024</span>  Bachelor's Degree`,
  github:()=>{open(`https://github.com/${GH_USER}`,'_blank','noopener');return `Opening <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a> ...`},
  contact:()=>`✉️  <a href="mailto:${EMAIL}">${EMAIL}</a>\n🐙  <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener">github.com/${GH_USER}</a>`,
  theme:()=>{themeBtn.click();return `Theme switched to <span class="c">${document.documentElement.dataset.theme}</span>.`},
  game:()=>{$('#game').scrollIntoView({behavior:'smooth'});return 'Loading Ghost Run... 🎮'},
  ghost:()=>{ghostParty();return 'Boo! 👻👻👻'},
  date:()=>new Date().toString(),
  sudo:()=>'Nice try 😄 — permission denied.',
  ls:()=>'about.txt  skills.json  projects/  experience.md  secret_ghost.exe',
  clear:()=>{out.innerHTML='';return ''},
  hello:()=>'Hey there! 👋 Type <span class="c">help</span> to see what I can do.',
 };CMDS.hi=CMDS.hello;
 function run(raw){const cmd=raw.trim();if(!cmd)return;hist.push(cmd);hi=hist.length;print(`<span class="g">visitor@sachin</span>:<span class="c">~</span>$ ${cmd.replace(/</g,'&lt;')}`);
  const [c,arg]=cmd.toLowerCase().split(/\s+/);
  if(c=='open'&&arg){const n=+arg-1;if(PROJECTS[n]){openPM(n);print('Opening '+PROJECTS[n].title+' ...','m')}else print('No such project. Try "projects".','m');return}
  if(c=='cat'&&arg=='secret_ghost.exe'){ghostParty();print('👻 it escaped!');return}
  const f=CMDS[c];const r=f?f():`command not found: ${c.replace(/</g,'&lt;')} — type <span class="c">help</span>`;if(r)print(r);sfx(f?'ok':'bad')}
 print(`<span class="c">Welcome to Sachin's terminal v1.0</span>\nType <span class="c">help</span> to see available commands.\n`);
 tin.addEventListener('keydown',e=>{if(e.key=='Enter'){run(tin.value);tin.value=''}
  else if(e.key=='ArrowUp'){if(hi>0){hi--;tin.value=hist[hi]}e.preventDefault()}else if(e.key=='ArrowDown'){if(hi<hist.length-1){hi++;tin.value=hist[hi]}else{hi=hist.length;tin.value=''}e.preventDefault()}
  else if(e.key=='Tab'){e.preventDefault();const m=Object.keys(CMDS).filter(k=>k.startsWith(tin.value.trim()));if(m.length==1)tin.value=m[0]}});
 $('.term').addEventListener('click',()=>tin.focus({preventScroll:true}));
 $$('.term-hints button').forEach(b=>b.onclick=()=>{run(b.textContent);tin.focus({preventScroll:true})});
}

/* ---------- game: Ghost Run ---------- */
const cv=$('#gameCv');
if(cv){
 const narrow=cv.parentNode.clientWidth<600,ctx=cv.getContext('2d'),W=narrow?560:900,H=narrow?380:300,G=H-46;cv.width=W;cv.height=H;
 const img=new Image();img.src='logo.png';
 const ui=$('#gameUi'),scoreEl=$('#gScore'),bestEl=$('#gBest');let best=+store.get('ghostBest')||0;bestEl.textContent=best;
 let st='idle',p,obs,items,speed,score,dist,bonus,spawnIn,itemIn,raf,lastT;
 function reset(){p={x:90,y:G-54,w:60,h:54,vy:0,on:true};obs=[];items=[];speed=6;score=0;dist=0;bonus=0;spawnIn=60;itemIn=90;lastT=0}
 function jump(){if(st!='play'){start();return}if(p.on){p.vy=-13.5;p.on=false;sfx('jump')}}
 function start(){reset();st='play';ui.classList.add('hide');cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
 function over(){st='over';sfx('bad');if(score>best){best=score;store.set('ghostBest',best);bestEl.textContent=best}
  ui.innerHTML=`<h3>Game over 👻</h3><p>Score: <b style="color:#fff">${score}</b> · Best: ${best}</p><button class="pill" type="button">Play again <i>↻</i></button>`;ui.classList.remove('hide');ui.querySelector('button').onclick=e=>{e.stopPropagation();start()}}
 const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 function draw(){ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;for(let x=-(score*3%60);x<W;x+=60){ctx.beginPath();ctx.moveTo(x,G+8);ctx.lineTo(x-30,H);ctx.stroke()}
  ctx.fillStyle='#ff3d1f';ctx.fillRect(0,G,W,3);
  ctx.font='bold 28px ui-monospace,monospace';ctx.textBaseline='top';
  items.forEach(it=>{ctx.fillStyle='#ffb27a';ctx.fillText('{ }',it.x,it.y)});
  obs.forEach(o=>{const cx=o.x+o.w/2,cy=o.y+o.h/2+3,r=o.w/2;ctx.strokeStyle='#ff3d1f';ctx.lineWidth=3;
   for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(cx-r*.6,cy+k*r*.45);ctx.lineTo(cx-r*1.15,cy+k*r*.7);ctx.moveTo(cx+r*.6,cy+k*r*.45);ctx.lineTo(cx+r*1.15,cy+k*r*.7);ctx.stroke()}
   ctx.fillStyle='#ff3d1f';ctx.beginPath();ctx.ellipse(cx,cy,r*.75,r,0,0,7);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(cx,cy-r*.85,r*.42,0,7);ctx.fill();
   ctx.fillRect(cx-1.5,cy-r*.5,3,r*1.4);ctx.beginPath();ctx.arc(cx-r*.35,cy-r*.05,r*.16,0,7);ctx.arc(cx+r*.35,cy+r*.3,r*.16,0,7);ctx.fill();
   ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-r*.17,cy-r*.95,2.5,0,7);ctx.arc(cx+r*.17,cy-r*.95,2.5,0,7);ctx.fill()});
  const bob=p.on?Math.sin(performance.now()/120)*2:0;ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2+bob);ctx.rotate(p.on?0:Math.max(-.4,Math.min(.4,p.vy/30)));
  if(img.complete)ctx.drawImage(img,-p.w/2-4,-p.h/2-6,p.w+8,p.h+8);ctx.restore()}
 function loop(t){raf=requestAnimationFrame(loop);const dt=lastT?Math.min(2,(t-lastT)/16.67):1;lastT=t;if(st!='play'){draw();return}
  p.vy+=.7*dt;p.y+=p.vy*dt;if(p.y>=G-p.h){p.y=G-p.h;p.vy=0;p.on=true}
  speed+=.0025*dt;spawnIn-=dt;itemIn-=dt;
  if(spawnIn<=0){const s=34+Math.random()*14;obs.push({x:W+20,y:G-s,w:s-10,h:s});spawnIn=55+Math.random()*60-speed*2}
  if(itemIn<=0){items.push({x:W+20,y:G-110-Math.random()*70,w:46,h:28});itemIn=80+Math.random()*90}
  obs.forEach(o=>o.x-=speed*dt);items.forEach(i=>i.x-=speed*dt);obs=obs.filter(o=>o.x>-60);items=items.filter(i=>i.x>-60&&!i.got);
  const box={x:p.x+10,y:p.y+8,w:p.w-20,h:p.h-14};
  for(const o of obs)if(hit(box,{x:o.x+4,y:o.y+6,w:o.w-6,h:o.h-8})){over();break}
  items.forEach(i=>{if(hit(box,i)){i.got=true;bonus+=10;sfx('coin')}});
  dist+=speed*dt;score=Math.floor(dist/60)+bonus;scoreEl.textContent=score;draw()}
 reset();draw();raf=requestAnimationFrame(loop);
 const sb0=ui.querySelector('button');if(sb0)sb0.onclick=e=>{e.stopPropagation();start()};
 cv.addEventListener('pointerdown',e=>{e.preventDefault();jump()});ui.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();jump()});
 let inView=false;new IntersectionObserver(e=>inView=e[0].isIntersecting,{threshold:.4}).observe(cv);
 addEventListener('keydown',e=>{if(!inView||e.target.matches('input,textarea'))return;if(e.code=='Space'||e.key=='ArrowUp'){e.preventDefault();jump()}});
}

/* ---------- 3D scroll reveal + parallax ---------- */
const r3=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');r3.unobserve(e.target)}}),{threshold:.12});
$$('.svc,.proj,.ach > div,.post,.bl,.gh-card,.lab-tile,.now-card').forEach((el,i)=>{el.classList.remove('r');el.classList.add('r3d');el.style.transitionDelay=(i%3)*.08+'s';r3.observe(el)});
const px=$$('[data-parallax]');
if(px.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let tk=false;addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{tk=false;
 px.forEach(el=>{const r=el.getBoundingClientRect(),c=r.top+r.height/2-innerHeight/2;el.style.transform=`translate3d(${c*(+el.dataset.parallaxX||0)}px,${c*(+el.dataset.parallax)}px,0)`})})},{passive:true})}
})();
