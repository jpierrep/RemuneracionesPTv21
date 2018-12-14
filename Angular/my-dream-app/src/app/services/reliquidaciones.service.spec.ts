import { TestBed } from '@angular/core/testing';

import { ReliquidacionesService } from './reliquidaciones.service';

describe('ReliquidacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReliquidacionesService = TestBed.get(ReliquidacionesService);
    expect(service).toBeTruthy();
  });
});
