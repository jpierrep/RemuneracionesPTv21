import { TestBed, inject } from '@angular/core/testing';

import { TurnosAsistenciasService } from './turnos-asistencias.service';

describe('TurnosAsistenciasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnosAsistenciasService]
    });
  });

  it('should be created', inject([TurnosAsistenciasService], (service: TurnosAsistenciasService) => {
    expect(service).toBeTruthy();
  }));
});
