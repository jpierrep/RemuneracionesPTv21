import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAsistComponent } from './personal-asist.component';

describe('PersonalAsistComponent', () => {
  let component: PersonalAsistComponent;
  let fixture: ComponentFixture<PersonalAsistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAsistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAsistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
