import { TestBed } from '@angular/core/testing';

import { TeoriaService } from './teoria.service';

describe('TeoriaService', () => {
  let service: TeoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
