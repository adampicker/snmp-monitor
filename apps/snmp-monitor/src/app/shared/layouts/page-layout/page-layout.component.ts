import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'snmp-monitor-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          width: '256px'
        })
      ),
      state(
        'closed',
        style({
          width: '80px'
        })
      ),
      transition('open => closed', [animate('150ms')]),
      transition('closed => open', [animate('150ms')])
    ])
  ]
})
export class PageLayoutComponent implements OnInit {
  isOpen = false;
  constructor() {}

  ngOnInit(): void {}

  enter() {
    this.isOpen = true;
  }

  leave() {
    this.isOpen = false;
  }
}
