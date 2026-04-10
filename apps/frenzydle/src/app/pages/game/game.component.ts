import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Placeholder game page component
 * Will be replaced with actual game implementation in future steps
 */
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  private readonly route = inject(ActivatedRoute);

  /**
   * Game ID from route params
   */
  gameId = signal<string>('');

  constructor() {
    this.route.params.subscribe(params => {
      this.gameId.set(params['gameId'] || '');
    });
  }
}