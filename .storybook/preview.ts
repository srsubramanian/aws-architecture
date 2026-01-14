import type { Preview } from '@storybook/react';
import '../src/demo/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
        { name: 'aws', value: '#232f3e' },
      ],
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
