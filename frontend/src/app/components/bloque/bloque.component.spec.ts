import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueComponent } from './bloque.component';

describe('BloqueComponent', () => {
  let component: BloqueComponent;
  let fixture: ComponentFixture<BloqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
