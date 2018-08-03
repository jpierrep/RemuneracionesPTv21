import {Cars} from './cars'
import {DiasTrabajados} from './dias-trabajados'

export class Utils {

    calculaNoExiste(diasTrabajados,personalSoft ){
  console.log("hola");
  console.log("asasdsdassaas"+personalSoft[0].RUT);
  //console.log("asasdsdassaas"+personalSoft[0].RUT.substr(1,personalSoft[0].RUT.length-3);
     diasTrabajados.map((element)=>{
         var rut= element.RUT;
         if (rut){
         rut=rut.substr(1,rut.length-3);
       //   rut=rut.substr(-1,rut.length);
          console.log("rut"+Number(rut));
          
         }
        return element;
     });

    console.log("asdasds"+diasTrabajados[0].NOMBRE);
      
  diasTrabajados= diasTrabajados.filter((element)=>{
      return element.RUT=='8275974-3';

     });

     console.log("jejjejej"+diasTrabajados[0]);

     if (diasTrabajados.length==0){
console.log("vacio");

     }else 
     console.log("lleno");
     

    }

}
