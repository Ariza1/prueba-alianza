import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/core/models/client.model';
import { ClientService } from 'src/app/core/service/client.service';
import { ExcelService } from 'src/app/core/service/excel.service';
import { AddClientComponent } from '../add-client/add-client.component';

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.scss']
})
export class TableClientsComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['sharedKey', 'businessId', 'email', 'phone', 'dateAdded'];
  dataSource = new MatTableDataSource();
  data: Client[] = [];
  enableDownload: boolean = false;

  constructor(
    public dialog: MatDialog,
    private clientService: ClientService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.getAllClients()
  }

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

  getAllClients() {
    this.clientService.getClients().subscribe(resp => {
      this.dataSource.data = this.data = resp
      this.enableDownload = true;
    })
  }

  downloadExcel(): any {
    let headers = ['sharedKey', 'name', 'phone', 'email', 'starDate', 'endDate']
    this.excelService.exportExcelWhitHeaders(this.data, "Clients", headers)
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddClientComponent, {});

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getAllClients()
      }
    });
  }

}
