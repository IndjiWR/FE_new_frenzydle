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
});