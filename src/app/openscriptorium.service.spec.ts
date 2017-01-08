/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpenscriptoriumService } from './openscriptorium.service';

describe('OpenscriptoriumService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenscriptoriumService]
    });
  });

  it('should ...', inject([OpenscriptoriumService], (service: OpenscriptoriumService) => {
    expect(service).toBeTruthy();
  }));
});
