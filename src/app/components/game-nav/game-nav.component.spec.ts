import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNavComponent } from './game-nav.component';

describe('GameNavComponent', () => {
  let component: GameNavComponent;
  let fixture: ComponentFixture<GameNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
