import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliquidacionesAllComponent } from './reliquidaciones-all.component';

describe('ReliquidacionesAllComponent', () => {
  let component: ReliquidacionesAllComponent;
  let fixture: ComponentFixture<ReliquidacionesAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReliquidacionesAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliquidacionesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
