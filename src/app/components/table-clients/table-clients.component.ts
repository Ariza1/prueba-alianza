import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.scss']
})
export class TableClientsComponent implements AfterViewInit {

  dataSource!: MatTableDataSource<Client>;

  @Input() set clients(value: Client[]){
    this.dataSource = new MatTableDataSource(value);
  }
  displayedColumns: string[] = ['sharedKey', 'businessId', 'email', 'phone', 'dateAdded'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor() { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }







}
