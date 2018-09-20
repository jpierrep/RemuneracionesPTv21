import { Injectable } from '@angular/core';
import {HttpClient} from  '@angular/common/http';
import {Parametro} from './../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class ParametosPagoService {


 // webApiUrl: string='https://www.primefaces.org/primeng/assets/showcase/data/cars-small.json';
 webApiUrl: string='http://localhost:3800/api/parameters/getAll';
  constructor(private http: HttpClient) { }
  
  //getAllDiasTrab(formdata:any){
    getAllParams(){
    //console.log(this.http.get<DiasTrabajados[]>(this.webApiUrl));

    return this.http.get<Parametro[]>(this.webApiUrl);
   // return this.http.post<DiasTrabajados[]>(this.webApiUrl,formdata);


//return this.arr;
  }

}
