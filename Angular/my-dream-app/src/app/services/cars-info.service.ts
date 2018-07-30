import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
//import { HttpClient } from '../../../node_modules/@types/selenium-webdriver/http';
import {Cars} from './../models/cars';

@Injectable({
  providedIn: 'root'
})
export class CarsInfoService {

   arr: Cars[] = [
    { "brand": "aaaaa", "year":1991, "color":"amarillo","vin":"wasd" },
    { "brand": "eeeee", "year":2012, "color":"rojo","vin":"aasss" },
    { "brand": "iiiii", "year":2002, "color":"azul","vin":"asdasd" },
    { "brand": "aaaaa", "year":2003, "color":"amarillo","vin":"aaaaaa" },
    { "brand": "ooooo", "year":2001, "color":"azul","vin":"dadsa" },
    { "brand": "uuuu", "year":2019, "color":"amarillo","vin":"adsss" }
];

  webApiUrl: string='https://www.primefaces.org/primeng/assets/showcase/data/cars-small.json';

  constructor(private http: HttpClient) { }
  
  getAllCars(){
//return this.http.get<Cars[]>(this.webApiUrl);
  console.log("essssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
return this.arr;
  }


}
