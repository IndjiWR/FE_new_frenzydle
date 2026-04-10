import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { GameService } from '@shared/data';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let gameService: jest.Mocked<GameService>;

  const mockGames = [
    {
      id: 'dragonball',
      name: 'Dragon Ball',
      description: 'Test game',
      thumbnailUrl: 'test.svg',
      theme: { primaryColor: '#FF6B00', secondaryColor: '#FFD700' },
      isReleased: true,
      modes: [],
      status: {
        streakCount: 3,
        attemptsUsed: 2,
        maxAttempts: 6,
        isCompletedToday: false,
        nextResetAt: new Date().toISOString(),
      },
    },
  ];

  beforeEach(async () => {
    const gameServiceMock = {
      getGames: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        { provide: GameService, useValue: gameServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jest.Mocked<GameService>;
  });

  it('should create', () => {
    gameService.getGames.mockReturnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load games on init', () => {
    gameService.getGames.mockReturnValue(of(mockGames));
    fixture.detectChanges();

    expect(gameService.getGames).toHaveBeenCalled();
    expect(component.games().length).toBe(1);
    expect(component.gridState()).toBe('loaded');
  });

  it('should set empty state when no games', () => {
    gameService.getGames.mockReturnValue(of([]));
    fixture.detectChanges();

    expect(component.gridState()).toBe('empty');
  });

  it('should set error state on failure', () => {
    gameService.getGames.mockReturnValue(throwError(() => new Error('Failed')));
    fixture.detectChanges();

    expect(component.gridState()).toBe('error');
  });

  it('should reload games on retry', () => {
    gameService.getGames.mockReturnValue(of(mockGames));
    fixture.detectChanges();

    component.onRetry();

    expect(gameService.getGames).toHaveBeenCalledTimes(2);
  });

  it('should handle game click', () => {
    gameService.getGames.mockReturnValue(of(mockGames));
    fixture.detectChanges();

    // Should not throw when called
    expect(() => component.onGameClick('dragonball')).not.toThrow();
  });
});