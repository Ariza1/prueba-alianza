import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ExcelService } from './core/service/excel.service';
import { AddClientComponent } from './components/add-client/add-client.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from './core/service/client.service';
import { Client } from './core/models/client.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  enableDownload: boolean = false;
  data: Client[] = [];
  formkey: FormGroup;
  formAdvanced: FormGroup;
  showCard: boolean = false;

  constructor(
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private clientService: ClientService,
    private excelService: ExcelService,
    private fb: FormBuilder
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.formkey = this.fb.group({
      searchkey: [null, [Validators.required]]
    })
    this.formAdvanced = this.fb.group({
      name: [null, [Validators.pattern(new RegExp(/^[a-zA-ZÀ-ÿ]+ [a-zA-ZÀ-ÿ]+$/))]],
      phone: [null],
      email: [null, [
        Validators.pattern(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))]],
      starDate: [null],
      endDate: [null]
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  advancedSearch() {
    if (this.formAdvanced.invalid) {
      return;
    }
    const { name, phone, email, starDate, endDate } = this.formAdvanced.value;
    let data = { name, phone, email, starDate, endDate }
    this.clientService.advacedSearch(data).subscribe(resp => this.data = resp)
  }

  downloadExcel(): any {
    let headers = ['sharedKey', 'name', 'phone', 'email', 'starDate', 'endDate']
    this.excelService.exportExcelWhitHeaders(this.data, "Clients", headers)
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddClientComponent, {});

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getClient()
      }
    });
  }

  cancelSearch() {
    this.formAdvanced.reset();
    this.showCard = false
  }

  getClient() {
    if (this.formkey.invalid) {
      return;
    }
    const { searchkey } = this.formkey.value
    this.clientService.getClientsBySharedkey(searchkey).subscribe(resp => this.data = resp)
  }

  get name() { return this.formAdvanced.get('name'); }
  get phone() { return this.formAdvanced.get('phone'); }
  get email() { return this.formAdvanced.get('email'); }
  get starDate() { return this.formAdvanced.get('starDate'); }
  get endDate() { return this.formAdvanced.get('endDate'); }
}
