import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFormComponent } from './movie-form';

describe('MovieForm', () => {
  let component: MovieFormComponent;
  let fixture: ComponentFixture<MovieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
