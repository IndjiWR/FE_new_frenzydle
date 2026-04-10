import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo', () => {
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector('[data-testid="nav-logo"]');
    expect(logo).toBeTruthy();
  });

  it('should display desktop navigation links', () => {
    fixture.componentRef.setInput('navItems', [
      { label: 'nav.home', path: '/' },
      { label: 'nav.games', path: '/games' },
    ]);
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('[data-testid^="nav-link-"]');
    expect(navLinks.length).toBe(2);
  });

  it('should display login button when not logged in', () => {
    fixture.componentRef.setInput('isLoggedIn', false);
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('[data-testid="login-button"]');
    expect(loginButton).toBeTruthy();
  });

  it('should display user avatar when logged in', () => {
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.componentRef.setInput('userAvatar', 'test-avatar.png');
    fixture.componentRef.setInput('userName', 'TestUser');
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('[data-testid="user-avatar"]');
    expect(avatar).toBeTruthy();
  });

  it('should display avatar placeholder when no avatar', () => {
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.componentRef.setInput('userAvatar', '');
    fixture.componentRef.setInput('userName', 'TestUser');
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('[data-testid="user-avatar-placeholder"]');
    expect(placeholder).toBeTruthy();
  });

  it('should display user menu trigger when logged in', () => {
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.detectChanges();

    const menuTrigger = fixture.nativeElement.querySelector('[data-testid="user-menu-trigger"]');
    expect(menuTrigger).toBeTruthy();
  });

  it('should toggle user dropdown menu', () => {
    expect(component.isUserMenuOpen()).toBe(false);
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBe(true);
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBe(false);
  });

  it('should close user dropdown menu', () => {
    component.isUserMenuOpen.set(true);
    component.closeUserMenu();
    expect(component.isUserMenuOpen()).toBe(false);
  });

  it('should show login option in dropdown for guest users', () => {
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.componentRef.setInput('isGuest', true);
    fixture.detectChanges();

    // Open dropdown
    component.toggleUserMenu();
    fixture.detectChanges();

    const loginOption = fixture.nativeElement.querySelector('[data-testid="menu-login"]');
    expect(loginOption).toBeTruthy();
  });

  it('should NOT show login option in dropdown for registered users', () => {
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.componentRef.setInput('isGuest', false);
    fixture.detectChanges();

    // Open dropdown
    component.toggleUserMenu();
    fixture.detectChanges();

    const loginOption = fixture.nativeElement.querySelector('[data-testid="menu-login"]');
    expect(loginOption).toBeFalsy();
  });

  it('should show settings and logout options in dropdown', () => {
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.detectChanges();

    // Open dropdown
    component.toggleUserMenu();
    fixture.detectChanges();

    const settingsOption = fixture.nativeElement.querySelector('[data-testid="menu-settings"]');
    const logoutOption = fixture.nativeElement.querySelector('[data-testid="menu-logout"]');
    expect(settingsOption).toBeTruthy();
    expect(logoutOption).toBeTruthy();
  });

  it('should toggle mobile menu', () => {
    expect(component.isMobileMenuOpen()).toBe(false);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('should close mobile menu', () => {
    component.isMobileMenuOpen.set(true);
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('should emit loginClick when login button clicked', () => {
    jest.spyOn(component.loginClick, 'emit');
    fixture.componentRef.setInput('isLoggedIn', false);
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('[data-testid="login-button"]');
    loginButton.click();

    expect(component.loginClick.emit).toHaveBeenCalled();
  });

  it('should emit loginClick when menu login option clicked', () => {
    jest.spyOn(component.loginClick, 'emit');
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.componentRef.setInput('isGuest', true);
    fixture.detectChanges();

    // Open dropdown
    component.toggleUserMenu();
    fixture.detectChanges();

    const loginOption = fixture.nativeElement.querySelector('[data-testid="menu-login"]');
    loginOption.click();

    expect(component.loginClick.emit).toHaveBeenCalled();
    expect(component.isUserMenuOpen()).toBe(false);
  });

  it('should emit settingsClick when settings option clicked', () => {
    jest.spyOn(component.settingsClick, 'emit');
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.detectChanges();

    // Open dropdown
    component.toggleUserMenu();
    fixture.detectChanges();

    const settingsOption = fixture.nativeElement.querySelector('[data-testid="menu-settings"]');
    settingsOption.click();

    expect(component.settingsClick.emit).toHaveBeenCalled();
    expect(component.isUserMenuOpen()).toBe(false);
  });

  it('should emit logoutClick when logout option clicked', () => {
    jest.spyOn(component.logoutClick, 'emit');
    fixture.componentRef.setInput('isLoggedIn', true);
    fixture.detectChanges();

    // Open dropdown
    component.toggleUserMenu();
    fixture.detectChanges();

    const logoutOption = fixture.nativeElement.querySelector('[data-testid="menu-logout"]');
    logoutOption.click();

    expect(component.logoutClick.emit).toHaveBeenCalled();
    expect(component.isUserMenuOpen()).toBe(false);
  });

  it('should display mobile menu button on mobile', () => {
    fixture.detectChanges();
    const mobileButton = fixture.nativeElement.querySelector('[data-testid="mobile-menu-button"]');
    expect(mobileButton).toBeTruthy();
  });
});