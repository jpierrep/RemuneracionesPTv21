
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DiasTrabajados} from './../models/dias-trabajados';

@Injectable({
  providedIn: 'root'
})
export class InfoDiasTrabajadosService {

  /*
   arr: Cars[] = [
    { "brand": "aaaaa", "year":1991, "color":"amarillo","vin":"wasd" },
    { "brand": "eeeee", "year":2012, "color":"rojo","vin":"aasss" },
    { "brand": "iiiii", "year":2002, "color":"azul","vin":"asdasd" },
    { "brand": "aaaaa", "year":2003, "color":"amarillo","vin":"aaaaaa" },
    { "brand": "ooooo", "year":2001, "color":"azul","vin":"dadsa" },
    { "brand": "uuuu", "year":2019, "color":"amarillo","vin":"adsss" }
];
*/

 // webApiUrl: string='https://www.primefaces.org/primeng/assets/showcase/data/cars-small.json';
 webApiUrl: string='http://localhost:5000/asistDiasTrab';
  constructor(private http: HttpClient) { }
  
  getAllDiasTrab(){
    console.log(this.http.get<DiasTrabajados[]>(this.webApiUrl));
return this.http.get<DiasTrabajados[]>(this.webApiUrl);

//return this.arr;
  }


}
