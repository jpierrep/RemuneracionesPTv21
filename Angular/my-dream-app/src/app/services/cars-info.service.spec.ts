import { TestBed, inject } from '@angular/core/testing';

import { CarsInfoService } from './cars-info.service';

describe('CarsInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarsInfoService]
    });
  });

  it('should be created', inject([CarsInfoService], (service: CarsInfoService) => {
    expect(service).toBeTruthy();
  }));
});
