import { Component, OnInit } from '@angular/core';
import {InfoDiasTrabajadosService } from '../../services/info-dias-trabajados.service';
import { DiasTrabajados} from '../../models/dias-trabajados';
import { Utils} from '../../models/utils';
import {Cars} from '../../models/cars';
import {CarsInfoService} from '../../services/cars-info.service';
import { ActivatedRoute } from '@angular/router';
import { PersistenceService } from 'angular-persistence';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-dias-trabajados',
  templateUrl: './dias-trabajados.component.html',
  styleUrls: ['./dias-trabajados.component.css']
})

export class DiasTrabajadosComponent implements OnInit {

  diasTrabajados:DiasTrabajados[];
  diasTrabajadosNoExiste:DiasTrabajados[];
  diasTrabajadosExiste:DiasTrabajados[];
  diasTrabajadosOtros:DiasTrabajados[];
  diasTrabajadosOne:DiasTrabajados;
  diasTrabajadosOneSelected:DiasTrabajados;
  diasTrabajadosOtrosOne:DiasTrabajados;
  display:boolean;
  displayFormCreate:boolean;
  displayEditForm:boolean;
  personalSoft:Cars[];
  utils:Utils;
  idPlantilla:String;
  optionSelectedZona:String
  zonas:any[];
  uploadedFiles: any[] = [];
  msgs: Message[] = [];

  constructor(
    private InfoDiasTrabajadosService:InfoDiasTrabajadosService,private InfoPersonalSoftService:CarsInfoService
    ,private route: ActivatedRoute,private persistenceService: PersistenceService
  ) {  }

  

  ngOnInit() {
   
    this.utils=new Utils;
    this.diasTrabajadosOne=new DiasTrabajados(); //importante que exista este objeto creado
    this.diasTrabajadosOtrosOne=new DiasTrabajados();
    this.diasTrabajadosOneSelected=new DiasTrabajados();
    this.diasTrabajados=[];
    let dias:DiasTrabajados;
    dias=new DiasTrabajados();
    dias.NOMBRE='adasdaaa';   
    
    
    this.diasTrabajadosOtros=[];
    this.diasTrabajadosOtros.push(dias);
    this.personalSoft=[];
    this.diasTrabajadosNoExiste=[];
    //this.personalSoft=new Array<Cars>();
   //this. getAllDiasTrabajados();
   this.idPlantilla=this.route.snapshot.paramMap.get('id');
   
   if(localStorage.getItem('dias')){
    console.log("existe el objeto");
    this.diasTrabajados=JSON.parse(localStorage.getItem('dias'));
    this.getNoExisteEnBD();
    this.getExisteEnBD();
    this.getZonas();

   }else{
     console.log("no existe");
     
   }

   if(this.persistenceService.get('dias')){
     console.log("existe el objeto");
     this.diasTrabajados=this.persistenceService.get('dias');
     this.getNoExisteEnBD();
     this.getExisteEnBD();
     this.getZonas();
   }else{
     console.log("no existe el objeto");
   }
   

    this.display=false;
    this.displayFormCreate=false;
    this.displayEditForm=false;

  }

  evento(event) {
    console.log("on Uploaded");
    console.log(event);
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  console.log("se subio");
  console.log(this.uploadedFiles[0]);
  this.persistenceService.removeAll(); 
  localStorage.removeItem('dias'); 
  this.FilesgetAllDiasTrabajados();
  }
  
