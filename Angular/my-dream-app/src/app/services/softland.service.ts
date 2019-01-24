
import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SoftlandService {

  constructor(private http: HttpClient) { }


  webApiUrl: string='http://localhost:3800/softland/getVariableMes';

//http://localhost:3800/softland/getVariableMes/0/2019-01/H303

  
  
  getVariableMes(empresa,fecha,variable){

    return this.http.get<any[]>(this.webApiUrl+'/'+empresa+'/'+fecha+'/'+variable);
      }

}
