import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileMenuComponent } from './mobile-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('MobileMenuComponent', () => {
  let component: MobileMenuComponent;
  let fixture: ComponentFixture<MobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenuComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display nav items', () => {
    fixture.componentRef.setInput('navItems', [
      { label: 'nav.home', path: '/' },
      { label: 'nav.games', path: '/games' },
    ]);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
  });

  it('should emit close when backdrop is clicked', () => {
    jest.spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('[data-testid="mobile-menu-backdrop"]');
    backdrop.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close when close button is clicked', () => {
    jest.spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('[data-testid="mobile-menu-close"]');
    closeButton.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit navigate when nav item is clicked', () => {
    jest.spyOn(component.navigate, 'emit');
    jest.spyOn(component.close, 'emit');
    fixture.componentRef.setInput('navItems', [{ label: 'nav.home', path: '/' }]);
    fixture.detectChanges();

    const navItem = fixture.nativeElement.querySelector('[data-testid="mobile-nav-nav.home"]');
    navItem.click();

    expect(component.navigate.emit).toHaveBeenCalledWith('/');
    expect(component.close.emit).toHaveBeenCalled();
  });
});