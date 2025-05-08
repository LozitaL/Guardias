import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocusersComponent } from './docusers.component';

describe('DocusersComponent', () => {
  let component: DocusersComponent;
  let fixture: ComponentFixture<DocusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocusersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