  eliminaDiasTrab(event){
    localStorage.removeItem('dias'); 
    this.diasTrabajados=[];
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
     this.InfoDiasTrabajadosService.getAllDiasTrabFile(this.uploadedFiles[0]).subscribe(  
    data=> {
               this.diasTrabajados=data;
               this.getNoExisteEnBD();
               this.getExisteEnBD();
               this.getZonas();
               this.persistenceService.set('dias', this.diasTrabajados);
               localStorage.setItem('dias', JSON.stringify(this.diasTrabajados));
               console.log("el objeto es"+Object.keys(this.persistenceService.get('dias')));
              // console.log(this.diasTrabajados);
 
              
 
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


  
   getCSV(){
    var fichero;
   var data=this.diasTrabajadosExiste.map((element)=>{
     
   fichero={  FICHA :element.FICHA,
    VARIABLE:'P607',
    MES:'08/2018',
   VALOR :element.SUELDO_MONTO-element.DESCUENTO-element.OTROS_DESCUENTOS};

 
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
     
  var csv =new Angular5Csv(data, 'Archivo_Softland',options);
  
  
  /*//var datos= JSON.stringify(data); 
   console.log(csv);
   var blob=new Blob(data);
    blob.slice(0,blob.size,'text/plain');
    var a = document.createElement('a');
   var url= window.URL.createObjectURL(blob);

    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'aa.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
  */ 
  }


   creaPersonalOtros(nuevaPersona:DiasTrabajados){

 
    if(parseFloat(nuevaPersona.RUT).toString() === nuevaPersona.RUT.toString()){
    this.existsPersona(nuevaPersona).then((existe)=>{
     if (existe){
       nuevaPersona.NOMBRE=existe[0].NOMBRES;
       nuevaPersona.RUT=existe[0].RUT;
       nuevaPersona.TIPO=existe[0].CARGO_DESC;
       nuevaPersona.RUT=existe[0].RUT;
      this.diasTrabajadosOtros.push(nuevaPersona);
      this.displayFormCreate=false;
     }else{
      this.showError();
     }

    });
  }else{
    this.showError();
  }
   //  this.diasTrabajadosOtrosOne=new DiasTrabajados();
   }

   existsPersona(nuevaPersona:DiasTrabajados) {
    return new Promise(resolve=>{ 
     
    let rut_id=nuevaPersona.RUT;
    this.InfoDiasTrabajadosService.getOnePers(rut_id).subscribe(  
      data=> {
         if(!data["message"]){
             
             resolve(data);
         }else{
          resolve(false);
         }
               }
         
       )
    });
  }


   creaDiasTrabajados(){
    this.displayFormCreate=true; // cuando se selecciona uno, se mustra el dialog
     this.diasTrabajadosOtrosOne=new DiasTrabajados();
   }
   
   deleteDiasTrabajadosOtros(personaEliminar:DiasTrabajados){
     console.log(this.diasTrabajadosOtros.indexOf(personaEliminar)); // funciona

     this.diasTrabajadosOtros=this.diasTrabajadosOtros.filter((e)=>e.RUT !=personaEliminar.RUT)
  
     
/*
let someArray = [
                 {name:"Kristian", lines:"2,5,10"},
                 {name:"John", lines:"1,19,26,96"}
                ];
let arrayToRemove={name:"Kristian", lines:"2,5,10"};
someArray=someArray.filter((e)=>e.name !=arrayToRemove.name && e.lines!= arrayToRemove.lines)
*/   
}
editDiasTrabajadosOtros(personaEditar:DiasTrabajados){
  this.diasTrabajadosOtrosOne=personaEditar // la original para saber la posicion
  this.diasTrabajadosOneSelected=this.cloneDias(personaEditar);  // la copia para editar y luego reasignar
this.displayEditForm=true;

}

saveDiasTrabajadosOtros(){
  this.diasTrabajadosOtros[this.diasTrabajadosOtros.indexOf(this.diasTrabajadosOtrosOne)] = this.diasTrabajadosOneSelected
  this.displayEditForm=false;

}

cloneDias(d: DiasTrabajados): DiasTrabajados {
  let dia =  new DiasTrabajados();
  for (let prop in d) {
      dia[prop] = d[prop];
  }
  return dia;
}



showError() {
  this.msgs = [];
  this.msgs.push({severity:'error', summary:'Error Message', detail:'Validation failed'});
}

}
