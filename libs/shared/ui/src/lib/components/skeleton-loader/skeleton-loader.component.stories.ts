import type { Meta, StoryObj } from '@storybook/angular';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

const meta: Meta<SkeletonLoaderComponent> = {
  title: 'Shared/UI/SkeletonLoader',
  component: SkeletonLoaderComponent,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: 'number',
      description: 'Number of skeleton items to display',
    },
    variant: {
      control: 'select',
      options: ['card', 'text', 'avatar'],
      description: 'Style variant of the skeleton',
    },
  },
};

export default meta;
type Story = StoryObj<SkeletonLoaderComponent>;

export const Default: Story = {
  args: {
    count: 3,
    variant: 'card',
  },
};

export const SingleCard: Story = {
  args: {
    count: 1,
    variant: 'card',
  },
};

export const TextVariant: Story = {
  args: {
    count: 3,
    variant: 'text',
  },
};

export const AvatarVariant: Story = {
  args: {
    count: 1,
    variant: 'avatar',
  },
};

export const ManyCards: Story = {
  args: {
    count: 6,
    variant: 'card',
  },
};