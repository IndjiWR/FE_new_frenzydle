import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GuestTeaserComponent } from './guest-teaser.component';
import { AuthModalService } from '@shared/feature';

describe('GuestTeaserComponent', () => {
  let component: GuestTeaserComponent;
  let fixture: ComponentFixture<GuestTeaserComponent>;
  let mockAuthModalService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthModalService = {
      open: jest.fn(),
    };

    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GuestTeaserComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthModalService, useValue: mockAuthModalService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open auth modal on create account', () => {
    component.onCreateAccount();
    expect(mockAuthModalService.open).toHaveBeenCalled();
  });

  it('should navigate to home on maybe later', () => {
    component.onMaybeLater();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});