import type { Meta, StoryObj } from '@storybook/angular';
import { GameCardComponent } from './game-card.component';
import { GameWithStatus } from '@shared/data';

const meta: Meta<GameCardComponent> = {
  title: 'Shared/UI/GameCard',
  component: GameCardComponent,
  tags: ['autodocs'],
  argTypes: {
    game: {
      control: 'object',
      description: 'Game data to display',
    },
    animationDelay: {
      control: 'number',
      description: 'Animation delay in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<GameCardComponent>;

const mockGameActive: GameWithStatus = {
  id: 'dragonball',
  name: 'Dragon Ball',
  description: 'Test your knowledge of the Dragon Ball universe',
  thumbnailUrl: 'assets/images/games/dragonball.svg',
  theme: { primaryColor: '#FF6B00', secondaryColor: '#FFD700' },
  isReleased: true,
  modes: [
    { id: 'classic', name: 'Classic Mode', description: 'Guess the character' },
    { id: 'endless', name: 'Endless Mode', description: 'Infinite guesses' },
  ],
  status: {
    streakCount: 5,
    attemptsUsed: 2,
    maxAttempts: 6,
    isCompletedToday: false,
    nextResetAt: new Date(Date.now() + 3600000).toISOString(),
  },
};

const mockGameCompleted: GameWithStatus = {
  id: 'dragonball',
  name: 'Dragon Ball',
  description: 'Test your knowledge of the Dragon Ball universe',
  thumbnailUrl: 'assets/images/games/dragonball.svg',
  theme: { primaryColor: '#FF6B00', secondaryColor: '#FFD700' },
  isReleased: true,
  modes: [],
  status: {
    streakCount: 10,
    attemptsUsed: 3,
    maxAttempts: 6,
    isCompletedToday: true,
    nextResetAt: new Date(Date.now() + 3600000).toISOString(),
  },
};

const mockGameComingSoon: GameWithStatus = {
  id: 'naruto',
  name: 'Naruto',
  description: 'Test your knowledge of the Naruto universe',
  thumbnailUrl: 'assets/images/games/naruto.svg',
  theme: { primaryColor: '#FF5F00', secondaryColor: '#1E3A5F' },
  isReleased: false,
  modes: [],
};

export const Active: Story = {
  args: {
    game: mockGameActive,
    animationDelay: 0,
  },
};

export const Completed: Story = {
  args: {
    game: mockGameCompleted,
    animationDelay: 0,
  },
};

export const ComingSoon: Story = {
  args: {
    game: mockGameComingSoon,
    animationDelay: 0,
  },
};

export const WithAnimationDelay: Story = {
  args: {
    game: mockGameActive,
    animationDelay: 200,
  },
};

export const NoGame: Story = {
  args: {
    game: null,
    animationDelay: 0,
  },
};