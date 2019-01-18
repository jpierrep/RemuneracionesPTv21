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

    if(localStorage.getItem('reliquida')){
      console.log("existe el objeto");
  
      this.reliquidacionDetalle=JSON.parse(localStorage.getItem('reliquida'));
      this.getRemuneracionesArchivo(null);

     }

    //this.getReliquidaciones();
    
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
  frozenCols: any[];
  fechasRemArchivo:any[];
  cities:any[];
  selectedFechaRemArchivo:any;



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



}
