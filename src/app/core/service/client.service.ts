import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private URL = environment.url
  requestOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private _httpClient: HttpClient
  ) { }

  getClients(): Observable<any> {
    return this._httpClient.get(this.URL + 'clients', this.requestOptions)
  }

  getClientsBySharedkey(sharedkey: string): Observable<any> {
    return this._httpClient.get(this.URL + `clients/${sharedkey}`, this.requestOptions)
  }

  addClients(client: Client): Observable<any> {
    return this._httpClient.post(this.URL + 'clients', client, this.requestOptions)
  }
}
