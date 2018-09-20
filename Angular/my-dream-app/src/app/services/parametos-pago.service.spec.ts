import { TestBed, inject } from '@angular/core/testing';

import { ParametosPagoService } from './parametos-pago.service';

describe('ParametosPagoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParametosPagoService]
    });
  });

  it('should be created', inject([ParametosPagoService], (service: ParametosPagoService) => {
    expect(service).toBeTruthy();
  }));
});
