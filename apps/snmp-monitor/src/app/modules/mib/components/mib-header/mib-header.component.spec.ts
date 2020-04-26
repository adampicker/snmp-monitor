import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MibHeaderComponent } from './mib-header.component';

describe('MibHeaderComponent', () => {
  let component: MibHeaderComponent;
  let fixture: ComponentFixture<MibHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MibHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MibHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
