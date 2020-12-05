import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'snmp-monitor-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.scss']
})
export class MenuTopComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = [
    'Go to Configuration101',
    'Go to client 101',
    'About',
    'Go to Updated clients'
  ];
  filteredOptions: Observable<string[]>;
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  onLogout() {
    this.authenticationService.logout();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
