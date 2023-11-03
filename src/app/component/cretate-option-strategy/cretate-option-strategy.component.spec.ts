import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CretateOptionStrategyComponent } from './cretate-option-strategy.component';

describe('CretateOptionStrategyComponent', () => {
  let component: CretateOptionStrategyComponent;
  let fixture: ComponentFixture<CretateOptionStrategyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CretateOptionStrategyComponent]
    });
    fixture = TestBed.createComponent(CretateOptionStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
