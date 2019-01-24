import { Component, OnInit } from '@angular/core';
import {SoftlandService} from '../../services/softland.service';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';


@Component({
  selector: 'app-reliquidaciones-all',
  templateUrl: './reliquidaciones-all.component.html',
  styleUrls: ['./reliquidaciones-all.component.css']
})
export class ReliquidacionesAllComponent implements OnInit {

  constructor(private SoftlandService:SoftlandService,private ReliquidacionesService:ReliquidacionesService) { }

   ngOnInit() {

   this.getReliquidacionesAll();
   this.cols = [
    { field: 'FICHA', header: 'FICHA' },
    { field: 'LIQUIDO_ACTUAL', header: 'LIQUIDO_ACTUAL' },
    { field: 'LIQUIDO_ARCHIVO', header: 'LIQUIDO_ARCHIVO' },
    { field: 'DIFF_LIQUIDO', header: 'DIFF_LIQUIDO' },
    { field: 'RELIQUIDA_ACTUAL', header: 'RELIQUIDA_ACTUAL' },
    { field: 'DIFF_RELIQUIDA', header: 'DIFF_RELIQUIDA' }
  
  ];
  
  }

  reliquidacionesAll:any[];
  cols: any[];
 


   async getReliquidacionesAll(){
    let liquidoPago=await this.SoftlandService.getVariableMes(0,'2018-12','H303').toPromise();
    let reliquidacion=await this.SoftlandService.getVariableMes(0,'2018-12','H068').toPromise();
    let reliquidacionArchivo=await this.ReliquidacionesService.getRemuneracionesArchivo('2018-12-31').toPromise();
    console.log('liquido',liquidoPago);
    console.log('reliquida',reliquidacion);
    console.log('reliquida',reliquidacionArchivo);

    
    //no existen fichas duplicadas en la bd, por lo que no se eliminan duplicados

      let datos= liquidoPago.map(persona=>{
       let ficha=persona.FICHA;
       let liquidoPagoActual=persona.VARIABLE_MONTO
       //cruce con liquido archivo
       let liquidoPagoArch=reliquidacionArchivo.find(x=>x.ficha==persona.FICHA&&x.emp_codi==persona.empresa)
       if(liquidoPagoArch) liquidoPagoArch=parseInt(liquidoPagoArch.valor)
       
        //cruce con reliquidacion actual
       let reliquidacionActual=reliquidacion.find(x=>x.FICHA==persona.FICHA)
       if(reliquidacionActual)  reliquidacionActual=parseInt(reliquidacionActual.VARIABLE_MONTO)
       
       let diffLiquidos
       let diffReliquida
      
       if(liquidoPagoArch) diffLiquidos=liquidoPagoActual-liquidoPagoArch 
       else  diffLiquidos=liquidoPagoActual
       if(reliquidacionActual)
      diffReliquida=reliquidacionActual-diffLiquidos
      else
      diffReliquida=-diffLiquidos

       return {FICHA:ficha,LIQUIDO_ACTUAL:liquidoPagoActual,LIQUIDO_ARCHIVO:liquidoPagoArch,RELIQUIDA_ACTUAL:reliquidacionActual,DIFF_LIQUIDO:diffLiquidos,DIFF_RELIQUIDA:diffReliquida}

      })
      datos=datos.filter(dato=>{
       return (dato.LIQUIDO_ACTUAL!=dato.LIQUIDO_ARCHIVO)||(dato.RELIQUIDA_ACTUAL>0)
      });

       console.log(datos)
       this.reliquidacionesAll=datos;

   



   }



}
