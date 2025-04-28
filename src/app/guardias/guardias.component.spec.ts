import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasComponent } from './guardias.component';

describe('GuardiasComponent', () => {
  let component: GuardiasComponent;
  let fixture: ComponentFixture<GuardiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
