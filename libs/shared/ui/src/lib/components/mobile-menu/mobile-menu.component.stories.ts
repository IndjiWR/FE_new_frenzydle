import type { Meta, StoryObj } from '@storybook/angular';
import { MobileMenuComponent, NavItem } from './mobile-menu.component';

const meta: Meta<MobileMenuComponent> = {
  title: 'Shared/UI/MobileMenu',
  component: MobileMenuComponent,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the menu is open',
    },
    navItems: {
      control: 'object',
      description: 'Navigation items for the menu',
    },
  },
};

export default meta;
type Story = StoryObj<MobileMenuComponent>;

const defaultNavItems: NavItem[] = [
  { label: 'nav.home', path: '/' },
  { label: 'nav.games', path: '/games' },
];

export const Closed: Story = {
  args: {
    isOpen: false,
    navItems: defaultNavItems,
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    navItems: defaultNavItems,
  },
};

export const WithManyItems: Story = {
  args: {
    isOpen: true,
    navItems: [
      { label: 'nav.home', path: '/' },
      { label: 'nav.games', path: '/games' },
      { label: 'nav.leaderboard', path: '/leaderboard' },
      { label: 'nav.settings', path: '/settings' },
      { label: 'nav.about', path: '/about' },
    ],
  },
};