import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
//import { HttpClient } from '../../../node_modules/@types/selenium-webdriver/http';
import {Cars} from './../models/cars';

@Injectable({
  providedIn: 'root'
})
export class CarsInfoService {

   arr: Cars[] = [
    { "brand": "asd", "year":2000, "color":"rojo","vin":"asdas" },
    { "brand": "asd", "year":2000, "color":"rojo","vin":"asdas" }
];

  webApiUrl: string='https://www.primefaces.org/primeng/assets/showcase/data/cars-small.json';

  constructor(private http: HttpClient) { }
  
  getAllCars(){
//return this.http.get<Cars[]>(this.webApiUrl);
  console.log("essssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
return this.arr;
  }


}
