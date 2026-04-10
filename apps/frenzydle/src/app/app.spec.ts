import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App, TranslateModule.forRoot(), RouterModule.forRoot([])],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title FrenzyDle', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toBe('FrenzyDle');
  });

  it('should render nav-bar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have nav items', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.navItems.length).toBe(2);
    expect(app.navItems[0].label).toBe('nav.home');
    expect(app.navItems[0].path).toBe('/');
  });

  it('should have default user state', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isLoggedIn()).toBe(false);
    expect(app.userName).toBe('Guest');
    expect(app.userAvatar).toBe('');
  });

  it('should toggle logged in state on logout', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.isLoggedIn.set(true);
    expect(app.isLoggedIn()).toBe(true);

    app.onLogoutClick();
    expect(app.isLoggedIn()).toBe(false);
  });

  it('should handle login click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // Should not throw
    expect(() => app.onLoginClick()).not.toThrow();
  });
});