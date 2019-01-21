import { Component, OnInit } from '@angular/core';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-reliquidaciones',
  templateUrl: './reliquidaciones.component.html',
  styleUrls: ['./reliquidaciones.component.css']
})
export class ReliquidacionesComponent implements OnInit {

  constructor(private ReliquidacionesService:ReliquidacionesService) {}

  ngOnInit() {


    if(localStorage.getItem('optionsProcessReliquida')){
      console.log("existe el proceso");
   this.optionRequestedMes=(JSON.parse(localStorage.getItem('optionsProcessReliquida'))["fecha"]);
    //this.optionRequestedProceso=(JSON.parse(localStorage.getItem('optionsProcess'))["proceso"]);
    }

    if(localStorage.getItem('reliquida')){
      console.log("existe el objeto");
  
      this.reliquidacionDetalle=JSON.parse(localStorage.getItem('reliquida'));
      this.getRemuneracionesArchivo(null);

     }

    this.display=false;
    this.displayNuevaPlantilla=false;
    this.displayPlantillas=false

    this.optionMeses=[{name:'2018-Diciembre', value:'12/2018'},{name:'2019-Enero', value:'01/2019'}];

   // this.getReliquidaciones();
    
    
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
//this.getFechasRemuneracionesArchivo();
this.getDatesArray();



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

  displayNewProcess:boolean;
  loadigProcess:boolean;
  optionSelectedMes:String;
  uploadedFiles: any[] = [];
  optionRequestedMes:String; //mes confirmado para el proceso
  optionProcess;
  optionMeses:any[];


  async newProcess(){
 
    //this.diasTrabajadosOtrosOne=personaEditar // la original para saber la posicion
    //this.diasTrabajadosOneSelected=this.cloneDias(personaEditar);  // la copia para editar y luego reasignar
    this.loadigProcess=true;

   this.optionProcess= {'fecha':this.optionSelectedMes};
   await this.FilesgetAllDiasTrabajados();
  this.optionRequestedMes=this.optionSelectedMes;

  this.optionSelectedMes=null;

   this.loadigProcess=false;
   this.displayNewProcess=false;

  
  
  }

  evento(event) {
    //eliminamos los archivos anteriores
    this.uploadedFiles=[];

    console.log("on Uploaded");
    console.log(event);
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  console.log("se subio");
  console.log(this.uploadedFiles[0]);
  
  }


  async FilesgetAllDiasTrabajados(){
    return new Promise(resolve=>{
      // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
       this.ReliquidacionesService.getAllDiasTrabReliquidaciones(this.uploadedFiles[0],this.optionProcess).subscribe(  
      data=> {

        this.reliquidacionDetalle=data;
      console.log(this.reliquidacionDetalle);
     
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

           
      localStorage.setItem('optionsProcessReliquida',JSON.stringify(this.optionProcess));
           
      localStorage.setItem('reliquida', JSON.stringify(this.reliquidacionDetalle));


                resolve();
   
               }
         
       )
      });
     }


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





  cambiaFechaRemunArchivo(event){
     console.log(" la fecha es"+this.selectedFechaRemArchivo.code)
    this.getRemuneracionesArchivo(this.selectedFechaRemArchivo.code);



  }

  getNoExistentes(){
    let noExistentes;
    if(this.reliquidacionDetalle){
   noExistentes= this.reliquidacionDetalle.filter(value=>{
    return value.IN_BD=="false";
   });
 
   return noExistentes;
  
  }

 

  console.log("noexitentes",noExistentes)
  console.log("todos",this.reliquidacionDetalle)
  }

  getExistentes(){
    let Existentes;
    if(this.reliquidacionDetalle){
   Existentes= this.reliquidacionDetalle.filter(value=>{
    return value.IN_BD=="true";
   });
 
   return Existentes;
  
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


getDatesArray(){
//  this.optionMeses=[{name:'2018-Diciembre', value:'12/2018'},{name:'2019-Enero', value:'01/2019'}];

var d = new Date();
var curr_date = d.getDate();

var months = new Array("Ene", "Feb", "Mar",
  "Abr", "May", "Jun", "Jul", "Ago", "Sep",
  "Oct", "Nov", "Dic");  
var optionsMeses=[]
let i
  for (i = 1; i <=12; i++) {
    //los id del mes empiezan del 0
    var curr_month = d.getMonth()+1;
    var curr_year = d.getFullYear();
    //console .log(d);
    let nameDate=curr_year+' - '+months[curr_month-1];
    let valueDate=curr_month.toString();
    if(curr_month<10)
    valueDate='0'+curr_month.toString();
    valueDate=valueDate+'/'+curr_year

let today ={name: nameDate, value:valueDate}
   optionsMeses.push(today);
    //d= d.setMonth(curr_month-1);
    //i debe empezar en 1 para restar 1 mes, si no se restara 0 
    d=new Date(new Date().setMonth(new Date().getMonth() -i));

  }
  console.log(optionsMeses)
this.optionMeses=optionsMeses;



}

descargaCSVProceso(){
  let personas=this.reliquidacionDetalle.filter(persona=>{
    if(persona.IN_BD=="true"&&persona.RUT){
      return persona
    }

   });

   let resumen=[];
  console.log("variables",this.variables)
   personas.forEach(turnoPersona=>{
     console.log("turnoPersona",turnoPersona)
   
    
    
     this.variables.forEach(input_variable=>{
      let obj={FICHA:"",variable_codi:"",variable_desc:""};
      if(input_variable.variable!="") {
      obj.FICHA=turnoPersona.FICHA; 
      obj.variable_codi=input_variable.variable;
     obj.variable_desc=turnoPersona[input_variable.field];
      resumen.push(obj);

      }

       });
  
    
      

   
  });

  var data=resumen;

  var options = { 
   //fieldSeparator: ',',
   //quoteStrings: '"',
   quoteStrings: '"'
   //decimalseparator: '.',
   //showLabels: true, 
   //showTitle: true,
   //useBom: true,
   //noDownload: true,
   //headers: ["First Name", "Last Name", "ID"]
 };
  
var csv =new Angular5Csv(data, 'Archivo_Softland_REliquida',options);






}






}
