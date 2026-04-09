import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragonballUi } from './dragonball-ui';

describe('DragonballUi', () => {
  let component: DragonballUi;
  let fixture: ComponentFixture<DragonballUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragonballUi],
    }).compileComponents();

    fixture = TestBed.createComponent(DragonballUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
