import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosPagoComponent } from './parametros-pago.component';

describe('ParametrosPagoComponent', () => {
  let component: ParametrosPagoComponent;
  let fixture: ComponentFixture<ParametrosPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
