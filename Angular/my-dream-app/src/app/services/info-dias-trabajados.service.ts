
import { Injectable } from '@angular/core';
import {HttpClient} from  '@angular/common/http';
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
 webApiUrl: string='http://localhost:3800/api/generaProceso';
 webgetPerson:string='http://localhost:3800/api/getPersona/'
  constructor(private http: HttpClient) { }
  
  //getAllDiasTrab(formdata:any){
    getAllDiasTrab(){
    //console.log(this.http.get<DiasTrabajados[]>(this.webApiUrl));

    return this.http.get<DiasTrabajados[]>(this.webApiUrl);
   // return this.http.post<DiasTrabajados[]>(this.webApiUrl,formdata);


//return this.arr;
  }

  getAllDiasTrabFile(dataForm){
    //console.log(this.http.get<DiasTrabajados[]>(this.webApiUrl));
   const fd=new  FormData();
   fd.append('file',dataForm);
    return this.http.post<DiasTrabajados[]>("http://localhost:3800/api/generaProcesoUpload",fd);
   // return this.http.post<DiasTrabajados[]>(this.webApiUrl,formdata);


//return this.arr;
  }


  getOnePers(rut_id:string){
    return this.http.get<DiasTrabajados[]>(this.webgetPerson+rut_id)
  
    }



}
