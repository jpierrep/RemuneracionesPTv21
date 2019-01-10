
import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
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
  urlPlantillas:string='http://localhost:3800/varSoft/getPlantillas';
  urlPlantillasVariablesOne:string='http://localhost:3800/varSoft/getPlantillaVarsOne';
  urlRemuneracionesPT:string='http://localhost:3800/reliquida/generaProcesoReliquidaPartTime';

  
  
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



     

      creaVariablesPlantilla(plantilla){

        // plantilla={name:'Plantilla Reliquidaciones',variables:[{field:'C.COSTO',variable:'H003'},{field:'DIAS_LICENCIA',variable:'H082'}]};
         let headers=new HttpHeaders().set('Content-Type','application/json'); 
         //console.log(this.http.get<DiasTrabajados[]>(this.webApiUrl));
         plantilla={plantilla:plantilla};
         console.log(plantilla);

         console.log(JSON.stringify(plantilla))
         console.log(JSON.parse(JSON.stringify(plantilla)))
          //  const fd=new  FormData();
          // fd.append('plantilla',JSON.stringify(plantilla));
            return this.http.post("http://localhost:3800/varSoft/creaPlantilla",JSON.stringify(plantilla),{headers:headers});
           // return this.http.post<DiasTrabajados[]>(this.webApiUrl,formdata);
        
        
        //return this.arr;
          }


          getPlantillas(){
            return this.http.get<any[]>(this.urlPlantillas);
          }

         getPlantillasVarsOne(id_plantilla){
            return this.http.get<any[]>(this.urlPlantillasVariablesOne+'/'+id_plantilla);

          }

          getRemuneracionesPT(){
         return   this.http.get<any[]>(this.urlRemuneracionesPT);

          }

          getAllDiasTrabFile(dataForm,optionProcess){
            //console.log(this.http.get<DiasTrabajados[]>(this.webApiUrl));
           console.log(optionProcess);
           console.log(JSON.stringify(optionProcess["fecha"]))
            const fd=new  FormData();
           fd.append('file',dataForm);
           fd.append('fecha',JSON.stringify(optionProcess["fecha"]));
        //   fd.append('proceso',JSON.stringify(optionProcess["proceso"]));
            return this.http.post<any[]>("http://localhost:3800/reliquida/generaProcesoReliquidaPartTime",fd);
           // return this.http.post<DiasTrabajados[]>(this.webApiUrl,formdata);
        
        
        //return this.arr;
          }



}
