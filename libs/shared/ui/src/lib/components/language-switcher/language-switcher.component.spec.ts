import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent, TranslateModule.forRoot()],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
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
    jest.spyOn(translateService, 'use');

    component.selectLanguage('it');

    expect(component.currentLanguage()).toBe('it');
    expect(component.languageChange.emit).toHaveBeenCalledWith('it');
    expect(translateService.use).toHaveBeenCalledWith('it');
  });

  it('should close dropdown after selection', () => {
    component.isOpen.set(true);
    component.selectLanguage('it');
    expect(component.isOpen()).toBe(false);
  });

  it('should persist language to localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    component.selectLanguage('es');

    expect(setItemSpy).toHaveBeenCalledWith('frenzydle_language', 'es');
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