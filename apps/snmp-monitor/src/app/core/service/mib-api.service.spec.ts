import { TestBed } from '@angular/core/testing';

import { MibApiService } from './mib-api.service';

describe('MibApiService', () => {
  let service: MibApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MibApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
