import type { Meta, StoryObj } from '@storybook/angular';
import { EmptyStateComponent } from './empty-state.component';

const meta: Meta<EmptyStateComponent> = {
  title: 'Shared/UI/EmptyState',
  component: EmptyStateComponent,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Message to display when empty',
    },
    showAction: {
      control: 'boolean',
      description: 'Whether to show an action button',
    },
    actionLabel: {
      control: 'text',
      description: 'Label for the action button',
    },
  },
};

export default meta;
type Story = StoryObj<EmptyStateComponent>;

export const Default: Story = {
  args: {
    message: 'No games available at the moment.',
    showAction: false,
    actionLabel: '',
  },
};

export const WithAction: Story = {
  args: {
    message: 'No games found. Try a different search.',
    showAction: true,
    actionLabel: 'Clear Filters',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Your game history is empty. Start playing to build your stats!',
    showAction: true,
    actionLabel: 'Browse Games',
  },
};