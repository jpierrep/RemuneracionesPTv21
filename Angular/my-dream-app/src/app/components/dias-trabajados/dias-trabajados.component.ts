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
import { isNumeric } from '../../../../node_modules/rxjs/internal-compatibility';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {ProgressBarModule} from 'primeng/progressbar';
import {GrowlModule} from 'primeng/growl';
import { log } from 'util';
import {MultiSelectModule} from 'primeng/multiselect';


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
  diasTrabajadosFilter:DiasTrabajados[];
  diasTrabajadosOne:DiasTrabajados;
  diasTrabajadosOneSelected:DiasTrabajados;
  diasTrabajadosOtrosOne:DiasTrabajados;
  diasTrabajadosOneDetalle:DiasTrabajados; //para mostrar el detalle de turnos
  display:boolean;
  displayFormCreate:boolean;
  displayEditForm:boolean;
  displayNewProcess:boolean;
  displayDetalleTurnos:boolean;
  displayParametros:boolean;
  loadigProcess:boolean;
  personalSoft:Cars[];
  utils:Utils;
  idPlantilla:String;
  optionSelectedZona:String;
  optionSelectedMultiZona:any[];
  optionSelectedCargo:String;
  optionSelectedMultiCargo;
  optionSelectedMultiPersona;
  zonas:any[];
  cargos:any[];
  personas:any[];
  optionSelectedMes:String; //mes del selector
  optionRequestedMes:String; //mes confirmado para el proceso
  optionMeses:any[];  //arreglo de meses posibles
  optionSelectedProceso:String;
  optionRequestedProceso:String;
  optionProcesos:any[];
  uploadedFiles: any[] = [];
  msgs: Message[] = [];
  items: MenuItem[];
  optionProcess;
  totalNomina;
  totalNominaActual;

  constructor(
    private InfoDiasTrabajadosService:InfoDiasTrabajadosService,private InfoPersonalSoftService:CarsInfoService
    ,private route: ActivatedRoute,private persistenceService: PersistenceService
  ) {  }

  

  ngOnInit() {
   
    this.utils=new Utils;
    this.diasTrabajadosOne=new DiasTrabajados(); //importante que exista este objeto creado
    this.diasTrabajadosOtrosOne=new DiasTrabajados();
    this.diasTrabajadosOneSelected=new DiasTrabajados();
    this.diasTrabajadosOneDetalle=new DiasTrabajados();
    this.diasTrabajados=[];
    this.optionSelectedMultiZona=[];
    this.optionSelectedMultiCargo=[];
    this.optionSelectedMultiPersona=[];
    this.totalNomina=0;
    this.totalNominaActual=0;
  
 
    
    
    this.diasTrabajadosOtros=[];
    /* crea prueba
    let dias:DiasTrabajados;
    dias=new DiasTrabajados();
    dias.NOMBRE='adasdaaa';   
    this.diasTrabajadosOtros.push(dias);
    */
    this.personalSoft=[];
    this.diasTrabajadosNoExiste=[];
    //this.personalSoft=new Array<Cars>();
   //this. getAllDiasTrabajados();
   this.idPlantilla=this.route.snapshot.paramMap.get('id');
   
   
   if(localStorage.getItem('optionsProcess')){
    console.log("existe el proceso");
 this.optionRequestedMes=(JSON.parse(localStorage.getItem('optionsProcess'))["fecha"]);
  this.optionRequestedProceso=(JSON.parse(localStorage.getItem('optionsProcess'))["proceso"]);
  }

   if(localStorage.getItem('dias')){
    console.log("existe el objeto");

    this.diasTrabajados=JSON.parse(localStorage.getItem('dias'));
    this.getNoExisteEnBD();
    this.getExisteEnBD();
    this.getZonas();
    this.getFilterOptions();

   }

   if(localStorage.getItem('diasOtros')){
    console.log("existe el objeto");

    this.diasTrabajadosOtros=JSON.parse(localStorage.getItem('diasOtros'));

   }




   

    this.display=false;
    this.displayFormCreate=false;
    this.displayEditForm=false;
    this.loadigProcess=false;
    this.displayDetalleTurnos=false;
  

    this.items = [
      {label: 'A Pagar', icon: 'fa fa-fw fa-bar-chart',command: () => {this.idPlantilla='1'}},
      {label: 'Pagos Pendientes', icon: 'fa fa-fw fa-calendar',command: () => {this.idPlantilla='3'}},
      {label: 'No existentes', icon: 'fa fa-fw fa-book',command: () => {this.idPlantilla='2'}}

  ];

  this.optionMeses=[{name:'Agosto', value:'08/2018'},{name:'Septiembre', value:'09/2018'}];
  this.optionProcesos=[{name:'Primera Quincena', value:'1a'},{name:'Segunda Quincena', value:'2a'}];
  
  this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);
  this.totalNominaActual=this.totalNomina;
  this.diasTrabajadosFilter=this.diasTrabajadosExiste;

  }

  evento(event) {
    //eliminamos los archivos anteriores
    this.uploadedFiles=[];

    console.log("on Uploaded");
    console.log(event);
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  console.log("se subio");
  console.log(this.uploadedFiles[0]);
  
  }
  
  eliminaDiasTrab(event){
    localStorage.removeItem('dias'); 
    localStorage.removeItem('optionsProcess'); 
    localStorage.removeItem('diasOtros');
    this.diasTrabajados=[];
    this.diasTrabajadosExiste=[];
    this.diasTrabajadosNoExiste=[];
    this.diasTrabajadosOtros=[];
  }
    
  getAllDiasTrabajados(){
    
   // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
    this.InfoDiasTrabajadosService.getAllDiasTrab().subscribe(  
   data=> {
              this.diasTrabajados=data;
             this.getNoExisteEnBD();
             this.getExisteEnBD();
             this.getZonas();
             this.getFilterOptions();
            }
      
    )

  }
 async FilesgetAllDiasTrabajados(){
  return new Promise(resolve=>{
    // this.InfoDiasTrabajadosService.getAllDiasTrab(this.uploadedFiles).subscribe(
     this.InfoDiasTrabajadosService.getAllDiasTrabFile(this.uploadedFiles[0],this.optionProcess).subscribe(  
    data=> {
               this.diasTrabajados=data;
               this.getNoExisteEnBD();
               this.getExisteEnBD();
               this.getZonas();
               this.getFilterOptions();
         
               localStorage.setItem('optionsProcess',JSON.stringify(this.optionProcess));
           
               localStorage.setItem('dias', JSON.stringify(this.diasTrabajados));
              // localStorage.setItem('diasOtros', JSON.stringify(this.diasTrabajadosOtros));
              this.diasTrabajadosOtros=[];
              resolve();
 
              
 
             }
       
     )
    });
   }

   saveData(){
    console.log("guardando");
    //localStorage.setItem('optionsProcess',JSON.stringify(this.optionProcess));
    localStorage.setItem('dias', JSON.stringify(this.diasTrabajados));
    localStorage.setItem('diasOtros', JSON.stringify(this.diasTrabajadosOtros));
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

getFilterOptions(){

  

  let cenco1=  this.diasTrabajadosExiste.map(value=>{
     return value.CENCO1_DESC;
   });
   let cargo=  this.diasTrabajadosExiste.map(value=>{
    return value.CARGO_DESC;
  });
  let persona=  this.diasTrabajadosExiste.map(value=>{
    return value.NOMBRE;
  });



  let unique = (value, index, self) => {

    return self.indexOf(value) == index;
}

let distinctZonas = cenco1.filter(unique);
let distinctCargos=cargo.filter(unique);
let distinctPersonas=persona.filter(unique);

let zonasJson=[];
let cargosJson=[];
let personasJson=[];

distinctZonas.map(element => {
   zonasJson.push({"name":element});
 });
 distinctCargos.map(element => {
  cargosJson.push({"name":element});
});

distinctPersonas.map(element => {
  personasJson.push({"name":element});
});

this.zonas=zonasJson;
this.cargos=cargosJson;
this.personas=personasJson;

}


getFiltered(zona){
  this.getFilteredMultiple();
  
  if(zona){
  // console.log(optionSelectedMultiZona)
  // console.log(this.optionSelectedMultiCargo)
   }
  if(zona)
   return this.diasTrabajadosExiste.filter(x=>x.CENCO1_DESC==zona);
  else
  return this.diasTrabajadosExiste;
  }


  getDataFilteredMultiple(){ //controlador del filtro de la tabla para calcular el total parcial


  this.diasTrabajadosFilter=this.getFilteredMultiple();
  this.totalNominaActual=this.calculaNomina(this.diasTrabajadosFilter);
  
  return  this.diasTrabajadosFilter

  }

    
    //filtro usado por el controlador getDataFilteredMultiple
  //Filtro con 3 select dependientes 8 posibilidades distintas
    //(zcp),(000),(001),(010),(011),(100),(101),(110),(111)
  getFilteredMultiple():DiasTrabajados[]{   
      
      //tengo que encontrar el valor buscado en la lista de zonas, cargos etc y con eso hacer el filtro
 
     //100
    if(this.optionSelectedMultiZona.length>0&&!(this.optionSelectedMultiCargo.length>0)&&!(this.optionSelectedMultiPersona.length>0)){
    
      return this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
        if  (this.optionSelectedMultiZona.find(y=>y.name==elementDiasTrab.CENCO1_DESC)) return elementDiasTrab;
      });
    //010
  } else if (!(this.optionSelectedMultiZona.length>0)&&(this.optionSelectedMultiCargo.length>0)&&!(this.optionSelectedMultiPersona.length>0)){
  
      return  this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
        if  (this.optionSelectedMultiCargo.find(y=>y.name==elementDiasTrab.CARGO_DESC))  return elementDiasTrab;
      });
     //001
  }else if (!(this.optionSelectedMultiZona.length>0)&&!(this.optionSelectedMultiCargo.length>0)&&(this.optionSelectedMultiPersona.length>0)){
  
    return  this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiPersona.find(y=>y.name==elementDiasTrab.NOMBRE))  return elementDiasTrab;
    });
   //110
  } else if (this.optionSelectedMultiZona.length>0&&this.optionSelectedMultiCargo.length>0&&!(this.optionSelectedMultiPersona.length>0) ){
 
    let cargoFiltered= this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
       if  (this.optionSelectedMultiCargo.find(y=>y.name==elementDiasTrab.CARGO_DESC)) return elementDiasTrab;
    });

  //tomando el arreglo filtrado de cargo, se filtra el centro de costo
    return cargoFiltered.filter((elementDiasTrab)=>{
       if  (this.optionSelectedMultiZona.find(y=>y.name==elementDiasTrab.CENCO1_DESC))  return elementDiasTrab;
    });
    //011
}else if (!(this.optionSelectedMultiZona.length>0)&&this.optionSelectedMultiCargo.length>0&&this.optionSelectedMultiPersona.length>0){
 
    let cargoFiltered= this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiCargo.find(y=>y.name==elementDiasTrab.CARGO_DESC)) return elementDiasTrab;
    });

    return cargoFiltered.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiPersona.find(y=>y.name==elementDiasTrab.NOMBRE))  return elementDiasTrab;
    });
   //101
}else if (this.optionSelectedMultiZona.length>0&&!(this.optionSelectedMultiCargo.length>0)&&this.optionSelectedMultiPersona.length>0){
 
    let zonaFiltered= this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiZona.find(y=>y.name==elementDiasTrab.CENCO1_DESC)) return elementDiasTrab;
    });

    return zonaFiltered.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiPersona.find(y=>y.name==elementDiasTrab.NOMBRE))  return elementDiasTrab;
    });
    //111
}else if (this.optionSelectedMultiZona.length>0&&this.optionSelectedMultiCargo.length>0&&this.optionSelectedMultiPersona.length>0){
 
    let zonaFiltered= this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiZona.find(y=>y.name==elementDiasTrab.CENCO1_DESC)) return elementDiasTrab;
    });
    
    let cargoFiltered= zonaFiltered.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiCargo.find(y=>y.name==elementDiasTrab.CARGO_DESC)) return elementDiasTrab;
    });

    return cargoFiltered.filter((elementDiasTrab)=>{
      if  (this.optionSelectedMultiPersona.find(y=>y.name==elementDiasTrab.NOMBRE))  return elementDiasTrab;
    });

}
    else{
     return this.diasTrabajadosExiste;
    }
  
    }

    getFilteredMultiple22(){
      
      //tengo que encontrar el valor buscado en la lista de zonas, cargos etc y con eso hacer el filtro
 

    if(this.optionSelectedMultiZona.length>0&&!(this.optionSelectedMultiCargo.length>0)){
    
      //filtro zona sin cargo
  return this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
  if  (this.optionSelectedMultiZona.find(y=>y.name==elementDiasTrab.CENCO1_DESC)) return elementDiasTrab;
 });
    
  } else if (!(this.optionSelectedMultiZona.length>0)&&(this.optionSelectedMultiCargo.length>0)){
  
    //  filtro cargo sin zona
return  this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
if  (this.optionSelectedMultiCargo.find(y=>y.name==elementDiasTrab.CARGO_DESC))  return elementDiasTrab;
});
  
}else if (this.optionSelectedMultiZona.length>0&&this.optionSelectedMultiCargo.length>0){
 
  //filtro cargo y zona

  //lista filtrada con el cargo
let cargoFiltered= this.diasTrabajadosExiste.filter((elementDiasTrab)=>{
if  (this.optionSelectedMultiCargo.find(y=>y.name==elementDiasTrab.CARGO_DESC)) return elementDiasTrab;
});

  //tomando el arreglo filtrado de cargo, se filtra el centro de costo
return cargoFiltered.filter((elementDiasTrab)=>{
  if  (this.optionSelectedMultiZona.find(y=>y.name==elementDiasTrab.CENCO1_DESC))  return elementDiasTrab;
 });

}
    else{
     return this.diasTrabajadosExiste;
    }
    

    }



 selectedDetalleTurnos(diasTrabajados:DiasTrabajados){
  this.displayDetalleTurnos=true; // cuando se selecciona uno, se mustra el dialog
 this.diasTrabajadosOneDetalle=diasTrabajados;
 }


  
   getCSV(){
     if(!(this.diasTrabajadosExiste)){
    this.msgs = [];
    this.msgs.push({severity:'error', summary:'Error', detail:'No existen datos cargados'});
     }else{
    //var today = new Date();
    //var dd = today.getDate();
    //var mm = today.getMonth()+1; //January is 0!
    //var yyyy = today.getFullYear();
    let variable;
    if (this.optionRequestedProceso["value"]=="1a") variable='P066';
    if (this.optionRequestedProceso["value"]=="2a") variable='P067';
    let fecha=this.optionRequestedMes["value"];
     console.log(this.diasTrabajadosExiste);

    var fichero;
   var data=this.diasTrabajadosExiste.map((element)=>{
    
    
    var montoOtroPago=0;
    if(this.diasTrabajadosOtros.find(x=>x.RUT==element.RUT)){
      let otroPago=this.diasTrabajadosOtros.find(x=>x.RUT==element.RUT)
      montoOtroPago=(otroPago.SUELDO_MONTO-otroPago.DESCUENTO);
      console.log("pagando a persona que ya tiene pago")
    }

   fichero={  FICHA :element.FICHA,
    VARIABLE:variable,
    MES:fecha,
   VALOR :element.SUELDO_MONTO-element.DESCUENTO-element.OTROS_DESCUENTOS+montoOtroPago};

 
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
}


   creaPersonalOtros(nuevaPersona:DiasTrabajados){


     //valida que la persona exista
   // if(parseFloat(nuevaPersona.RUT).toString() === nuevaPersona.RUT.toString()){
    this.existsPersona(nuevaPersona).then((existe)=>{
     if (existe){
      if (!nuevaPersona.SUELDO_MONTO) nuevaPersona.SUELDO_MONTO=0;
      if (!nuevaPersona.DESCUENTO) nuevaPersona.DESCUENTO=0;
           //transforma a numerico los valores ya que vienen en string, al ordenar o comparar los valores 
           //ordena por ejemplo 11111 < 2 
      if ((isNumeric(nuevaPersona.SUELDO_MONTO)&&isNumeric(nuevaPersona.DESCUENTO))){
        nuevaPersona.SUELDO_MONTO=parseFloat(nuevaPersona.SUELDO_MONTO.toString() )
        nuevaPersona.DESCUENTO=parseFloat(nuevaPersona.DESCUENTO.toString() )
      }
      
      //valida que los valores sean numericos
    if (!(isNumeric(nuevaPersona.SUELDO_MONTO)&&isNumeric(nuevaPersona.DESCUENTO)&&isNumeric(nuevaPersona.RUT))){
     console.log("valida")
     this.showError("Ingrese valores numéricos");
     return;
    }
   
    if(this.diasTrabajadosOtros.filter((e)=>e.RUT_ID ==nuevaPersona.RUT).length>0){
       this.showError("Persona ya existe en la lista");
       return;
     }
     if(nuevaPersona.SUELDO_MONTO>300000){
       this.showError("Monto superior al máximo permitido");
       return;
     }
     if(nuevaPersona.SUELDO_MONTO<0 ||nuevaPersona.DESCUENTO<0){
       this.showError("ingrese valores positivos");
       return;
     }
     if(nuevaPersona.SUELDO_MONTO<nuevaPersona.DESCUENTO){
       this.showError("Descuentos deben ser menores que monto");
       return;
     }

       nuevaPersona.NOMBRE=existe[0].NOMBRES;
       nuevaPersona.RUT=existe[0].RUT;
       nuevaPersona.TIPO=existe[0].CARGO_DESC;
       nuevaPersona.RUT=existe[0].RUT;
       nuevaPersona.RUT_ID=existe[0].RUT_ID;
       nuevaPersona.CENCO2_DESC=existe[0].CENCO2_DESC;
      this.diasTrabajadosOtros.push(nuevaPersona);
      this.displayFormCreate=false;
      this.diasTrabajadosOtrosOne=new DiasTrabajados();
      this.saveData();
      this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);
     }else{
      this.showError("Rut no existente o no vigente");
     }

    });
 
    
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

     this.diasTrabajadosOtros=this.diasTrabajadosOtros.filter((e)=>e.RUT !=personaEliminar.RUT);
     this.saveData();
     this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);
     
  
     
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
editDiasTrabajados(personaEditar:DiasTrabajados){
  //console.log(moment().format('LLLL'));
 // console.log(moment().format());
  //let fecha=new Date(personaEditar.TURNOS[0].DIA);
  //console.log(fecha)
  //console.log(moment(fecha).format("DD/MM/YYYY"));

   this.diasTrabajadosOne=new DiasTrabajados();
  this.diasTrabajadosOne=personaEditar // la original para saber la posicion
  this.diasTrabajadosOneSelected=this.cloneDias(personaEditar);  // la copia para editar y luego reasignar
this.display=true;

}

saveDiasTrabajados(){
  //transforma a numerico los valores ya que vienen en string, al ordenar o comparar los valores 
           //ordena por ejemplo 11111 < 2 

           if ((isNumeric(this.diasTrabajadosOneSelected.SUELDO_MONTO)&&isNumeric(this.diasTrabajadosOneSelected.DESCUENTO)&&isNumeric(this.diasTrabajadosOneSelected.OTROS_DESCUENTOS))){
            this.diasTrabajadosOneSelected.SUELDO_MONTO=parseFloat(this.diasTrabajadosOneSelected.SUELDO_MONTO.toString() )
            this.diasTrabajadosOneSelected.DESCUENTO=parseFloat(this.diasTrabajadosOneSelected.DESCUENTO.toString() )
            this.diasTrabajadosOneSelected.OTROS_DESCUENTOS=parseFloat(this.diasTrabajadosOneSelected.OTROS_DESCUENTOS.toString() )
          }

       //valida que los valores sean numericos
          if (!(isNumeric(this.diasTrabajadosOneSelected.SUELDO_MONTO)&&isNumeric(this.diasTrabajadosOneSelected.DESCUENTO)&&isNumeric(this.diasTrabajadosOneSelected.OTROS_DESCUENTOS))){
            console.log("valida")
            this.showError("Ingrese valores numéricos");
            return;
           }

           else if(this.diasTrabajadosOneSelected.SUELDO_MONTO>300000){
              this.showError("Monto superior al máximo permitido");
              return;
            }
           else if(this.diasTrabajadosOneSelected.SUELDO_MONTO<0 ||this.diasTrabajadosOneSelected.DESCUENTO<0||this.diasTrabajadosOneSelected.OTROS_DESCUENTOS<0){
              this.showError("ingrese valores positivos");
              return;
            }
          else  if(this.diasTrabajadosOneSelected.SUELDO_MONTO<(this.diasTrabajadosOneSelected.DESCUENTO+this.diasTrabajadosOneSelected.OTROS_DESCUENTOS)){
              this.showError("Suma de descuentos deben ser menores que monto");

              return;
            }
 else{
  ////////////
  this.diasTrabajadosExiste[this.diasTrabajadosExiste.indexOf(this.diasTrabajadosOne)] = this.diasTrabajadosOneSelected //cuidado con los filtros existe vs el completo
  this.diasTrabajados[this.diasTrabajados.indexOf(this.diasTrabajadosOne)] = this.diasTrabajadosOneSelected //se guarda también en el general 
  this.saveData();
  this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);
  this.display=false;
 }
 
}

saveDiasTrabajadosOtros(){
  console.log(this.diasTrabajadosOneSelected.SUELDO_MONTO);
  console.log(this.diasTrabajadosOneSelected.DESCUENTO);
  if (!this.diasTrabajadosOneSelected.SUELDO_MONTO) this.diasTrabajadosOneSelected.SUELDO_MONTO=0;
  if (!this.diasTrabajadosOneSelected.DESCUENTO) this.diasTrabajadosOneSelected.DESCUENTO=0;
           
  //transforma a numerico los valores ya que vienen en string, al ordenar o comparar los valores 
           //ordena por ejemplo 11111 < 2 

          if ((isNumeric(this.diasTrabajadosOneSelected.SUELDO_MONTO)&&isNumeric(this.diasTrabajadosOneSelected.DESCUENTO))){
            this.diasTrabajadosOneSelected.SUELDO_MONTO=parseFloat(this.diasTrabajadosOneSelected.SUELDO_MONTO.toString() )
            this.diasTrabajadosOneSelected.DESCUENTO=parseFloat(this.diasTrabajadosOneSelected.DESCUENTO.toString() )
          }

       //valida que los valores sean numericos
          if (!(isNumeric(this.diasTrabajadosOneSelected.SUELDO_MONTO)&&isNumeric(this.diasTrabajadosOneSelected.DESCUENTO))){
            console.log("valida")
            this.showError("Ingrese valores numéricos");
            return;
           }

           else if(this.diasTrabajadosOneSelected.SUELDO_MONTO>300000){
              this.showError("Monto superior al máximo permitido");
              return;
            }
           else if(this.diasTrabajadosOneSelected.SUELDO_MONTO<0 ||this.diasTrabajadosOneSelected.DESCUENTO<0){
              this.showError("ingrese valores positivos");
              return;
            }
          else  if(this.diasTrabajadosOneSelected.SUELDO_MONTO<this.diasTrabajadosOneSelected.DESCUENTO){
              this.showError("Descuentos deben ser menores que monto");

              return;
            }
 else{
            this.diasTrabajadosOtros[this.diasTrabajadosOtros.indexOf(this.diasTrabajadosOtrosOne)] = this.diasTrabajadosOneSelected
            this.saveData();
            this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);
            this.displayEditForm=false;

 }

}

