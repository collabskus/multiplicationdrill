let i=null;class L{_value;observers=new Set;constructor(e){this._value=e}get(){return i&&this.observers.add(i),this._value}set(e){this._value!==e&&(this._value=e,[...this.observers].forEach(a=>a()))}getObserverCount(){return this.observers.size}}class H{computeFn;observers=new Set;_value=void 0;isStale=!0;markStaleEffect;constructor(e){this.computeFn=e,this.markStaleEffect=()=>{this.isStale||(this.isStale=!0,[...this.observers].forEach(a=>a()))}}_compute(){const e=i;i=this.markStaleEffect;try{this._value=this.computeFn(),this.isStale=!1}finally{i=e}}get(){return i&&this.observers.add(i),this.isStale&&this._compute(),this._value}}function R(t){const e=()=>{const a=i;i=e;try{t()}finally{i=a}};e()}function G(t){switch(t){case 1:return{min:2,max:5};case 2:return{min:4,max:8};case 3:return{min:6,max:12};case 4:return{min:10,max:20};default:return{min:6,max:12}}}function F(t,e){return Math.floor(Math.random()*(e-t+1))+t}function I(t){const e=G(t);return{a:F(e.min,e.max),b:F(e.min,e.max)}}const O={title:"App/FullApplication",tags:["autodocs"],parameters:{layout:"fullscreen"},argTypes:{theme:{control:"select",options:["light","dark"]},initialMode:{control:"select",options:["manual","quiz"]},difficulty:{control:"select",options:[1,2,3,4],labels:{1:"Easy",2:"Medium",3:"Hard",4:"Expert"}}}},m=t=>{const e=document.createElement("div");t.theme==="light"&&e.classList.add("light-mode"),e.style.minHeight="100vh",e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center",e.style.padding="20px";const a=document.createElement("div");a.className="container";const Q=document.createElement("h1");Q.textContent="Reactive Math Quiz",a.appendChild(Q);const l=document.createElement("div");l.className="section";const c=document.createElement("div");c.className="quiz-display",c.id="story-display",c.textContent=t.initialMode==="manual"?"0 × 10 = 0":"7 × 8";const S=document.createElement("div");S.className="progress-container";const p=document.createElement("div");p.className="progress-bar",p.id="story-progress",p.style.width=t.initialMode==="quiz"?"50%":"0%",S.appendChild(p);const f=document.createElement("div");f.className="timer-display",f.id="story-timer",f.textContent=t.initialMode==="manual"?"Ready":"Question: 3.5s",l.appendChild(c),l.appendChild(S),l.appendChild(f),a.appendChild(l);const y=document.createElement("div");y.className="section";const b=document.createElement("h3");b.textContent="Quiz Settings",b.style.marginBottom="15px",y.appendChild(b);const s=document.createElement("div");s.className="controls";const z=document.createElement("div");z.className="slider-group",z.innerHTML=`
    <label for="story-question-time">Question Time:</label>
    <input type="range" id="story-question-time" min="1" max="30" value="5">
    <span class="slider-value">5s</span>
  `,s.appendChild(z);const q=document.createElement("div");q.className="slider-group",q.innerHTML=`
    <label for="story-answer-time">Answer Time:</label>
    <input type="range" id="story-answer-time" min="1" max="30" value="3">
    <span class="slider-value">3s</span>
  `,s.appendChild(q);const $=["","Easy","Medium","Hard","Expert"],k=document.createElement("div");k.className="slider-group",k.innerHTML=`
    <label for="story-difficulty">Difficulty:</label>
    <input type="range" id="story-difficulty" min="1" max="4" step="1" value="${t.difficulty}">
    <span class="slider-value">${$[t.difficulty]}</span>
  `,s.appendChild(k);const d=document.createElement("button");d.textContent=t.initialMode==="quiz"?"Stop Quiz":"Start Quiz",d.id="story-quiz-button",s.appendChild(d),y.appendChild(s),a.appendChild(y);const h=document.createElement("div");h.className="section";const w=document.createElement("h3");w.textContent="Manual Mode",w.style.marginBottom="15px",h.appendChild(w);const v=document.createElement("div");v.className="button-group";const r=document.createElement("button");r.textContent="Increment",r.id="story-increment",r.disabled=t.initialMode==="quiz",v.appendChild(r);const o=document.createElement("button");o.textContent="Reset",o.id="story-reset",o.disabled=t.initialMode==="quiz",v.appendChild(o),h.appendChild(v),a.appendChild(h);const N=document.createElement("div");N.className="status",N.innerHTML=`
    <div class="status-item">
      <span>Mode:</span>
      <span class="status-value" id="story-mode">${t.initialMode==="quiz"?"Quiz":"Manual"}</span>
    </div>
    <div class="status-item">
      <span>Quiz State:</span>
      <span class="status-value" id="story-state">${t.initialMode==="quiz"?"Running":"Stopped"}</span>
    </div>
    <div class="status-item">
      <span>Last Update:</span>
      <span class="status-value" id="story-update">${new Date().toLocaleTimeString()}</span>
    </div>
  `,a.appendChild(N),e.appendChild(a);const u=new L(0),D=new L(10),T=new L(t.initialMode==="quiz"),B=new H(()=>{if(T.get()){const n=I(t.difficulty);return`${n.a} × ${n.b}`}return`${u.get()} × ${D.get()} = ${u.get()*D.get()}`});return R(()=>{c.textContent=B.get()}),d.addEventListener("click",()=>{const n=!T.get();T.set(n),d.textContent=n?"Stop Quiz":"Start Quiz",r.disabled=n,o.disabled=n;const _=e.querySelector("#story-mode"),A=e.querySelector("#story-state");_&&(_.textContent=n?"Quiz":"Manual"),A&&(A.textContent=n?"Running":"Stopped")}),r.addEventListener("click",()=>{u.set(u.get()+1);const n=e.querySelector("#story-update");n&&(n.textContent=new Date().toLocaleTimeString())}),o.addEventListener("click",()=>{u.set(0);const n=e.querySelector("#story-update");n&&(n.textContent=new Date().toLocaleTimeString())}),e},g={args:{theme:"dark",initialMode:"manual",difficulty:3},render:m},E={args:{theme:"light",initialMode:"manual",difficulty:3},render:m},M={args:{theme:"dark",initialMode:"quiz",difficulty:3},render:m},C={args:{theme:"dark",initialMode:"manual",difficulty:1},render:m},x={args:{theme:"dark",initialMode:"manual",difficulty:4},render:m};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark',
    initialMode: 'manual',
    difficulty: 3
  },
  render: createFullApp
}`,...g.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light',
    initialMode: 'manual',
    difficulty: 3
  },
  render: createFullApp
}`,...E.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark',
    initialMode: 'quiz',
    difficulty: 3
  },
  render: createFullApp
}`,...M.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark',
    initialMode: 'manual',
    difficulty: 1
  },
  render: createFullApp
}`,...C.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark',
    initialMode: 'manual',
    difficulty: 4
  },
  render: createFullApp
}`,...x.parameters?.docs?.source}}};const j=["DarkMode","LightMode","QuizMode","EasyDifficulty","ExpertDifficulty"];export{g as DarkMode,C as EasyDifficulty,x as ExpertDifficulty,E as LightMode,M as QuizMode,j as __namedExportsOrder,O as default};
