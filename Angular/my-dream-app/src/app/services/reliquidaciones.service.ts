
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PersonalAsist} from './../models/personal-asist';
import { ResumenTurnos } from '../models/resumen-turnos';
import { TurnoDetalle } from '../models/turno-detalle';

@Injectable({
  providedIn: 'root'
})
export class ReliquidacionesService {

  constructor(private http: HttpClient) { 
      
  }
  webApiUrl: string='http://localhost:3800/reliquida/generaProcesoReliquida';
  urlRemuneracionesArch: string='http://localhost:3800/reliquida/getRemuneracionesArchivo';
  urlFechasRemuneracionesArch: string='http://localhost:3800/reliquida/getFechasRemuneracionesArchivo';
  
  
  getReliquidaciones(){
    return this.http.get<any[]>(this.webApiUrl);
      //console.log("essssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
    //return this.arr;
      }

      getRemuneracionesArchivo(fecha){
        
        let urlParameter=this.urlRemuneracionesArch;
        if (fecha){
           urlParameter=this.urlRemuneracionesArch+'/'+fecha;
        }
        return this.http.get<any[]>(urlParameter);

      }

      getFechasRemuneracionesArchivo(){
        return this.http.get<any[]>(this.urlFechasRemuneracionesArch);

          }



}
