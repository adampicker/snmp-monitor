import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'snmp-monitor-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.scss']
})
export class MenuTopComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  onLogout() {
    this.authenticationService.logout();
  }
}
