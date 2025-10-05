const d={title:"Components/Display",tags:["autodocs"],argTypes:{text:{control:"text"},mode:{control:"select",options:["manual","question","answer"]}}},o=c=>{const r=document.createElement("div");r.className="section",r.style.maxWidth="600px";const e=document.createElement("div");return e.className="quiz-display",e.textContent=c.text,c.mode==="question"?e.style.color="var(--accent-primary)":c.mode==="answer"&&(e.style.color="var(--success)"),r.appendChild(e),r},s={args:{text:"5 × 10 = 50",mode:"manual"},render:o},a={args:{text:"7 × 8",mode:"question"},render:o},t={args:{text:"7 × 8 = 56",mode:"answer"},render:o},n={args:{text:"18 × 17 = 306",mode:"answer"},render:o};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    text: '5 × 10 = 50',
    mode: 'manual'
  },
  render: createDisplay
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    text: '7 × 8',
    mode: 'question'
  },
  render: createDisplay
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    text: '7 × 8 = 56',
    mode: 'answer'
  },
  render: createDisplay
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    text: '18 × 17 = 306',
    mode: 'answer'
  },
  render: createDisplay
}`,...n.parameters?.docs?.source}}};const m=["Manual","Question","Answer","LargeNumbers"];export{t as Answer,n as LargeNumbers,s as Manual,a as Question,m as __namedExportsOrder,d as default};
