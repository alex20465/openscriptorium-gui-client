/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExecuterService } from './executer.service';

describe('ExecuterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExecuterService]
    });
  });

  it('should ...', inject([ExecuterService], (service: ExecuterService) => {
    expect(service).toBeTruthy();
  }));
});
