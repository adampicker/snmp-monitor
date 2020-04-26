import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MibListComponent } from './mib-list.component';

describe('MibListComponent', () => {
  let component: MibListComponent;
  let fixture: ComponentFixture<MibListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MibListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MibListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
