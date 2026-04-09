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
    component.size = 'sm';
    fixture.detectChanges();
    expect(component.sizeClass).toBe('text-xl');

    component.size = 'lg';
    fixture.detectChanges();
    expect(component.sizeClass).toBe('text-5xl');
  });

  it('should apply animation class when animated is true', () => {
    component.animated = true;
    fixture.detectChanges();
    expect(component.animationClass).toBe('animate-logo-scale');
  });

  it('should not apply animation class when animated is false', () => {
    component.animated = false;
    fixture.detectChanges();
    expect(component.animationClass).toBe('');
  });

  it('should have custom class property set', () => {
    component.customClass = 'my-custom-class';
    fixture.detectChanges();
    // The customClass input should be set correctly
    expect(component.customClass).toBe('my-custom-class');
    // Check the computed animationStyle which uses customClass
    expect(component.animationClass).toBe('animate-logo-scale'); // default animated
  });
});