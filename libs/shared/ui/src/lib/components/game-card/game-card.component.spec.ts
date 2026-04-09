import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardComponent } from './game-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { GameWithStatus } from '@shared/data';

describe('GameCardComponent', () => {
  let component: GameCardComponent;
  let fixture: ComponentFixture<GameCardComponent>;

  const mockGame: GameWithStatus = {
    id: 'dragonball',
    name: 'Dragon Ball',
    description: 'Test game description',
    thumbnailUrl: 'test.svg',
    theme: { primaryColor: '#FF6B00', secondaryColor: '#FFD700' },
    isReleased: true,
    modes: [],
    status: {
      streakCount: 3,
      attemptsUsed: 2,
      maxAttempts: 6,
      isCompletedToday: false,
      nextResetAt: new Date(Date.now() + 86400000).toISOString(),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCardComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display game name', () => {
    component.game = mockGame;
    fixture.detectChanges();
    const nameElement = fixture.nativeElement.querySelector('[data-testid="game-name"]');
    expect(nameElement.textContent.trim()).toBe('Dragon Ball');
  });

  it('should display game description', () => {
    component.game = mockGame;
    fixture.detectChanges();
    const descElement = fixture.nativeElement.querySelector('[data-testid="game-description"]');
    expect(descElement.textContent.trim()).toContain('Test game description');
  });

  it('should show coming soon overlay for unreleased games', () => {
    component.game = { ...mockGame, isReleased: false };
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('[data-testid="coming-soon-overlay"]');
    expect(overlay).toBeTruthy();
  });

  it('should show completed badge when game is completed', () => {
    component.game = { ...mockGame, status: { ...mockGame.status!, isCompletedToday: true } };
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('[data-testid="completed-badge"]');
    expect(badge).toBeTruthy();
  });

  it('should emit cardClick when clicked on released game', () => {
    component.game = mockGame;
    jest.spyOn(component.cardClick, 'emit');
    fixture.detectChanges();

    component.onCardClick();
    expect(component.cardClick.emit).toHaveBeenCalledWith('dragonball');
  });

  it('should not emit cardClick for unreleased games', () => {
    component.game = { ...mockGame, isReleased: false };
    jest.spyOn(component.cardClick, 'emit');
    fixture.detectChanges();

    component.onCardClick();
    expect(component.cardClick.emit).not.toHaveBeenCalled();
  });

  it('should apply animation delay style', () => {
    component.animationDelay = 100;
    fixture.detectChanges();
    expect(component.animationStyle['animation-delay']).toBe('100ms');
  });
});