import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo', () => {
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector('[data-testid="hero-logo"]');
    expect(logo).toBeTruthy();
  });

  it('should show subtitle after animation delay when animated', (done) => {
    fixture.componentRef.setInput('animated', true);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.showSubtitle()).toBe(false);

    setTimeout(() => {
      expect(component.showSubtitle()).toBe(true);
      done();
    }, 700);
  });

  it('should show subtitle immediately when not animated', () => {
    fixture.componentRef.setInput('animated', false);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.showSubtitle()).toBe(true);
  });

  it('should accept custom title', () => {
    fixture.componentRef.setInput('title', 'Custom Title');
    expect(component.title()).toBe('Custom Title');
  });

  it('should accept custom subtitle key', () => {
    fixture.componentRef.setInput('subtitleKey', 'custom.subtitle');
    expect(component.subtitleKey()).toBe('custom.subtitle');
  });

  it('should update subtitle text on language change', () => {
    translateService.setTranslation('en', { home: { subtitle: 'Welcome to FrenzyDle' } });
    translateService.setTranslation('it', { home: { subtitle: 'Benvenuto in FrenzyDle' } });
    translateService.use('en');

    component.ngOnInit();
    expect(component.subtitleText()).toBe('Welcome to FrenzyDle');

    translateService.use('it');
    expect(component.subtitleText()).toBe('Benvenuto in FrenzyDle');
  });
});