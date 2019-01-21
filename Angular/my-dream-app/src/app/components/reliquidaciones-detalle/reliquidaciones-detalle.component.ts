import { Component, OnInit } from '@angular/core';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-reliquidaciones-detalle',
  templateUrl: './reliquidaciones-detalle.component.html',
  styleUrls: ['./reliquidaciones-detalle.component.css']
})
export class ReliquidacionesDetalleComponent implements OnInit {

  constructor(private ReliquidacionesService:ReliquidacionesService) {}

   ngOnInit() {
    
     // Se valida si existe proceso y fecha precargado en local storage
    if(localStorage.getItem('optionsProcessReliquida')){
      console.log("existe el proceso");
   this.optionRequestedMes=(JSON.parse(localStorage.getItem('optionsProcessReliquida'))["fecha"]);
   //transforma la fecha para enviarla al servicio con formato 'yyyy-mm-dd'
   this.fechaDefaut=this.optionToDate(this.optionRequestedMes.value);
    //this.optionRequestedProceso=(JSON.parse(localStorage.getItem('optionsProcess'))["proceso"]);

    }if(localStorage.getItem('reliquida')){
      console.log("existe el objeto");
      this.reliquidacionDetalle=JSON.parse(localStorage.getItem('reliquida'));

     }

    this.cols = [
      
      { field: 'FICHA', header: 'Ficha' },
      {field: 'LIQUIDO_ARCHIVO', header: 'LIQ. EN REMUNERACIONES' },
      {field: 'LIQUIDO_PAGO', header: 'LIQ. ACTUAL' },
      {field: 'DIFF', header: 'DIFF.' },
      {field: 'RELIQUIDACION', header: 'H068' }
    
  ];

  
 this.frozenCols = [
  { field: 'NOMBRE', header: 'NOMBRE' }

];

 //Trae Data default según el mes del proceso (fechaDefault)
 // 
this.getDefaultRemuneracionesArchivo(this.fechaDefaut);


  }

  reliquidacionDetalle:any[];
  remuneracionArchivo:any[];
  cols:any[];
  frozenCols: any[];
  fechasRemArchivo:any[];
  cities:any[];
  selectedFechaRemArchivo:any;
  optionRequestedMes:any; //mes confirmado para el proceso
  fechaDefaut:any; //fecha del primer registro de remuneraciones para el mes




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



  //trae estructura de remuneraciones del mes en archivo

   getRemuneracionesArchivo(fecha){

    
  this.ReliquidacionesService.getRemuneracionesArchivo(fecha).subscribe(
    data=> {
      console.log(" la fecha obtenida es"+fecha)
             
               this.remuneracionArchivo=data;
               this.reliquidacionDetalle.forEach(persona=>{
                persona.LIQUIDO_ARCHIVO=0;
                if(this.remuneracionArchivo.find(x=>x.ficha==persona.FICHA))
                persona.LIQUIDO_ARCHIVO=parseInt(this.remuneracionArchivo.find(x=>x.ficha==persona.FICHA).valor);

               });


    });

 

  }



  getDefaultRemuneracionesArchivo(fecha){

    

    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.ReliquidacionesService.getFechasRemuneracionesArchivo(fecha).subscribe(
    data=> {   

              //trae todas las fechas que se encuentren en la bd para el mes en cuestion       
              this.fechasRemArchivo= data.map(row=>{
                return{name:row.FechaRegistro,code:row.FechaRegistro}
              });

              console.log(this.fechasRemArchivo);

              //la primera fecha registrada del mes, para traer variables y diferencias en el mes
              console.log("primera fecha",this.fechasRemArchivo[0].code)
              this.getRemuneracionesArchivo(this.fechasRemArchivo[0].code);

               
    });

 

  }


     //si se cambia la fecha de consulta para remuneraciones archivo, recalculamos la tabla
     cambiaFechaRemunArchivo(event){
     console.log(" la fecha es"+this.selectedFechaRemArchivo.code)
    this.getRemuneracionesArchivo(this.selectedFechaRemArchivo.code);





  }


    //Extrae solamente personal existentes del proceso 

  getExistentes(){
    let Existentes;
    if(this.reliquidacionDetalle){
   Existentes= this.reliquidacionDetalle.filter(value=>{
    return value.IN_BD=="true";
   });
 
   return Existentes;
  
  }

  }

  optionToDate(fecha){
   
    let mes=fecha.substr(0,2);
    let año=fecha.substr(3,4);
    fecha=año+'-'+mes+'-01'
    console.log("fechadb",fecha)
    return fecha;

  }



}
