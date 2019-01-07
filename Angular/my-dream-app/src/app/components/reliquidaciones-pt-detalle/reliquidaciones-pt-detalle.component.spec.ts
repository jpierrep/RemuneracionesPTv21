import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliquidacionesPTDetalleComponent } from './reliquidaciones-pt-detalle.component';

describe('ReliquidacionesPTDetalleComponent', () => {
  let component: ReliquidacionesPTDetalleComponent;
  let fixture: ComponentFixture<ReliquidacionesPTDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquidacionesPTDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquidacionesPTDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
