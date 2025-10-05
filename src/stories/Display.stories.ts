import type { Meta, StoryObj } from '@storybook/html';

interface DisplayArgs {
  text: string;
  mode: 'manual' | 'question' | 'answer';
}

const meta: Meta<DisplayArgs> = {
  title: 'Components/Display',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    mode: { 
      control: 'select',
      options: ['manual', 'question', 'answer']
    },
  },
};

export default meta;
type Story = StoryObj<DisplayArgs>;

const createDisplay = (args: DisplayArgs) => {
  const container = document.createElement('div');
  container.className = 'section';
  container.style.maxWidth = '600px';
  
  const display = document.createElement('div');
  display.className = 'quiz-display';
  display.textContent = args.text;
  
  // Add appropriate styling based on mode
  if (args.mode === 'question') {
    display.style.color = 'var(--accent-primary)';
  } else if (args.mode === 'answer') {
    display.style.color = 'var(--success)';
  }
  
  container.appendChild(display);
  return container;
};

export const Manual: Story = {
  args: {
    text: '5 × 10 = 50',
    mode: 'manual',
  },
  render: createDisplay,
};

export const Question: Story = {
  args: {
    text: '7 × 8',
    mode: 'question',
  },
  render: createDisplay,
};

export const Answer: Story = {
  args: {
    text: '7 × 8 = 56',
    mode: 'answer',
  },
  render: createDisplay,
};

export const LargeNumbers: Story = {
  args: {
    text: '18 × 17 = 306',
    mode: 'answer',
  },
  render: createDisplay,
};
