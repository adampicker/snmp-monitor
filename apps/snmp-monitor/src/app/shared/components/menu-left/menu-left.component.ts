import { Component, OnInit } from '@angular/core';
import { menuLeftConfig } from './menu-left.config';
import { Router } from '@angular/router';

@Component({
  selector: 'snmp-monitor-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit {
  config = menuLeftConfig;
  constructor(private router: Router) {
    console.log('tworze się!!');
  }

  ngOnInit(): void {}

  onMenuLeftClick(item: { key: string; label: string; icon: string }) {
    this.router.navigate(['../', item.key]);
  }
}
