import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileService, AuthService } from '@shared/data';
import { GuestTeaserComponent } from '../guest-teaser/guest-teaser.component';

interface ChartPoint {
  x: number;
  y: number;
  value: number;
}

interface AxisLabel {
  label: string;
}

/**
 * Stats Tab Component
 *
 * Displays user statistics with summary cards and activity chart.
 * Shows a teaser overlay for guests.
 */
@Component({
  selector: 'app-stats-tab',
  standalone: true,
  imports: [CommonModule, TranslateModule, GuestTeaserComponent],
  templateUrl: './stats-tab.component.html',
  styleUrls: ['./stats-tab.component.css'],
})
export class StatsTabComponent {
  protected readonly userProfileService = inject(UserProfileService);
  protected readonly authService = inject(AuthService);

  isGuest = this.authService.isGuest;
  userStats = this.userProfileService.userStats;
  isLoading = this.userProfileService.isLoadingStats;

  // Selected game filter for chart
  selectedGameId = signal<string>('all');

  // Chart dimensions
  private readonly chartWidth = 800;
  private readonly chartHeight = 200;
  private readonly maxGamesPerDay = 6; // Max expected value for Y axis

  // Chart data computed from selected filter
  chartData = computed(() => {
    const stats = this.userStats();
    if (!stats) return [];

    if (this.selectedGameId() === 'all') {
      return stats.activityByDay;
    }

    // Find per-game data
    const gameStats = stats.perGame.find((g) => g.gameId === this.selectedGameId());
    if (gameStats) {
      // For now, return the same activity data (would be game-specific in real API)
      return stats.activityByDay;
    }

    return stats.activityByDay;
  });

  // Available games for filter
  availableGames = computed(() => {
    const stats = this.userStats();
    if (!stats) return [];
    return stats.perGame.map((g) => ({ id: g.gameId, name: g.gameName }));
  });

  constructor() {
    // Load stats when component initializes
    effect(() => {
      if (!this.isGuest()) {
        this.userProfileService.loadStats();
      }
    });
  }

  /**
   * Change game filter
   */
  onGameFilterChange(gameId: string): void {
    this.selectedGameId.set(gameId);
  }

  /**
   * Get chart data points for SVG
   */
  getChartDataPoints(): ChartPoint[] {
    const data = this.chartData();
    if (data.length === 0) return [];

    const pointWidth = this.chartWidth / (data.length - 1 || 1);

    return data.map((d, i) => ({
      x: i * pointWidth,
      y: this.chartHeight - (d.gamesPlayed / this.maxGamesPerDay) * this.chartHeight,
      value: d.gamesPlayed,
    }));
  }

  /**
   * Get SVG path for line
   */
  getLinePath(): string {
    const points = this.getChartDataPoints();
    if (points.length === 0) return '';

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
  }

  /**
   * Get SVG path for area fill
   */
  getAreaPath(): string {
    const points = this.getChartDataPoints();
    if (points.length === 0) return '';

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return `${linePath} L ${points[points.length - 1].x} ${this.chartHeight} L ${points[0].x} ${this.chartHeight} Z`;
  }

  /**
   * Get X-axis labels (show every 5th day)
   */
  getXAxisLabels(): AxisLabel[] {
    const data = this.chartData();
    if (data.length === 0) return [];

    const labels: AxisLabel[] = [];
    const step = Math.ceil(data.length / 6);

    for (let i = 0; i < data.length; i += step) {
      const date = new Date(data[i].date);
      labels.push({
        label: `${date.getDate()}/${date.getMonth() + 1}`,
      });
    }

    return labels;
  }
}