import { TestBed } from '@angular/core/testing';

import { SoftlandService } from './softland.service';

describe('SoftlandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoftlandService = TestBed.get(SoftlandService);
    expect(service).toBeTruthy();
  });
});
