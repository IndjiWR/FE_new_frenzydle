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
    component.navItems = [
      { label: 'nav.home', path: '/' },
      { label: 'nav.games', path: '/games' },
    ];
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('[data-testid^="nav-link-"]');
    expect(navLinks.length).toBe(2);
  });

  it('should display login button when not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('[data-testid="login-button"]');
    expect(loginButton).toBeTruthy();
  });

  it('should display user avatar when logged in', () => {
    component.isLoggedIn = true;
    component.userAvatar = 'test-avatar.png';
    component.userName = 'TestUser';
    fixture.detectChanges();

    const avatar = fixture.nativeElement.querySelector('[data-testid="user-avatar"]');
    expect(avatar).toBeTruthy();
  });

  it('should display avatar placeholder when no avatar', () => {
    component.isLoggedIn = true;
    component.userAvatar = '';
    component.userName = 'TestUser';
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('[data-testid="user-avatar-placeholder"]');
    expect(placeholder).toBeTruthy();
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
    component.isLoggedIn = false;
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('[data-testid="login-button"]');
    loginButton.click();

    expect(component.loginClick.emit).toHaveBeenCalled();
  });

  it('should display mobile menu button on mobile', () => {
    fixture.detectChanges();
    const mobileButton = fixture.nativeElement.querySelector('[data-testid="mobile-menu-button"]');
    expect(mobileButton).toBeTruthy();
  });
});