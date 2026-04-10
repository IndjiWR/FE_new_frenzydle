import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "FrenzyDle" text', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent.trim()).toBe('FrenzyDle');
  });

  it('should apply size classes correctly', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component.sizeClass()).toBe('text-xl');

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component.sizeClass()).toBe('text-5xl');
  });

  it('should apply animation class when animated is true', () => {
    fixture.componentRef.setInput('animated', true);
    fixture.detectChanges();
    expect(component.animationClass()).toBe('animate-logo-scale');
  });

  it('should not apply animation class when animated is false', () => {
    fixture.componentRef.setInput('animated', false);
    fixture.detectChanges();
    expect(component.animationClass()).toBe('');
  });

  it('should have custom class property set', () => {
    fixture.componentRef.setInput('customClass', 'my-custom-class');
    fixture.detectChanges();
    expect(component.customClass()).toBe('my-custom-class');
  });
});