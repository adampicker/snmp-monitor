import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardApiService } from 'apps/snmp-monitor/src/app/core/service/dashboard-api.service';
import { DashboardData } from '../model/model';

@Component({
  selector: 'snmp-monitor-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData = null;
  constructor(
    private router: Router,
    private dashboardApiService: DashboardApiService
  ) {}

  ngOnInit(): void {
    this.dashboardApiService.getDashboardData().subscribe();
  }

  onAddNewClient(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate(['../clients']);
  }
  onAddNewConfiguration(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate(['../configuration']);
  }
  onAssignConfiguration(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate(['../configuration']);
  }

  onReportIssueClick(event: any) {
    console.error('TODO');
    event.stopPropagation();
    event.preventDefault();
  }
  onGuidelineClick(event: any) {
    console.error('TODO');
    event.stopPropagation();
    event.preventDefault();
  }
  onAboutClick(event: any) {
    console.error('TODO');
    event.stopPropagation();
    event.preventDefault();
  }

  getDashboardData() {}
}
