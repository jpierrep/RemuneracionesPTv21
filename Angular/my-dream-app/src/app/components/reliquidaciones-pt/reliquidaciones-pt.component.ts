import { Component, OnInit } from '@angular/core';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import {ProgressBarModule} from 'primeng/progressbar';

@Component({
  selector: 'app-reliquidaciones-pt',
  templateUrl: './reliquidaciones-pt.component.html',
  styleUrls: ['./reliquidaciones-pt.component.css']
})
export class ReliquidacionesPTComponent implements OnInit {

  constructor(private ReliquidacionesService:ReliquidacionesService) { }

  ngOnInit() {
    
    this.optionMeses=[{name:'2018-Diciembre', value:'12/2018'},{name:'2019-Enero', value:'01/2019'}];
    this.getDatesArray();

    if(localStorage.getItem('optionsProcessReliquidaPT')){
      console.log("existe el proceso");
   this.optionRequestedMes=(JSON.parse(localStorage.getItem('optionsProcessReliquidaPT'))["fecha"]);
    //this.optionRequestedProceso=(JSON.parse(localStorage.getItem('optionsProcess'))["proceso"]);
    }

    if(localStorage.getItem('reliquidaPT')){
      console.log("existe el objeto");
  
      this.reliquidacionesPT=JSON.parse(localStorage.getItem('reliquidaPT'));
      this.reliquidacionesPTResumen= this.getRemuneracionesPTResumen();

     }
    
   // this.getRemuneracionesPT();
  }


  display:boolean;
  optionMeses:any[];
  reliquidacionesPT:any[];
  reliquidacionesPTResumen: any[];
  estructuraPersona:any[];
  displayEstructura:boolean;
   //columnas dinamicas tabla tipo de turno
  colsResumen:any[];
  displayNewProcess:boolean;
  loadigProcess:boolean;
  optionSelectedMes:String;
  uploadedFiles: any[] = [];
  optionRequestedMes:String; //mes confirmado para el proceso
  optionProcess;



  async newProcess(){
 
    //this.diasTrabajadosOtrosOne=personaEditar // la original para saber la posicion
    //this.diasTrabajadosOneSelected=this.cloneDias(personaEditar);  // la copia para editar y luego reasignar
    this.loadigProcess=true;

   this.optionProcess= {'fecha':this.optionSelectedMes};
   await this.FilesgetAllDiasTrabajados();

   localStorage.setItem('optionsProcessReliquidaPT',JSON.stringify(this.optionProcess));
           
   localStorage.setItem('reliquidaPT', JSON.stringify(this.reliquidacionesPT));

  this.optionRequestedMes=this.optionSelectedMes;

  this.optionSelectedMes=null;

   this.loadigProcess=false;
   this.displayNewProcess=false;

  
  
  }

  async FilesgetAllDiasTrabajados(){
    return new Promise(resolve=>{
      // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
       this.ReliquidacionesService.getAllDiasTrabFile(this.uploadedFiles[0],this.optionProcess).subscribe(  
      data=> {

        this.reliquidacionesPT=data;
      console.log(this.reliquidacionesPT);
      this.reliquidacionesPTResumen= this.getRemuneracionesPTResumen();


                resolve();
   
               }
         
       )
      });
     }

