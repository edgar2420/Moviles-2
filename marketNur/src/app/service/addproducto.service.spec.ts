import { TestBed } from '@angular/core/testing';

import { AddproductoService } from './addproducto.service';

describe('AddproductoService', () => {
  let service: AddproductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddproductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
