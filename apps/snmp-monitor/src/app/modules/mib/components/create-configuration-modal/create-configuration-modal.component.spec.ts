import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConfigurationModalComponent } from './create-configuration-modal.component';

describe('CreateConfigurationModalComponent', () => {
  let component: CreateConfigurationModalComponent;
  let fixture: ComponentFixture<CreateConfigurationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateConfigurationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
