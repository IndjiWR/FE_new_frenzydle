import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountdownTimerComponent } from './countdown-timer.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CountdownTimerComponent', () => {
  let component: CountdownTimerComponent;
  let fixture: ComponentFixture<CountdownTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownTimerComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownTimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display formatted time', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1, futureDate.getMinutes() + 30, futureDate.getSeconds() + 45);
    fixture.componentRef.setInput('targetDate', futureDate.toISOString());
    fixture.detectChanges();
    expect(component.formattedTime()).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('should accept target date input', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    fixture.componentRef.setInput('targetDate', futureDate.toISOString());
    expect(component.targetDate()).toBe(futureDate.toISOString());
  });
});