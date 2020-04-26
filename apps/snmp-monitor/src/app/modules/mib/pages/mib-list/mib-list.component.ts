import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MibService } from '../../service/mib.service';
import { Mib } from 'apps/snmp-monitor/src/app/shared/model/snmp.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'snmp-monitor-mib-list',
  templateUrl: './mib-list.component.html',
  styleUrls: ['./mib-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MibListComponent implements OnInit {
  public dataSource = new MatTableDataSource<Mib>();
  public displayedColumns = ['oid', 'description', 'telnetShortcut', 'unit'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  description: string;
  oid: string;
  telnetShortcut: string;
  unit: string;
  constructor(private mibService: MibService) {}
  ngOnInit(): void {
    this.mibService.getAllMibs().subscribe(res => {
      console.log(res);
      this.dataSource.data = res;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
