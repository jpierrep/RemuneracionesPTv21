import { TestBed, inject } from '@angular/core/testing';

import { InfoDiasTrabajadosService } from './info-dias-trabajados.service';

describe('InfoDiasTrabajadosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoDiasTrabajadosService]
    });
  });

  it('should be created', inject([InfoDiasTrabajadosService], (service: InfoDiasTrabajadosService) => {
    expect(service).toBeTruthy();
  }));
});
