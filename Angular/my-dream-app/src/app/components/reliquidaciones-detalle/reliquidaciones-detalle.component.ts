import { Component, OnInit } from '@angular/core';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';

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
      { field: 'NOMBRE', header: 'Nombre' }
  ];

  */
  }

  reliquidacionDetalle:any[];
  cols:any[];

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
       
              // Las columnas estan en la primera linea de los datos
              this.cols= Object.keys(this.reliquidacionDetalle[0]);
              console.log(this.cols);
              this.cols=this.cols.map(value=>{
                return{field:value,header:value};
              });

            



      
  
             }
       
     );
  
   }

}
