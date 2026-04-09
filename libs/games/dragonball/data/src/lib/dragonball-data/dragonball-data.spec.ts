import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragonballData } from './dragonball-data';

describe('DragonballData', () => {
  let component: DragonballData;
  let fixture: ComponentFixture<DragonballData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragonballData],
    }).compileComponents();

    fixture = TestBed.createComponent(DragonballData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
