import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display custom message when provided', () => {
    component.message = 'Custom error message';
    fixture.detectChanges();
    const messageElement = fixture.nativeElement.querySelector('[data-testid="error-message"]');
    expect(messageElement.textContent).toContain('Custom error message');
  });

  it('should emit retry when button is clicked', () => {
    jest.spyOn(component.retry, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-testid="retry-button"]');
    button.click();

    expect(component.retry.emit).toHaveBeenCalled();
  });
});