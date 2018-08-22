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
  optionSelectedZona:String
  zonas:any[];
  uploadedFiles: any[] = [];

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
 evento1(event){
 console.log("antes de enviar");
 console.log(event);
 
 }

  evento(event) {
    console.log("on Uploaded");
    console.log(event);
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  console.log("se subio");
  console.log(this.uploadedFiles[0]);
  this.FilesgetAllDiasTrabajados();
  }
    
  getAllDiasTrabajados(){
    
   // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
    this.InfoDiasTrabajadosService.getAllDiasTrab().subscribe(  
   data=> {
              this.diasTrabajados=data;
             this.getNoExisteEnBD();
             this.getExisteEnBD();
             this.getZonas();
             

            }
      
    )

  }
  FilesgetAllDiasTrabajados(){
    
    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.InfoDiasTrabajadosService.subeArchivos(this.uploadedFiles[0]).subscribe(  
    data=> {
               this.diasTrabajados=data;
 
              
 
             }
       
     )
 
   }

  
 
getNoExisteEnBD(){

 this.diasTrabajadosNoExiste =this.diasTrabajados.filter(x=>x.IN_BD=="false");
   
}

getExisteEnBD(){
 
  this.diasTrabajadosExiste =this.diasTrabajados.filter(x=>x.IN_BD=="true");
}


getZonas(){

  

  let cenco1=  this.diasTrabajadosExiste.map(value=>{
     return value.CENCO1_DESC;
   });


  let unique = (value, index, self) => {

    return self.indexOf(value) == index;
}

let distinctZonas = cenco1.filter(unique);

let zonasJson=[];
distinctZonas.map(element => {
   zonasJson.push({"name":element});
 });

this.zonas=zonasJson;



}


getFiltered(zona){

  if(zona)
   return this.diasTrabajados.filter(x=>x.CENCO1_DESC==zona);
  else
  return this.diasTrabajados;
  }

 selectedDiasTrabajados(diasTrabajados:DiasTrabajados){
  this.display=true; // cuando se selecciona uno, se mustra el dialog
 this.diasTrabajadosOne=diasTrabajados;
 }

}
