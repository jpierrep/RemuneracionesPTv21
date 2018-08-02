import { Component, OnInit } from '@angular/core';
import {InfoDiasTrabajadosService } from '../../services/info-dias-trabajados.service';
import { DiasTrabajados} from '../../models/dias-trabajados';

@Component({
  selector: 'app-dias-trabajados',
  templateUrl: './dias-trabajados.component.html',
  styleUrls: ['./dias-trabajados.component.css']
})
export class DiasTrabajadosComponent implements OnInit {

  diasTrabajados:DiasTrabajados[];
  diasTrabajadosOne:DiasTrabajados;
  display:boolean;

  constructor(private InfoDiasTrabajadosService:InfoDiasTrabajadosService) { }

  ngOnInit() {
    this.diasTrabajadosOne=new DiasTrabajados(); //importante que exista este objeto creado
    this. getAllDiasTrabajados();
    this.display=false;

  }

    
  getAllDiasTrabajados(){
    this.InfoDiasTrabajadosService.getAllDiasTrab().subscribe(
      data=> {
               this.diasTrabajados=data;
      }
    )
  }
 
  
 //getAllCars(){
 //this.carsList=this.carService.getAllCars();
//}

 selectedDiasTrabajados(diasTrabajados:DiasTrabajados){
  this.display=true; // cuando se selecciona uno, se mustra el dialog
 this.diasTrabajadosOne=diasTrabajados;
 }

}
