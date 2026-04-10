import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { AchievementsTabComponent } from './achievements-tab.component';
import { AuthService, UserProfileService } from '@shared/data';
import { AchievementCategory } from '@shared/data';

describe('AchievementsTabComponent', () => {
  let component: AchievementsTabComponent;
  let fixture: ComponentFixture<AchievementsTabComponent>;
  let mockAuthService: any;
  let mockUserProfileService: any;

  const mockAchievementsByCategory = {
    playing: [
      { id: 'ach-1', name: 'First Steps', description: 'Play your first game', category: 'playing' as AchievementCategory, unlockCondition: 'Play 1 game', maxProgress: 1, iconType: 'game', currentProgress: 1, isUnlocked: true, unlockedAt: '2026-01-01T00:00:00Z' },
      { id: 'ach-2', name: 'Regular Player', description: 'Play 10 games', category: 'playing' as AchievementCategory, unlockCondition: 'Play 10 games', maxProgress: 10, iconType: 'controller', currentProgress: 5, isUnlocked: false, unlockedAt: null },
    ],
    performance: [
      { id: 'ach-3', name: 'Win Streak', description: 'Win 5 games in a row', category: 'performance' as AchievementCategory, unlockCondition: 'Win 5 games in a row', maxProgress: 5, iconType: 'flame', currentProgress: 3, isUnlocked: false, unlockedAt: null },
    ],
    customisation: [
      { id: 'ach-4', name: 'Hat Collector', description: 'Unlock 3 hats', category: 'customisation' as AchievementCategory, unlockCondition: 'Unlock 3 avatar hats', maxProgress: 3, iconType: 'hat', currentProgress: 0, isUnlocked: false, unlockedAt: null },
    ],
  };

  beforeEach(async () => {
    mockAuthService = {
      isGuest: signal(false),
    };

    mockUserProfileService = {
      achievementsByCategory: signal(mockAchievementsByCategory),
      isLoadingAchievements: signal(false),
      loadAchievements: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AchievementsTabComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserProfileService, useValue: mockUserProfileService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAchievements on init for non-guest users', () => {
    expect(mockUserProfileService.loadAchievements).toHaveBeenCalled();
  });

  it('should return correct category icons', () => {
    expect(component.getCategoryIcon('playing')).toBe('🎮');
    expect(component.getCategoryIcon('performance')).toBe('🏆');
    expect(component.getCategoryIcon('customisation')).toBe('🎨');
    expect(component.getCategoryIcon('unknown')).toBe('⭐');
  });

  it('should return correct achievement icon paths', () => {
    const gameIcon = component.getAchievementIcon('game');
    expect(gameIcon).toContain('M14.752');

    const starIcon = component.getAchievementIcon('star');
    expect(starIcon).toContain('M11.049');

    // Unknown icon should return star
    const unknownIcon = component.getAchievementIcon('unknown');
    expect(unknownIcon).toContain('M11.049');
  });

  it('should get achievements for category', () => {
    const playingAchievements = component.getAchievementsForCategory('playing');
    expect(playingAchievements.length).toBe(2);

    const performanceAchievements = component.getAchievementsForCategory('performance');
    expect(performanceAchievements.length).toBe(1);
  });

  it('should show toast on achievement click if unlocked', () => {
    const achievement = mockAchievementsByCategory.playing[0];
    component.onAchievementClick(achievement);

    expect(component.showToast()).toBe(true);
    expect(component.toastAchievement()).toBe('First Steps');
  });

  it('should not show toast on achievement click if locked', () => {
    const achievement = mockAchievementsByCategory.playing[1];
    component.onAchievementClick(achievement);

    expect(component.showToast()).toBe(false);
  });

  it('should have correct categories', () => {
    expect(component.categories).toEqual(['playing', 'performance', 'customisation']);
  });
});