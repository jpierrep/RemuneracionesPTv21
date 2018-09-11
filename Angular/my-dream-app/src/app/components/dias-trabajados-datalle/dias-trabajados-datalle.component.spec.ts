import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasTrabajadosDatalleComponent } from './dias-trabajados-datalle.component';

describe('DiasTrabajadosDatalleComponent', () => {
  let component: DiasTrabajadosDatalleComponent;
  let fixture: ComponentFixture<DiasTrabajadosDatalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiasTrabajadosDatalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiasTrabajadosDatalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
