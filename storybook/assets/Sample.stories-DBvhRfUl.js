const r={title:"Example/Sample"},n=()=>{const e=document.createElement("div");return e.style.padding="20px",e.style.border="1px solid #ccc",e.innerHTML=`
    <h1>Multiplication Drill Component</h1>
    <p>This is a sample story for vanilla TypeScript!</p>
  `,e};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.border = '1px solid #ccc';
  container.innerHTML = \`
    <h1>Multiplication Drill Component</h1>
    <p>This is a sample story for vanilla TypeScript!</p>
  \`;
  return container;
}`,...n.parameters?.docs?.source}}};const t=["Primary"];export{n as Primary,t as __namedExportsOrder,r as default};
