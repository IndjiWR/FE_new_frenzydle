import { Route } from '@angular/router';
import { authGuard } from '@shared/data';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.component').then(m => m.UserComponent),
    canActivate: [authGuard],
    data: { allowGuest: true },
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full',
      },
      {
        path: 'stats',
        loadComponent: () => import('./pages/user/components/stats-tab').then(m => m.StatsTabComponent),
      },
      {
        path: 'achievements',
        loadComponent: () => import('./pages/user/components/achievements-tab').then(m => m.AchievementsTabComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/user/components/settings-tab').then(m => m.SettingsTabComponent),
      },
    ],
  },
  {
    path: 'games/:gameId',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];