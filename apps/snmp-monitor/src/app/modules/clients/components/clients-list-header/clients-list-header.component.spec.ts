import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsListHeaderComponent } from './clients-list-header.component';

describe('ClientsListHeaderComponent', () => {
  let component: ClientsListHeaderComponent;
  let fixture: ComponentFixture<ClientsListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
