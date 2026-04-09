import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';
import { TranslateModule } from '@ngx-translate/core';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo', () => {
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector('[data-testid="hero-logo"]');
    expect(logo).toBeTruthy();
  });

  it('should display static subtitle when not animated', () => {
    component.animated = false;
    fixture.detectChanges();
    const subtitle = fixture.nativeElement.querySelector('[data-testid="hero-subtitle-static"]');
    expect(subtitle).toBeTruthy();
  });

  it('should start with empty typewriter text when animated', () => {
    component.animated = true;
    fixture.detectChanges();
    expect(component.typewriterText()).toBe('');
  });

  it('should accept custom title', () => {
    component.title = 'Custom Title';
    expect(component.title).toBe('Custom Title');
  });

  it('should accept custom subtitle key', () => {
    component.subtitleKey = 'custom.subtitle';
    expect(component.subtitleKey).toBe('custom.subtitle');
  });

  it('should complete logo animation after timeout', (done) => {
    component.animated = true;
    component.ngOnInit();
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.logoAnimationComplete()).toBeTrue();
      done();
    }, 700);
  });
});