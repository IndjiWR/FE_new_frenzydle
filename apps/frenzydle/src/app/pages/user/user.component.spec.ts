import { TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});