     getNoExistentes(){
      if(this.reliquidacionesPT){
     let noExistentes=this.reliquidacionesPT.filter(value=>{
      return value.IN_BD=="false";
     });


          console.log("noexitentes",noExistentes);
     console.log("todos",this.reliquidacionesPT);
     
     return noExistentes.slice(1,noExistentes.length);
    
    }
    }



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
       if(persona.IN_BD=="true"&&persona.RUT){
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

     muestraPersonaEstructura(personaBuscar){
       //obtiene forma para tabla
       let nuevaForma=this.getPersonaEstructura(personaBuscar);
      this.estructuraPersona=nuevaForma;

      //añade nombre a las columnas de la tabla segun tipos de turno
      this.colsResumen= Object.keys(nuevaForma[0]);
      
      this.colsResumen=this.colsResumen.map(value=>{
        return{field:value,header:value};
      
      });
      this.displayEstructura=true;

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

              //añade cantidad de turnos
              let j;
              let obj="";
              for (j = 0; j <tiposTurno.length; j++){
                if (obj=="")
                obj=`"turno`+tiposTurno[j]+`":`+personaTurnos[j]["CANT TURNOS"];
                else
                obj=obj+`,"turno`+tiposTurno[j]+`":`+personaTurnos[j]["CANT TURNOS"];
                objNuevo=JSON.parse(`{`+obj+`}`)
         
                }

                nuevaForma.push (objNuevo); 
      

      //ordenamos segun indice de arreglos  ESTRUCT_PAGO
        
      //crea arreglo con nombres variables
      let nombres=['SUELDO BASE','GRATIFICACION','MOVILIZACION','COLACION','CANT TURNOS']
      for (i = 0; i <nombres.length; i++) {
        nuevaForma[i].TIPO=nombres[i];
        
      }

     
      console.log(nuevaForma);
      return nuevaForma;
  


     }


     getEstructuraArchivo(){
       

      let personas=this.reliquidacionesPT.filter(persona=>{
        if(persona.IN_BD=="true"&&persona.RUT){
          return persona
        }
  
       });

      //crea arreglo con todos los valores por ficha x variable
      let resumen=[];

       personas.forEach(turnoPersona=>{
        turnoPersona.ESTRUCT_PAGO.forEach(estruct=>{
           let obj= {VARIABLE:estruct.VARIABLE_CODI,FICHA:turnoPersona.FICHA,MONTO:estruct.VALOR,KEY:turnoPersona.FICHA+estruct.VARIABLE_CODI}
           resumen.push(obj);

          }); 
       
      });
     
      
      //Agrupa segun ficha variable
      //https://stackoverflow.com/questions/29364262/how-to-group-by-and-sum-array-of-object
      let result=[];
      result=resumen.reduce(function(res, value) {
        if (!res[value.KEY]) {
          res[value.KEY] = { FICHA: value.FICHA,VARIABLE:value.VARIABLE, MONTO: 0 };
          result.push(res[value.KEY])
        }
        res[value.KEY].MONTO += value.MONTO;
        return res;
      }, {}); 



/*
      let result=[];
      result=resumen.reduce(function(res, value) {
        if (!res[value.KEY]) {
          res[value.KEY] = { KEY: value.KEY, MONTO: 0 };
          result.push(res[value.KEY])
        }
        res[value.KEY].MONTO += value.MONTO;
        return res;
      }, {}); 
*/
     // console.log(resumen)
     // console.log(result)

      //iterar sobre objetos, trae solo los valores como arreglo
      console.log(Object.values(result))

      return Object.values(result);
     
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

     descargaCSVProceso(){
 
     //var today = new Date();
     //var dd = today.getDate();
     //var mm = today.getMonth()+1; //January is 0!
     //var yyyy = today.getFullYear();

     var data=this.getEstructuraArchivo();

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
     
  var csv =new Angular5Csv(data, 'Archivo_Softland_REliquidaPT',options);



  /*
 
    fichero={  FICHA :element.FICHA,
     VARIABLE:variable,
     MES:fecha,
    VALOR :element.SUELDO_MONTO-element.DESCUENTO-element.OTROS_DESCUENTOS+montoOtroPago};
 
  
      return fichero;
    });
    //console.log(data);
 
     var dataTest = [
       {
         name: "Test 1",
         age: 13,
         average: 8.2,
         approved: true,
         description: "using 'Content here, content here' "
       },
       {
         name: 'Test 2',
         age: 11,
         average: 8.2,
         approved: true,
         description: "using 'Content here, content here' "
       },
       {
         name: 'Test 4',
         age: 10,
         average: 8.2,
         approved: true,
         description: "using 'Content here, content here' "
       },
     ];
 */

   
   

  
 }



 descargaDetalleCSV(){
  let personas=this.reliquidacionesPT.filter(persona=>{
    if(persona.IN_BD=="true"&&persona.RUT){
      return persona
    }

   });

   let resumen=[];

   personas.forEach(turnoPersona=>{
    turnoPersona.ESTRUCT_PAGO.forEach(estruct=>{
       let obj= {FICHA:turnoPersona.FICHA,RUT:turnoPersona.RUT,NOMBRE:turnoPersona.NOMBRE,HORAS_TURNO:turnoPersona["HH TURNO"],VARIABLE:estruct.VARIABLE_DESC,MONTO:estruct.VALOR}
       resumen.push(obj);

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
  
var csv =new Angular5Csv(data, 'Archivo_Softland_REliquidaPT',options);






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
   

     

}
