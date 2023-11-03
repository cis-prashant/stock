import { TestBed } from '@angular/core/testing';

import { OptionStrategyService } from './option-strategy.service';

describe('OptionStrategyService', () => {
  let service: OptionStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
