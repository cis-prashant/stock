import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionStrategyComponent } from './option-strategy.component';

describe('OptionStrategyComponent', () => {
  let component: OptionStrategyComponent;
  let fixture: ComponentFixture<OptionStrategyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionStrategyComponent]
    });
    fixture = TestBed.createComponent(OptionStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
