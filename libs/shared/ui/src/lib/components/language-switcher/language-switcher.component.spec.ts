import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@shared/data';
import { signal } from '@angular/core';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let languageService: jest.Mocked<LanguageService>;

  beforeEach(async () => {
    const mockLanguageService = {
      languages: [
        { code: 'en', name: 'English' },
        { code: 'it', name: 'Italiano' },
        { code: 'fr', name: 'Français' },
        { code: 'es', name: 'Español' },
        { code: 'pt', name: 'Português' },
      ],
      language: signal('en'),
      setLanguage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent, TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: mockLanguageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    languageService = TestBed.inject(LanguageService) as jest.Mocked<LanguageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display languages', () => {
    fixture.detectChanges();
    expect(component.languages.length).toBe(5);
  });

  it('should toggle dropdown', () => {
    expect(component.isOpen()).toBe(false);
    component.toggleDropdown();
    expect(component.isOpen()).toBe(true);
    component.toggleDropdown();
    expect(component.isOpen()).toBe(false);
  });

  it('should select language', () => {
    jest.spyOn(component.languageChange, 'emit');

    component.selectLanguage('it');

    expect(languageService.setLanguage).toHaveBeenCalledWith('it');
    expect(component.languageChange.emit).toHaveBeenCalledWith('it');
    expect(component.isOpen()).toBe(false);
  });

  it('should close dropdown after selection', () => {
    component.isOpen.set(true);
    component.selectLanguage('it');
    expect(component.isOpen()).toBe(false);
  });

  it('should compute current language info', () => {
    // Signal starts with 'en'
    expect(component.currentLang().code).toBe('en');
    expect(component.currentLang().name).toBe('English');

    // Update the signal
    languageService.language.set('it');
    fixture.detectChanges();

    expect(component.currentLang().code).toBe('it');
    expect(component.currentLang().name).toBe('Italiano');
  });

  it('should close dropdown when clicking outside', () => {
    component.isOpen.set(true);
    expect(component.isOpen()).toBe(true);

    // Simulate clicking outside by calling onClickOutside with a target not in the component
    const outsideElement = document.createElement('div');
    component.onClickOutside(outsideElement);

    expect(component.isOpen()).toBe(false);
  });

  it('should not close dropdown when clicking inside', () => {
    component.isOpen.set(true);
    expect(component.isOpen()).toBe(true);

    // Simulate clicking inside by calling onClickOutside with null
    component.onClickOutside(null);

    // Dropdown should still be open (no crash, no change)
    expect(component.isOpen()).toBe(true);
  });

  it('should not close dropdown if already closed when clicking outside', () => {
    component.isOpen.set(false);

    const outsideElement = document.createElement('div');
    component.onClickOutside(outsideElement);

    expect(component.isOpen()).toBe(false);
  });
});