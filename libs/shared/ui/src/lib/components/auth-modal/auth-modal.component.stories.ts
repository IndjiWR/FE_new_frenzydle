import type { Meta, StoryObj } from '@storybook/angular';
import { authModalComponent } from './auth-modal.component';

const meta: Meta<authModalComponent> = {
  title: 'Shared/UI/AuthModal',
  component: authModalComponent,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<authModalComponent>;

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const MethodSelection: Story = {
  args: {
    isOpen: true,
  },
};

export const Login: Story = {
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    // This would simulate entering email and moving to login step
    // In Storybook, we'd need to set up proper mocks
  },
};

export const Register: Story = {
  args: {
    isOpen: true,
  },
};

export const Convert: Story = {
  args: {
    isOpen: true,
  },
};

export const Success: Story = {
  args: {
    isOpen: true,
  },
};