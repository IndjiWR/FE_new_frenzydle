import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent, TranslateModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display game page', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.game-page');
    expect(element).toBeTruthy();
  });
});