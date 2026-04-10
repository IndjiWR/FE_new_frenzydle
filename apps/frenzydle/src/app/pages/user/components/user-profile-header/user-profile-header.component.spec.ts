import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfileHeaderComponent } from './user-profile-header.component';
import { UserProfile } from '@shared/data';

describe('UserProfileHeaderComponent', () => {
  let component: UserProfileHeaderComponent;
  let fixture: ComponentFixture<UserProfileHeaderComponent>;

  const mockUser: UserProfile = {
    id: 'user-123',
    displayName: 'TestUser',
    email: 'test@example.com',
    isGuest: false,
    avatarUrl: null,
    createdAt: '2026-01-01T00:00:00Z',
  };

  const createComponent = (inputs: { user?: UserProfile | null; isGuest?: boolean; isDarkTheme?: boolean } = {}) => {
    fixture = TestBed.createComponent(UserProfileHeaderComponent);
    component = fixture.componentInstance;

    if (inputs.user !== undefined) {
      fixture.componentRef.setInput('user', inputs.user);
    }
    if (inputs.isGuest !== undefined) {
      fixture.componentRef.setInput('isGuest', inputs.isGuest);
    }
    if (inputs.isDarkTheme !== undefined) {
      fixture.componentRef.setInput('isDarkTheme', inputs.isDarkTheme);
    }

    fixture.detectChanges();
    return { component, fixture };
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileHeaderComponent, TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should have default inputs', () => {
    createComponent();
    expect(component.user()).toBeNull();
    expect(component.isGuest()).toBe(true);
    expect(component.isDarkTheme()).toBe(false);
  });

  it('should compute display name from user', () => {
    createComponent({ user: mockUser });
    expect(component.displayName()).toBe('TestUser');
  });

  it('should compute email from user', () => {
    createComponent({ user: mockUser });
    expect(component.email()).toBe('test@example.com');
  });

  it('should compute initial from display name', () => {
    createComponent({ user: mockUser });
    expect(component.initial()).toBe('T');
  });

  it('should return default values when user is null', () => {
    createComponent({ user: null });
    expect(component.displayName()).toBe('Guest');
    expect(component.email()).toBeNull();
    expect(component.initial()).toBe('G');
  });

  it('should start editing', () => {
    createComponent({ user: mockUser });
    component.startEdit();
    expect(component.isEditing()).toBe(true);
    expect(component.editValue()).toBe('TestUser');
  });

  it('should cancel editing', () => {
    createComponent({ user: mockUser });
    component.startEdit();
    component.cancelEdit();
    expect(component.isEditing()).toBe(false);
    expect(component.editValue()).toBe('');
  });

  it('should emit display name change on confirm', () => {
    createComponent({ user: mockUser });
    const emitSpy = jest.spyOn(component.displayNameChange, 'emit');
    component.editValue.set('NewName');
    component.confirmEdit();

    expect(emitSpy).toHaveBeenCalledWith('NewName');
    expect(component.isEditing()).toBe(false);
  });

  it('should not emit if name is same', () => {
    createComponent({ user: mockUser });
    const emitSpy = jest.spyOn(component.displayNameChange, 'emit');
    component.editValue.set('TestUser');
    component.confirmEdit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit if name is empty', () => {
    createComponent({ user: mockUser });
    const emitSpy = jest.spyOn(component.displayNameChange, 'emit');
    component.editValue.set('   ');
    component.confirmEdit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should confirm on Enter key', () => {
    createComponent({ user: mockUser });
    component.startEdit();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.onKeyDown(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.isEditing()).toBe(false);
  });

  it('should cancel on Escape key', () => {
    createComponent({ user: mockUser });
    component.startEdit();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    component.onKeyDown(event);

    expect(component.isEditing()).toBe(false);
  });
});