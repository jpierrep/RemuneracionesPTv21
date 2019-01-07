import { Component, OnInit } from '@angular/core';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';

@Component({
  selector: 'app-reliquidaciones-pt',
  templateUrl: './reliquidaciones-pt.component.html',
  styleUrls: ['./reliquidaciones-pt.component.css']
})
export class ReliquidacionesPTComponent implements OnInit {

  constructor(private ReliquidacionesService:ReliquidacionesService) { }

  ngOnInit() {

    this.getRemuneracionesPT();
  }

  reliquidacionesPT:any[];
  reliquidacionesPTResumen: any[];
  estructuraPersona:any[];
  displayEstructura:boolean;
   //columnas dinamicas tabla tipo de turno
  colsResumen:any[];



  getRemuneracionesPT(){

    

    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.ReliquidacionesService.getRemuneracionesPT().subscribe(
    data=> {
      this.reliquidacionesPT=data;
      console.log(this.reliquidacionesPT);
      this.reliquidacionesPTResumen= this.getRemuneracionesPTResumen();

    });
     }


     getRemuneracionesPTResumen(){

      //obtiene array con los ruts vigentes distintos 

      let personas=this.reliquidacionesPT.filter(persona=>{
       if(persona.IN_BD="true"&&persona.RUT){
         return persona
       }

      });

      let rutPersonas=personas.map(persona=>{
      return persona.RUT;

      });

      let unique = (value, index, self) => {

        return self.indexOf(value) == index;
    }
    
    let distinctRutPersonas = rutPersonas.filter(unique);
    console.log(distinctRutPersonas);
   

    //crea nuevo array con los rut unicos y suma los totales
    let personasResumen=distinctRutPersonas.map(rutPersona=>{

      //base para presentacion de resultado
     let personaFind=JSON.parse(JSON.stringify(personas.find(x=>x.RUT==rutPersona)));
     //todos los turnos
     let personaTurnos=personas.filter(x=>x.RUT==rutPersona);
  
     let cantTurnos=personaTurnos.reduce((sum, b) => { return sum + parseInt(b["CANT TURNOS"])},0);
    
     let totalHaberes=personaTurnos.reduce((sum, b) => {return sum + parseInt(b["TOTAL_HABERES"])},0);
  
     personaFind["CANT TURNOS"]=cantTurnos;
     personaFind["TOTAL_HABERES"]=totalHaberes;
     return personaFind;
    
    });




    //console.log("personasnuevo",personasResumen);
   return personasResumen;



     }


     getPersonaEstructura(personaBuscar){
       console.log("buscar",personaBuscar);

      let personaTurnos=this.reliquidacionesPT.filter(persona=>{
        if(persona.FICHA==personaBuscar.FICHA)
        return persona;

      });
      console.log(personaTurnos);
      //obtinene arreglo con los distintos tipos de horas
      let tiposTurno=personaTurnos.map(turno=>{
        return turno["HH TURNO"]
      })
   console.log(tiposTurno);
      

      //obtiene la cantidad de registros que tiene (cantidad de variables)
      let cantVars=personaTurnos[0].ESTRUCT_PAGO.length;
      let nuevaForma=[]
      let objNuevo;
      let i;
      for (i = 0; i <cantVars; i++) {
        let j;
        let obj="";
          for (j = 0; j <tiposTurno.length; j++){
            if (obj=="")
         obj=`"turno`+tiposTurno[j]+`":`+personaTurnos[j].ESTRUCT_PAGO[i].VALOR*personaTurnos[j]["CANT TURNOS"];
         else
         obj=obj+`,"turno`+tiposTurno[j]+`":`+personaTurnos[j].ESTRUCT_PAGO[i].VALOR*personaTurnos[j]["CANT TURNOS"];
         objNuevo=JSON.parse(`{`+obj+`}`)

         }
        nuevaForma.push (objNuevo);
    


     /* personaTurnos.forEach(turno=>{
        nuevaForma.push(turno.ESTRUCT_PAGO[i].NOMBRE)
        console.log(turno.ESTRUCT_PAGO[i].NOMBRE)
      });
    */

      }
      

      //ordenamos segun indice de arreglos  ESTRUCT_PAGO
        
      //crea arreglo con nombres variables
      let nombres=['SUELDO BASE','GRATIFICACION','MOVILIZACION','COLACION']
      for (i = 0; i <nombres.length; i++) {
        nuevaForma[i].TIPO=nombres[i];
        
      }


      console.log(nuevaForma);
      this.estructuraPersona=nuevaForma;

      //añade nombre a las columnas de la tabla segun tipos de turno
      this.colsResumen= Object.keys(nuevaForma[0]);
      
      this.colsResumen=this.colsResumen.map(value=>{
        return{field:value,header:value};
      
      });
      this.displayEstructura=true;


     }
   

     

}
