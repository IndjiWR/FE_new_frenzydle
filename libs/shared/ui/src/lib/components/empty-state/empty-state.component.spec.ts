import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title when provided', () => {
    component.title = 'No games available';
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('[data-testid="empty-title"]');
    expect(titleElement.textContent.trim()).toBe('No games available');
  });

  it('should display description', () => {
    component.description = 'Check back later';
    fixture.detectChanges();
    const descElement = fixture.nativeElement.querySelector('[data-testid="empty-description"]');
    expect(descElement.textContent.trim()).toContain('Check back later');
  });

  it('should display action button when actionText is provided', () => {
    component.actionText = 'Refresh';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid="empty-action"]');
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('Refresh');
  });

  it('should not display action button when actionText is empty', () => {
    component.actionText = '';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid="empty-action"]');
    expect(button).toBeFalsy();
  });

  it('should emit action when button is clicked', () => {
    component.actionText = 'Refresh';
    jest.spyOn(component.action, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-testid="empty-action"]');
    button.click();

    expect(component.action.emit).toHaveBeenCalled();
  });
});