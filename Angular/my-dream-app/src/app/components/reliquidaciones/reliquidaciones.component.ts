import { Component, OnInit } from '@angular/core';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-reliquidaciones',
  templateUrl: './reliquidaciones.component.html',
  styleUrls: ['./reliquidaciones.component.css']
})
export class ReliquidacionesComponent implements OnInit {

  constructor(private ReliquidacionesService:ReliquidacionesService) {}

  ngOnInit() {

    this.display=false;
    this.displayNuevaPlantilla=false;
    this.displayPlantillas=false

    this.getReliquidaciones();
    
    
    this.colsDynamic = [
      { field: 'C.COSTO', header: 'Centro Costo' },
      {field: 'DIAS_LICENCIA', header: 'Licencia' }
  ];

  this.variables=[{field:'C.COSTO',variable:'H003'},{field:'DIAS_LICENCIA',variable:'H082'}];

  
 this.frozenCols = [
  { field: 'NOMBRE', header: 'NOMBRE' }

];

/*
this.cities = [
  {name: '2018-12-18', code: '2018-12-18'},
  {name: '2018-12-19', code: '2018-12-19'},
  {name: '2018-12-20', code: '2018-12-20'}
];

*/
this.getFechasRemuneracionesArchivo();



  }

  reliquidacionDetalle:any[];
  remuneracionArchivo:any[];
  cols:any[];
  colsDynamic:any[];
  frozenCols: any[];
  fechasRemArchivo:any[];
  cities:any[];
  selectedFechaRemArchivo:any;
  display:boolean;
  displayMapping:boolean;
  colsDynamicValue:any[];
  variables:any[];
  plantillaNombre:string;
  displayNuevaPlantilla:boolean;
  displayPlantillas:boolean;
  plantillas:any[];
  plantillaVarsOne:any[];
  selectedPlantilla:any;


  getReliquidaciones(){
    
    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.ReliquidacionesService.getReliquidaciones().subscribe(
    data=> {
               this.reliquidacionDetalle=data;

               this.reliquidacionDetalle=this.reliquidacionDetalle.map(registro=>{
                 registro.LIQUIDO_PAGO=0;
                 registro.RELIQUIDACION=0;  

                 if(registro.SUELDO){

                  registro.SUELDO.forEach(var_sueldo=>{
                    if(var_sueldo.VARIABLE_CODI=='H303') registro.LIQUIDO_PAGO=var_sueldo.VARIABLE_MONTO;
                    if(var_sueldo.VARIABLE_CODI=='H068') registro.RELIQUIDACION=var_sueldo.VARIABLE_MONTO;

                  });
                                       

                      
                  }
                  

                 
                 return registro;

               });
        


               console.log(this.reliquidacionDetalle);
               this.getRemuneracionesArchivo(null);
       
                    
             



      
  
             }
       
     );
  
   }



   getRemuneracionesArchivo(fecha){

    

    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.ReliquidacionesService.getRemuneracionesArchivo(fecha).subscribe(
    data=> {
      console.log(" la fecha obtenida es"+fecha)
               this.remuneracionArchivo=data;
               
               
               this.reliquidacionDetalle.forEach(persona=>{
                persona.LIQUIDO_ARCHIVO=0;
                if(this.remuneracionArchivo.find(x=>x.ficha==persona.FICHA))
                persona.LIQUIDO_ARCHIVO=parseInt(this.remuneracionArchivo.find(x=>x.ficha==persona.FICHA).valor);


               });

                  // Las columnas estan en la primera linea de los datos
                  //Filtramos aquellas que no queremos que aparezcan
                  let columnsFilter=['NOMBRE','IN_BD','LIQUIDO_PAGO','RELIQUIDACION','LIQUIDO_ARCHIVO']
                  this.cols= Object.keys(this.reliquidacionDetalle[0]);
                  
                 this.cols= this.cols.filter(value=>{
                     if(columnsFilter.indexOf(value)<0)
                     return value;

                  });

                  this.cols=this.cols.map(value=>{
                    return{field:value,header:value};
                  
                  });

                  this.variables=this.cols.map(value=>{
                    return{field:value.field,variable:''};
                  
                  });
                  
                 
                  console.log(this.cols);
                  console.log("variables");
                  console.log(this.variables);
                  




    });

 

  }



  getFechasRemuneracionesArchivo(){

    

    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.ReliquidacionesService.getFechasRemuneracionesArchivo().subscribe(
    data=> {
    
             
              this.fechasRemArchivo= data.map(row=>{
                return{name:row.FechaRegistro,code:row.FechaRegistro}
              });

              console.log(this.fechasRemArchivo);
               
    });

 

  }

  cambiaFechaRemunArchivo(event){
     console.log(" la fecha es"+this.selectedFechaRemArchivo.code)
    this.getRemuneracionesArchivo(this.selectedFechaRemArchivo.code);



  }

  getNoExistentes(){
    if(this.reliquidacionDetalle){
   let noExistentes=this.reliquidacionDetalle.filter(value=>{
    return value.IN_BD="false";
   });
   console.log(noExistentes)
   return noExistentes;
  
  }
  }

  creaPlantillaVariables(){
 
    let jsonPlantilla={name:this.plantillaNombre,variables:this.variables}

   this.ReliquidacionesService.creaVariablesPlantilla(jsonPlantilla).subscribe(
     data=> {
    console.log("cantidad de inserciones",data);
    this.displayNuevaPlantilla=false;

     });

  }

  getPlantillas(){

      // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
       this.ReliquidacionesService.getPlantillas().subscribe(
      data=> {
       console.log(data);
        this.plantillas=data;
  
      });


}


 async asignaPlantilla(){
  console.log("la plantilla es",this.selectedPlantilla);
 //this.getPlantillaVarsOne(this.selectedPlantilla.id);
 let variablesDB=await this.ReliquidacionesService.getPlantillasVarsOne(this.selectedPlantilla.id).toPromise();
console.log(variablesDB);
  //console.log("variables",this.plantillaVarsOne);

  


  this.variables.forEach((element)=>{
    let encuentra=variablesDB.find(x=>x.columna_nombre==element.field)

    if(encuentra){
    element.variable=encuentra.columna_variable;
    console.log("se encontro",encuentra)

    }
  
  });

  this.displayPlantillas=false;

}






}
