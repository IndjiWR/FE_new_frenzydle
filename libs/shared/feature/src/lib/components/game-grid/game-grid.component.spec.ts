import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameGridComponent } from './game-grid.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { GameWithStatus } from '@shared/data';

describe('GameGridComponent', () => {
  let component: GameGridComponent;
  let fixture: ComponentFixture<GameGridComponent>;

  const mockGames: GameWithStatus[] = [
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
    {
      id: 'naruto',
      name: 'Naruto',
      description: 'Coming soon',
      thumbnailUrl: 'test.svg',
      theme: { primaryColor: '#FF5F00', secondaryColor: '#1E3A5F' },
      isReleased: false,
      modes: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameGridComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GameGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state', () => {
    fixture.componentRef.setInput('state', 'loading');
    fixture.detectChanges();

    const loadingElement = fixture.nativeElement.querySelector('[data-testid="game-grid-loading"]');
    expect(loadingElement).toBeTruthy();
  });

  it('should display error state', () => {
    fixture.componentRef.setInput('state', 'error');
    fixture.componentRef.setInput('errorMessage', 'Failed to load');
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('[data-testid="game-grid-error"]');
    expect(errorElement).toBeTruthy();
  });

  it('should display empty state', () => {
    fixture.componentRef.setInput('state', 'empty');
    fixture.detectChanges();

    const emptyElement = fixture.nativeElement.querySelector('[data-testid="game-grid-empty"]');
    expect(emptyElement).toBeTruthy();
  });

  it('should display games when loaded', () => {
    fixture.componentRef.setInput('state', 'loaded');
    fixture.componentRef.setInput('games', mockGames);
    fixture.detectChanges();

    const gridElement = fixture.nativeElement.querySelector('[data-testid="game-grid-loaded"]');
    expect(gridElement).toBeTruthy();
  });

  it('should emit gameClick when card is clicked', () => {
    jest.spyOn(component.gameClick, 'emit');
    fixture.componentRef.setInput('state', 'loaded');
    fixture.componentRef.setInput('games', mockGames);
    fixture.detectChanges();

    component.onGameClick('dragonball');

    expect(component.gameClick.emit).toHaveBeenCalledWith('dragonball');
  });

  it('should emit retry when retry button is clicked', () => {
    jest.spyOn(component.retry, 'emit');
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();

    component.onRetry();

    expect(component.retry.emit).toHaveBeenCalled();
  });

  it('should calculate animation delay correctly', () => {
    expect(component.getAnimationDelay(0)).toBe(0);
    expect(component.getAnimationDelay(1)).toBe(80);
    expect(component.getAnimationDelay(2)).toBe(160);
  });
});