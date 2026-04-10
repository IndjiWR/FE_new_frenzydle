import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/user/user.component').then(m => m.UserComponent),
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