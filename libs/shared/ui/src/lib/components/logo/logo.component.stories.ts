import type { Meta, StoryObj } from '@storybook/angular';
import { LogoComponent } from './logo.component';

const meta: Meta<LogoComponent> = {
  title: 'Shared/UI/Logo',
  component: LogoComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the logo',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate the logo on mount',
    },
    customClass: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

export default meta;
type Story = StoryObj<LogoComponent>;

export const Default: Story = {
  args: {
    size: 'md',
    animated: true,
    customClass: '',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    animated: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    animated: true,
  },
};

export const NotAnimated: Story = {
  args: {
    size: 'md',
    animated: false,
  },
};

export const WithCustomClass: Story = {
  args: {
    size: 'md',
    animated: true,
    customClass: 'shadow-lg',
  },
};