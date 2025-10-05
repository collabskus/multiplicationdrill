export default {
  title: 'Example/Sample',
};
export const Primary = () => {
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.border = '1px solid #ccc';
  container.innerHTML = `
    <h1>Multiplication Drill Component</h1>
    <p>This is a sample story for vanilla TypeScript!</p>
  `;
  return container;
};
