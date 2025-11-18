import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeoriaComponent } from './teoria.component';

describe('TeoriaComponent', () => {
  let component: TeoriaComponent;
  let fixture: ComponentFixture<TeoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
