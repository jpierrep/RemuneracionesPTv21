import { Component, OnInit } from '@angular/core';
import {Parametro } from '../../models/parametro';
import {ParametosPagoService} from '../../services/parametos-pago.service';

@Component({
  selector: 'app-parametros-pago',
  templateUrl: './parametros-pago.component.html',
  styleUrls: ['./parametros-pago.component.css']
})
export class ParametrosPagoComponent implements OnInit {

 parametros:Parametro[];

  constructor(private ParametosPagoService:ParametosPagoService ) { }

  ngOnInit() {
    this.getAllParameters();
  }

   getAllParameters(){
  
      
       this.ParametosPagoService.getAllParams().subscribe(  
      data=> {
                 this.parametros=data;
               }
       )};
}
