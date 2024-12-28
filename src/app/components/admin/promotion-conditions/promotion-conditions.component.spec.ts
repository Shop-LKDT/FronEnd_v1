import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionConditionsComponent } from './promotion-conditions.component';

describe('PromotionConditionsComponent', () => {
  let component: PromotionConditionsComponent;
  let fixture: ComponentFixture<PromotionConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionConditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
