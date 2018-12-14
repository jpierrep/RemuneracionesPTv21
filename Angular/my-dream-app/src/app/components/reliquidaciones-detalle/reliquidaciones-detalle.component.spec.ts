import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliquidacionesDetalleComponent } from './reliquidaciones-detalle.component';

describe('ReliquidacionesDetalleComponent', () => {
  let component: ReliquidacionesDetalleComponent;
  let fixture: ComponentFixture<ReliquidacionesDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquidacionesDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquidacionesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
