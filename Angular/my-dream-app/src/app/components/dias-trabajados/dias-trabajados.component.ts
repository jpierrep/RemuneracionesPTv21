import { Component, OnInit } from '@angular/core';
import {InfoDiasTrabajadosService } from '../../services/info-dias-trabajados.service';
import { DiasTrabajados} from '../../models/dias-trabajados';
import { Utils} from '../../models/utils';
import {Cars} from '../../models/cars';
import {CarsInfoService} from '../../services/cars-info.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dias-trabajados',
  templateUrl: './dias-trabajados.component.html',
  styleUrls: ['./dias-trabajados.component.css']
})

export class DiasTrabajadosComponent implements OnInit {

  diasTrabajados:DiasTrabajados[];
  diasTrabajadosNoExiste:DiasTrabajados[];
  diasTrabajadosExiste:DiasTrabajados[];
  diasTrabajadosOne:DiasTrabajados;
  display:boolean;
  personalSoft:Cars[];
  utils:Utils;
  idPlantilla:String;

  constructor(
    private InfoDiasTrabajadosService:InfoDiasTrabajadosService,private InfoPersonalSoftService:CarsInfoService
    ,private route: ActivatedRoute
  ) {  }

  

  ngOnInit() {
   
    this.utils=new Utils;
    this.diasTrabajadosOne=new DiasTrabajados(); //importante que exista este objeto creado
    this.diasTrabajados=[];
    this.personalSoft=[];
    this.diasTrabajadosNoExiste=[];
    //this.personalSoft=new Array<Cars>();
   this. getAllDiasTrabajados();
   this.idPlantilla=this.route.snapshot.paramMap.get('id');
   

   

    this.display=false;

  }

    
  getAllDiasTrabajados(){
    
    this.InfoDiasTrabajadosService.getAllDiasTrab().subscribe(
      data=> {
              this.diasTrabajados=data;
             this.getNoExisteEnBD();
             this.getExisteEnBD();
             

            }
      
    )

  }

  
 
getNoExisteEnBD(){

 this.diasTrabajadosNoExiste =this.diasTrabajados.filter(x=>x.IN_BD=="false");
   
}

getExisteEnBD(){
 
  this.diasTrabajadosExiste =this.diasTrabajados.filter(x=>x.IN_BD=="true");
}




 //getAllCars(){
 //this.carsList=this.carService.getAllCars();
//}

 selectedDiasTrabajados(diasTrabajados:DiasTrabajados){
  this.display=true; // cuando se selecciona uno, se mustra el dialog
 this.diasTrabajadosOne=diasTrabajados;
 }

}
