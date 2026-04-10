import type { Meta, StoryObj } from '@storybook/angular';
import { NavBarComponent } from './nav-bar.component';
import { NavItem } from '../mobile-menu/mobile-menu.component';

const meta: Meta<NavBarComponent> = {
  title: 'Shared/UI/NavBar',
  component: NavBarComponent,
  tags: ['autodocs'],
  argTypes: {
    isLoggedIn: {
      control: 'boolean',
      description: 'Whether user is logged in',
    },
    userAvatar: {
      control: 'text',
      description: 'URL for user avatar image',
    },
    userName: {
      control: 'text',
      description: 'Display name for the user',
    },
    navItems: {
      control: 'object',
      description: 'Navigation items for the menu',
    },
  },
};

export default meta;
type Story = StoryObj<NavBarComponent>;

const defaultNavItems: NavItem[] = [
  { label: 'nav.home', path: '/' },
  { label: 'nav.games', path: '/games' },
];

export const Default: Story = {
  args: {
    isLoggedIn: false,
    userAvatar: '',
    userName: 'Guest',
    navItems: defaultNavItems,
  },
};

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
    userAvatar: 'https://ui-avatars.com/api/?name=User&background=9333ea&color=fff',
    userName: 'Player1',
    navItems: defaultNavItems,
  },
};

export const WithAvatar: Story = {
  args: {
    isLoggedIn: true,
    userAvatar: 'https://ui-avatars.com/api/?name=John&background=9333ea&color=fff',
    userName: 'John Doe',
    navItems: defaultNavItems,
  },
};

export const CustomNavItems: Story = {
  args: {
    isLoggedIn: false,
    navItems: [
      { label: 'nav.home', path: '/' },
      { label: 'nav.games', path: '/games' },
      { label: 'nav.leaderboard', path: '/leaderboard' },
      { label: 'nav.settings', path: '/settings' },
    ],
  },
};