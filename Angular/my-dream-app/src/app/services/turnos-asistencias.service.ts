
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PersonalAsist} from './../models/personal-asist';
import { ResumenTurnos } from '../models/resumen-turnos';
import { TurnoDetalle } from '../models/turno-detalle';

@Injectable({
  providedIn: 'root'
})
export class TurnosAsistenciasService {

  constructor(private http: HttpClient) { 
      
  }
  webApiUrl: string='http://localhost:3800/api/asistencias/consolidaInfo2';
  UrlturnosPersona: string='http://localhost:3800/api/asistencias/turnosPersona';
  
  getResumenAsistencias(){
    return this.http.get<ResumenTurnos[]>(this.webApiUrl);
      //console.log("essssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
    //return this.arr;
      }

    getTurnosPersona(){
        return this.http.get<TurnoDetalle[]>(this.UrlturnosPersona);
          //console.log("essssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
        //return this.arr;
          }

}
