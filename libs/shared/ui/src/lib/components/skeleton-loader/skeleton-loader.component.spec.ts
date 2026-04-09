import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of skeleton cards', () => {
    component.count = 4;
    component.type = 'card';
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.skeleton-card-item');
    expect(cards.length).toBe(4);
  });

  it('should render text skeleton with custom dimensions', () => {
    component.type = 'text';
    component.width = '200px';
    component.height = '2rem';
    fixture.detectChanges();

    const textSkeleton = fixture.nativeElement.querySelector('.skeleton-text');
    expect(textSkeleton.style.width).toBe('200px');
    expect(textSkeleton.style.height).toBe('2rem');
  });

  it('should render circle skeletons', () => {
    component.type = 'circle';
    component.count = 3;
    fixture.detectChanges();

    const circles = fixture.nativeElement.querySelectorAll('.skeleton-circle');
    expect(circles.length).toBe(3);
  });

  it('should default to 3 cards', () => {
    expect(component.count).toBe(3);
  });
});