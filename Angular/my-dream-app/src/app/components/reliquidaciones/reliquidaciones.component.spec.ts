import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliquidacionesComponent } from './reliquidaciones.component';

describe('ReliquidacionesComponent', () => {
  let component: ReliquidacionesComponent;
  let fixture: ComponentFixture<ReliquidacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquidacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquidacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
