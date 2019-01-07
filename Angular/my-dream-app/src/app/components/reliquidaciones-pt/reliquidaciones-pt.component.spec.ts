import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliquidacionesPTComponent } from './reliquidaciones-pt.component';

describe('ReliquidacionesPTComponent', () => {
  let component: ReliquidacionesPTComponent;
  let fixture: ComponentFixture<ReliquidacionesPTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquidacionesPTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquidacionesPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
