import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultPopupComponent } from './result-popup.component';

describe('ResultPopupComponent', () => {
  let component: ResultPopupComponent;
  let fixture: ComponentFixture<ResultPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
