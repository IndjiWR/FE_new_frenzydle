import type { Meta, StoryObj } from '@storybook/angular';
import { ErrorStateComponent } from './error-state.component';

const meta: Meta<ErrorStateComponent> = {
  title: 'Shared/UI/ErrorState',
  component: ErrorStateComponent,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Error message to display',
    },
    showRetry: {
      control: 'boolean',
      description: 'Whether to show the retry button',
    },
  },
};

export default meta;
type Story = StoryObj<ErrorStateComponent>;

export const Default: Story = {
  args: {
    message: 'Failed to load games. Please try again.',
    showRetry: true,
  },
};

export const WithoutRetry: Story = {
  args: {
    message: 'An error occurred.',
    showRetry: false,
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Unable to connect to the server. Check your internet connection.',
    showRetry: true,
  },
};