cloneDias(d: DiasTrabajados): DiasTrabajados {
  let dia =  new DiasTrabajados();
  for (let prop in d) {
      dia[prop] = d[prop];
  }
  return dia;
}



showError(message:string) {
  this.msgs = [];
  this.msgs.push({severity:'error', summary:'Error', detail: message});
}

async newProcess(){
 
  //this.diasTrabajadosOtrosOne=personaEditar // la original para saber la posicion
  //this.diasTrabajadosOneSelected=this.cloneDias(personaEditar);  // la copia para editar y luego reasignar
  this.loadigProcess=true;
  localStorage.removeItem('dias'); 
  localStorage.removeItem('optionsProcess'); 
  localStorage.removeItem('diasOtros');
 this.optionProcess= {'fecha':this.optionSelectedMes,'proceso':this.optionSelectedProceso};
 await this.FilesgetAllDiasTrabajados();
this.optionRequestedMes=this.optionSelectedMes;
this.optionRequestedProceso=this.optionSelectedProceso;

this.optionSelectedMes=null;
this.optionSelectedProceso =null;
 this.loadigProcess=false;
   this.displayNewProcess=false;
   this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);


}

calculaNomina(diasTrabajados){
 let totalNomina=0;
 if(diasTrabajados){
  diasTrabajados.forEach((element)=>{
   totalNomina=totalNomina+(element.SUELDO_MONTO-element.DESCUENTO-element.OTROS_DESCUENTOS)

  });
}
   return totalNomina;
}

saveEditaTurnos(){
  this.displayDetalleTurnos=false;
  this.diasTrabajadosOneDetalle.SUELDO_MONTO= this.recalculaMontoTurnos(this.diasTrabajadosOneDetalle);
  this.saveData();
  this.totalNomina=this.calculaNomina(this.diasTrabajadosExiste)+this.calculaNomina(this.diasTrabajadosOtros);

}

recalculaMontoTurnos(diasTrabajadosPersona:DiasTrabajados):number{
     let nuevoMonto:number=0;
   diasTrabajadosPersona.TURNOS.forEach(element => {
     console.log(element.VALOR_TURNO*1);
     //le ponemos parentesis pues no funcionaba bien concatenaba mas que sumar
        nuevoMonto=(nuevoMonto*1) + (element.VALOR_TURNO*1);
        
   });
   return nuevoMonto;

}


}
