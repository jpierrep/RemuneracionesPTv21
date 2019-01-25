import { Component, OnInit } from '@angular/core';
import {SoftlandService} from '../../services/softland.service';
import {ReliquidacionesService} from '../../services/reliquidaciones.service';


@Component({
  selector: 'app-reliquidaciones-all',
  templateUrl: './reliquidaciones-all.component.html',
  styleUrls: ['./reliquidaciones-all.component.css']
})
export class ReliquidacionesAllComponent implements OnInit {

  constructor(private SoftlandService:SoftlandService,private ReliquidacionesService:ReliquidacionesService) { }

   ngOnInit() {

    if(localStorage.getItem('optionsProcessReliquida')){
      console.log("existe el proceso");
   this.optionRequestedMes=(JSON.parse(localStorage.getItem('optionsProcessReliquida'))["fecha"]);
   //transforma la fecha para enviarla al servicio con formato 'yyyy-mm-dd'
   this.MesDefaut=this.optionToDate(this.optionRequestedMes.value);
    //this.optionRequestedProceso=(JSON.parse(localStorage.getItem('optionsProcess'))["proceso"]);
 
  }else{
    //se obtiene la fecha del mes anterior
    this.MesDefaut=this.optionToDate(this.getPreviousMonth());
    console.log("mes default es ",this.MesDefaut );
  }


      

   this.getReliquidacionesAll();
   
   
   this.cols = [
    { field: 'FICHA', header: 'FICHA' },
    { field: 'LIQUIDO_ACTUAL', header: 'LIQUIDO_ACTUAL' },
    { field: 'LIQUIDO_ARCHIVO', header: 'LIQUIDO_ARCHIVO' },
    { field: 'DIFF_LIQUIDO', header: 'DIFF_LIQUIDO' },
    { field: 'RELIQUIDA_ACTUAL', header: 'RELIQUIDA_ACTUAL' },
    { field: 'DIFF_RELIQUIDA', header: 'DIFF_RELIQUIDA' }
  
  ];
  
  }

  reliquidacionesAll:any[];
  cols: any[];
  fechasRemArchivo:any[];
  remuneracionArchivo:any[];
  optionRequestedMes:any; //mes confirmado para el proceso
  MesDefaut:any; //fecha del primer registro de remuneraciones para el mes
  liquidoPago:any[];
  reliquidacion:any[];
  selectedFechaRemArchivo:any;
 


 async getReliquidacionesAll(){
  let fechasRemuneracionArchivo= await this.ReliquidacionesService.getFechasRemuneracionesArchivo(this.MesDefaut).toPromise();
     //trae todas las fechas que se encuentren en la bd para el mes en cuestion       
     this.fechasRemArchivo= fechasRemuneracionArchivo.map(row=>{
      return{name:row.FechaRegistro,code:row.FechaRegistro}
    });
    //por defecto se toma la fecha mas reciente (viene ordenada descendente por eso se toma el index 0 )
    let fechaDefault=this.fechasRemArchivo[0].code;
    
    this.liquidoPago= await this.SoftlandService.getVariableMes(0,this.MesDefaut,'H303').toPromise();
     this.reliquidacion=await this.SoftlandService.getVariableMes(0,this.MesDefaut,'H068').toPromise();
     this.remuneracionArchivo=await this.ReliquidacionesService.getRemuneracionesArchivo(fechaDefault).toPromise();
     this.getResumenReliquidacionesAll();

  }

    //si se cambia la fecha de consulta para remuneraciones archivo, recalculamos la tabla
   async cambiaFechaRemunArchivo(event){
      console.log(" la fecha es"+this.selectedFechaRemArchivo.code)

     this.remuneracionArchivo=await this.ReliquidacionesService.getRemuneracionesArchivo(this.selectedFechaRemArchivo.code).toPromise();
     this.getResumenReliquidacionesAll();
 
   }

   
   getResumenReliquidacionesAll(){
   
   
    //no existen fichas duplicadas en la bd, por lo que no se eliminan duplicados

      let datos= this.liquidoPago.map(persona=>{
       let ficha=persona.FICHA;
       let liquidoPagoActual=persona.VARIABLE_MONTO
       //cruce con liquido archivo
       let liquidoPagoArch=this.remuneracionArchivo.find(x=>x.ficha==persona.FICHA&&x.emp_codi==persona.empresa)
       if(liquidoPagoArch) liquidoPagoArch=parseInt(liquidoPagoArch.valor)
       
        //cruce con reliquidacion actual
       let reliquidacionActual=this.reliquidacion.find(x=>x.FICHA==persona.FICHA)
       if(reliquidacionActual)  reliquidacionActual=parseInt(reliquidacionActual.VARIABLE_MONTO)
       
       let diffLiquidos
       let diffReliquida
      
       if(liquidoPagoArch) diffLiquidos=liquidoPagoActual-liquidoPagoArch 
       else  diffLiquidos=liquidoPagoActual
       if(reliquidacionActual)
      diffReliquida=reliquidacionActual-diffLiquidos
      else
      diffReliquida=-diffLiquidos

       return {FICHA:ficha,LIQUIDO_ACTUAL:liquidoPagoActual,LIQUIDO_ARCHIVO:liquidoPagoArch,RELIQUIDA_ACTUAL:reliquidacionActual,DIFF_LIQUIDO:diffLiquidos,DIFF_RELIQUIDA:diffReliquida}

      })
      datos=datos.filter(dato=>{
       return (dato.LIQUIDO_ACTUAL!=dato.LIQUIDO_ARCHIVO)||(dato.RELIQUIDA_ACTUAL>0)
      });

       console.log(datos)
       this.reliquidacionesAll=datos;

   }

   optionToDate(fecha){
   
    let mes=fecha.substr(0,2);
    let año=fecha.substr(3,4);
    fecha=año+'-'+mes+'-01'
    console.log("fechadb",fecha)
    return fecha;

  }

  getPreviousMonth(){
    //  this.optionMeses=[{name:'2018-Diciembre', value:'12/2018'},{name:'2019-Enero', value:'01/2019'}];
    

    var d=new Date(new Date().setMonth(new Date().getMonth() -1));
    console.log(d)
    //empieza de 0 por eso para calendario gregoriano sumamos 1, el año queda tal cual 
        var curr_month = d.getMonth()+1
    var curr_year = d.getFullYear();

    let valueDate=curr_month.toString();
        if(curr_month<10)
        valueDate='0'+curr_month.toString();
        valueDate=valueDate+'/'+curr_year

    return valueDate;
    
    }




}
