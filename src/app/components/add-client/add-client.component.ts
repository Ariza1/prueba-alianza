import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client } from 'src/app/core/models/client.model';
import { ClientService } from 'src/app/core/service/client.service';
import { mustBeBefore } from "../../core/utils/validations";


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent {
  formClient: FormGroup
  constructor(
    public dialogRef: MatDialogRef<AddClientComponent>,
    private fb: FormBuilder,
    private clientService: ClientService,
  ) {
    this.formClient = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(new RegExp(/^[a-zA-ZÀ-ÿ]+ [a-zA-ZÀ-ÿ]+$/))]],
      phone: [null, [Validators.required]],
      email: [null, [
        Validators.required,
        Validators.pattern(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))]],
      starDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]]
    },
      { validators: [mustBeBefore] })
  }


  create() {
    if (this.formClient.invalid) {
      return;
    }
    const { name, phone, email, starDate, endDate } = this.formClient.value
    let client: Client = {
      name,
      phone,
      email,
      starDate,
      endDate
    }
    this.clientService.addClients(client).subscribe(resp => {
      this.dialogRef.close(true)
      console.log(resp)
    })
  }

  get name() { return this.formClient.get('name'); }
  get phone() { return this.formClient.get('phone'); }
  get email() { return this.formClient.get('email'); }
  get starDate() { return this.formClient.get('starDate'); }
  get endDate() { return this.formClient.get('endDate'); }

}
