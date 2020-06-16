import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationInfoModalComponent } from './configuration-info-modal.component';

describe('ConfigurationInfoModalComponent', () => {
  let component: ConfigurationInfoModalComponent;
  let fixture: ComponentFixture<ConfigurationInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
