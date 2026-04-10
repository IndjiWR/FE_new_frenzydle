import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { StatsTabComponent } from './stats-tab.component';
import { AuthService, UserProfileService } from '@shared/data';
import { UserStats } from '@shared/data';

describe('StatsTabComponent', () => {
  let component: StatsTabComponent;
  let fixture: ComponentFixture<StatsTabComponent>;
  let mockAuthService: any;
  let mockUserProfileService: any;

  const mockStats: UserStats = {
    totalGamesPlayed: 47,
    winRate: 72,
    currentStreak: 5,
    bestStreak: 12,
    avgAttempts: 3.4,
    activityByDay: [
      { date: '2026-03-15', gamesPlayed: 2 },
      { date: '2026-03-16', gamesPlayed: 4 },
      { date: '2026-03-17', gamesPlayed: 1 },
    ],
    perGame: [
      { gameId: 'wordle', gameName: 'Wordle', totalPlayed: 20, winRate: 80, currentStreak: 3, bestStreak: 8, avgAttempts: 3.2 },
    ],
  };

  beforeEach(async () => {
    mockAuthService = {
      isGuest: signal(false),
    };

    mockUserProfileService = {
      userStats: signal(mockStats),
      isLoadingStats: signal(false),
      loadStats: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [StatsTabComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserProfileService, useValue: mockUserProfileService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose auth service signals', () => {
    expect(component.isGuest()).toBe(false);
  });

  it('should expose user stats signal', () => {
    expect(component.userStats()).toEqual(mockStats);
  });

  it('should call loadStats on init for non-guest users', () => {
    expect(mockUserProfileService.loadStats).toHaveBeenCalled();
  });

  it('should change game filter', () => {
    component.onGameFilterChange('wordle');
    expect(component.selectedGameId()).toBe('wordle');
  });

  it('should generate chart data points correctly', () => {
    const points = component.getChartDataPoints();
    expect(points.length).toBe(3);
    expect(points[0].value).toBe(2);
    expect(points[1].value).toBe(4);
    expect(points[2].value).toBe(1);
  });

  it('should generate line path correctly', () => {
    const path = component.getLinePath();
    expect(path).toContain('M');
    expect(path).toContain('L');
    expect(path.length).toBeGreaterThan(0);
  });

  it('should generate area path correctly', () => {
    const path = component.getAreaPath();
    expect(path).toContain('M');
    expect(path).toContain('Z');
    expect(path.length).toBeGreaterThan(0);
  });

  it('should generate X-axis labels', () => {
    const labels = component.getXAxisLabels();
    expect(labels.length).toBeGreaterThan(0);
    expect(labels[0].label).toBeDefined();
  });

  it('should compute available games', () => {
    const games = component.availableGames();
    expect(games.length).toBe(1);
    expect(games[0].id).toBe('wordle');
    expect(games[0].name).toBe('Wordle');
  });
});