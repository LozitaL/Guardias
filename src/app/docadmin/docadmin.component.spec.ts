import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocadminComponent } from './docadmin.component';

describe('DocadminComponent', () => {
  let component: DocadminComponent;
  let fixture: ComponentFixture<DocadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
