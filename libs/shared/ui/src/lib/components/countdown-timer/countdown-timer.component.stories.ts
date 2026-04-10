import type { Meta, StoryObj } from '@storybook/angular';
import { CountdownTimerComponent } from './countdown-timer.component';

const meta: Meta<CountdownTimerComponent> = {
  title: 'Shared/UI/CountdownTimer',
  component: CountdownTimerComponent,
  tags: ['autodocs'],
  argTypes: {
    targetDate: {
      control: 'text',
      description: 'ISO date string for when the countdown ends',
    },
  },
};

export default meta;
type Story = StoryObj<CountdownTimerComponent>;

// Get a date 1 hour from now
const getFutureDate = (hoursFromNow: number = 1): string => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
};

export const Default: Story = {
  args: {
    targetDate: getFutureDate(1),
  },
};

export const OneMinute: Story = {
  args: {
    targetDate: getFutureDate(1/60),
  },
};

export const TwentyFourHours: Story = {
  args: {
    targetDate: getFutureDate(24),
  },
};