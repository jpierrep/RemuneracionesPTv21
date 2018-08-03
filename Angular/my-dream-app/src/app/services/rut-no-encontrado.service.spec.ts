import { TestBed, inject } from '@angular/core/testing';

import { RutNoEncontradoService } from './rut-no-encontrado.service';

describe('RutNoEncontradoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RutNoEncontradoService]
    });
  });

  it('should be created', inject([RutNoEncontradoService], (service: RutNoEncontradoService) => {
    expect(service).toBeTruthy();
  }));
});
