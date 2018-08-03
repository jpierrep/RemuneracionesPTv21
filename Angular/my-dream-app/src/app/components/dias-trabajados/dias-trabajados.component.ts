import { Component, OnInit } from '@angular/core';
import {InfoDiasTrabajadosService } from '../../services/info-dias-trabajados.service';
import { DiasTrabajados} from '../../models/dias-trabajados';
import { Utils} from '../../models/utils';
import {Cars} from '../../models/cars';
import {CarsInfoService} from '../../services/cars-info.service';

@Component({
  selector: 'app-dias-trabajados',
  templateUrl: './dias-trabajados.component.html',
  styleUrls: ['./dias-trabajados.component.css']
})
export class DiasTrabajadosComponent implements OnInit {

  diasTrabajados:DiasTrabajados[];
  diasTrabajadosOne:DiasTrabajados;
  display:boolean;
  personalSoft:Cars[];
  utils:Utils;

  constructor(
    private InfoDiasTrabajadosService:InfoDiasTrabajadosService,private InfoPersonalSoftService:CarsInfoService
  
  ) {  }

  

  ngOnInit() {
   
    this.utils=new Utils;
    this.diasTrabajadosOne=new DiasTrabajados(); //importante que exista este objeto creado
    this.diasTrabajados=[];
    this.personalSoft=[];
    //this.personalSoft=new Array<Cars>();
   this. getAllDiasTrabajados();
  

    this.display=false;

  }

    
  getAllDiasTrabajados(){
    
    this.InfoDiasTrabajadosService.getAllDiasTrab().subscribe(
      data=> {
              this.diasTrabajados=data;
            
              this.InfoPersonalSoftService.getAllPers().subscribe(
                data=> {
                         this.personalSoft=data;
                        console.log("mamama"+this.personalSoft[0].FICHA);
                        console.log("mamama"+this.diasTrabajados[0].NOMBRE);
                        this.utils.calculaNoExiste(this.diasTrabajados,this.personalSoft);
                }
              )

            }
      
    )

  }

  
 
entregaDiferencias(){


}





 //getAllCars(){
 //this.carsList=this.carService.getAllCars();
//}

 selectedDiasTrabajados(diasTrabajados:DiasTrabajados){
  this.display=true; // cuando se selecciona uno, se mustra el dialog
 this.diasTrabajadosOne=diasTrabajados;
 }

}
