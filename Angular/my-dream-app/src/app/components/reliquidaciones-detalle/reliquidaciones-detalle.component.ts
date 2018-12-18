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

    this.getReliquidaciones();
    /*
    this.cols = [
      { field: 'C.COSTO', header: 'Centro Costo' },
      {field: 'DIAS LICENCIA', header: 'Licencia' },
      { field: 'FICHA', header: 'Ficha' },
      { field:'NOMBRE' , header: 'Nombre' }
  ];

  */
 this.frozenCols = [
  { field: 'NOMBRE', header: 'NOMBRE' }

];

this.cities = [
  {name: '2018-12-18', code: '2018-12-18'},
  {name: '2018-12-19', code: '2018-12-19'},
  {name: '2018-12-20', code: '2018-12-20'}
];

  }

  reliquidacionDetalle:any[];
  remuneracionArchivo:any[];
  cols:any[];
  frozenCols: any[];
  cities:any[];
  selectedCity:any;


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
               this.getRemuneracionesArchivo();
       
                    
             



      
  
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
                  this.cols= Object.keys(this.reliquidacionDetalle[0]);
                  console.log(this.cols);
                  this.cols=this.cols.map(value=>{
                    return{field:value,header:value};
                  });

                  console.log(this.remuneracionArchivo);




    });

 

  }

  cambiaFechaRemunArchivo(event){
     console.log(" la fecha es"+this.selectedCity.code)
    this.getRemuneracionesArchivo(this.selectedCity.code);



  }



}