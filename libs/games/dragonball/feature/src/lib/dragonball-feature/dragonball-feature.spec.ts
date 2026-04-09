import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragonballFeature } from './dragonball-feature';

describe('DragonballFeature', () => {
  let component: DragonballFeature;
  let fixture: ComponentFixture<DragonballFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragonballFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(DragonballFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
