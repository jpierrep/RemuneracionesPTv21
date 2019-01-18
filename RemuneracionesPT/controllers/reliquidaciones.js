'use strict'




var async= require('async');

var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');
var personaController=require('../controllers/persona');
var moment = require('moment');




const schema = {
    'NOMBRE': {
      prop: 'NOMBRE',
      type: String
      // Excel stores dates as integers.
      // E.g. '24/03/2018' === 43183.
      // Such dates are parsed to UTC+0 timezone with time 12:00 .
    }}


async function generaReliquidacionUpdload(req,res){
  
  //let optionProcess={fecha:JSON.parse(req.body.fecha)};
  //console.log("la optionProcess",optionProcess)
  
  // optionProcess={fecha:JSON.parse(req.body.fecha)};
  //console.log(optionProcess);


  await personaController.uploadFile(req,res);
  let pathFile='uploads/reliquidaciones/'+personaController.getExcelFilename();
   
    //obtiene parametros para el pago de sueldo
   let parametrosPago= await  personaController.getParametrosPago();
   //una vez subido pondemos obtener el nombre del archivo


   let sueldoBaseVar="";
   let liquidoPagoVar="";
   let reliquidacionVar="";
   if(parametrosPago.find(x=>x.ID==3).VALOR) sueldoBaseVar=parametrosPago.find(x=>x.ID==3).VALOR;  //valor para el turno de 12
   if(parametrosPago.find(x=>x.ID==4).VALOR) liquidoPagoVar=parametrosPago.find(x=>x.ID==4).VALOR;   //valor para el turno de 8
   if(parametrosPago.find(x=>x.ID==4).VALOR) reliquidacionVar=parametrosPago.find(x=>x.ID==6).VALOR;   //valor para el turno de 8
   let vars=`'`+sueldoBaseVar+`','`+liquidoPagoVar+`','`+reliquidacionVar+`'`;  
  //console.log(parametrosPago);
      
  console.log("dentro genera proceso")
  
   // let optionProcess={fecha:JSON.parse(req.body.fecha),proceso:JSON.parse(req.body.proceso)}
    let optionProcess={fecha:{name:'Noviembre', value:'11/2018'},proceso:{name:'Reliquidaciones', value:'Reliquida'},variables:vars};
    console.log(optionProcess);

  optionProcess={fecha:JSON.parse(req.body.fecha),variables:vars};
  console.log("la optionProcess",optionProcess)
   
       

      
    
  //  Realiza la carga al servidor del archivo
  //  await uploadFile(req,res);
   

    let persAsist= await getPersonalArchivo(pathFile);
    //res.status(200).send(persAsist);
   // let persAgrupa=await getAgrupaPers(persAsist);
  
    let persRRHH=await personaController.getPersonalSoft(optionProcess);
   
    let persDiff=await getPersonalBD(persAsist,persRRHH);   
    //res.status(200).send(persDiff);
   //
    let persVar=await personaController.getVariablesSueldoPers(optionProcess,persDiff);
    res.status(200).send(persVar);
 
  
   //let persCalcula=await getCalculaSueldo(optionProcess,persVar,parametrosPago);  
   
     
  //  res.status(200).send(persCalcula);
    
  }

  


  function getPersonalArchivo (filename){
    //path: 'uploads/reliquidaciones/reliqucmpc.xlsx'

    return new Promise(resolve=>{
      //readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
      readXlsxFile(filename,).then((rows) => {
     //let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
    
      //result=JSON.parse(result);
      //resolve(result);
      console.log(rows[0].length)
      let cantAtributos=rows[0].length;
      let atributosHeader=rows[0];

     //transforma un arreglo multidimensional en json
     
    let jsonRegister= rows.map(fila=>{
      
    var jsonRow=fila.reduce((json, value, key)=>{
        //atributosHeader[key] = es el nombre q tiene el registro
        //value = el valor que tiene
        
        
        json[atributosHeader[key]]=value;

        return json; }, {}
    );

      
    return jsonRow;
     
   }); 
   
   //finalmente servirá para que la lista de atributos sea variable y que se carggue en la posicion 0 para retorno
   //quitmaos el indice 0 del arreglo para no duplicarlo (pues trae el nombre de todas las keys)
   //jsonRegister.splice(0,1);
   

    // res.status(200).send(jsonRegister);
    resolve(jsonRegister);





    }); 
    });
  
  }


  //realiza cruce de datos según ficha
  
function getPersonalBD(persAsist,persRRHH){

    return new Promise(resolve=>{
  
     persAsist.forEach(element => {
      element.IN_BD="false"; 
    
     });
  
   
  
  
  
     var resultTestAsist=persAsist.map((element)=>{
      //   console.log("el elemento es"+element.RUT);
      // let rutbuscar = convierteRutID(element.RUT);
      let fichabuscar = element.FICHA
  
          //console.log("evaluando" +element.RUT+"y"+rutbuscar)
    
        let persRRHHEncontrar= persRRHH.find(x=>x.FICHA==fichabuscar);
      if (persRRHHEncontrar){
        element.IN_BD="true"
      console.log("Se encontro"+element.IN_BD);
       element.NOMBRE=persRRHHEncontrar.NOMBRES;
        element.FICHA= persRRHHEncontrar.FICHA;
        element.RUT=persRRHHEncontrar.RUT;
        element.CARGO_DESC=persRRHHEncontrar.CARGO_DESC;
        element.CARGO_CODI=persRRHHEncontrar.CARGO_CODI;
        element.CENCO2_CODI=persRRHHEncontrar.CENCO2_CODI;
        element.CENCO2_DESC=persRRHHEncontrar.CENCO2_DESC;
        element.CENCO1_DESC=persRRHHEncontrar.CENCO1_DESC;
     // getVariablesSueldo(persRRHHEncontrar.FICHA,'aaa',`'H303','P001'`,(result)=>{
    //console.log(result);
  
    //    });
  
        
  
      
      }
     
       return element;
   
      });
      
      resolve (resultTestAsist);
    });



  
  
  }


  
  function getRemuneracionesMes (req,res){
    let fecha= req.params.fecha;
    console.log("la fecha parametro es"+fecha)
   if (fecha){
    console.log("viene fecha")
       //si viene fecha
       let  query=`SELECT distinct [ficha] ,[codVariable] ,[valor] ,[empresa],convert(date,fecha_Registro) as fecha_Registro from inteligencias.dbo.RRHH_APP_REG_VAR where convert(date,fecha_Registro)='`+fecha+`'`
       personaController.entrega_resultDB(query,(resultFinal)=>{
     
        res.status(200).send(resultFinal);
      //   resolve ( resultFinal);
    });
   
    }else{
      console.log("No viene fecha")
       //si no viene fecha, extraer el ultimo día del mes en curso
   //extrae la info del mes actual, pues no se puede pagar en relacion a meses pasados
  let  query=`select convert(date,max(Fecha_Registro)) as MaxFecha from inteligencias.dbo.RRHH_APP_REG_VAR`
  
//return new Promise(resolve=>{
  personaController.entrega_resultDB2(query,null).then(result=>{
   // personaController.entrega_resultDB(query,(result)=>{
     console.log("dentro 2a query" )
      console.log(result[0].MaxFecha)
      let maxFecha=result[0].MaxFecha;
      maxFecha=moment.utc(maxFecha).format("YYYY-MM-DD");
      query=`SELECT  [ficha] ,[codVariable] ,[valor] ,[empresa],[Fecha_Registro]
      FROM [Inteligencias].[dbo].[RRHH_APP_REG_VAR] where convert(date,fecha_Registro)='`+maxFecha+`'`
      
   //   personaController.entrega_resultDB(query,(resultFinal)=>{
    personaController.entrega_resultDB2(query,null).then(resultFinal=>{
     
        res.status(200).send(resultFinal);
      //   resolve ( resultFinal);
    });

      
    
  
 
 

});

  //});
    }

  }

  function getFechasRemuneracArchivo (req,res){
    
    //como se trabaja con el ultimo registro, este ultimo deberia apuntar a los ultimos dias del mes anterior
       
       let  query=`--obtiene todos los registros de fecha del mes actual

       select distinct convert(date,Fecha_Registro) as FechaRegistro from   [Inteligencias].[dbo].[RRHH_APP_REG_VAR]
       where    
       DATEADD(m, DATEDIFF(m,0,Fecha_Registro), 0) = (select top 1 DATEADD(m, DATEDIFF(m,0,Fecha_Registro), 0)  from  [Inteligencias].[dbo].[RRHH_APP_REG_VAR] order by Fecha_Registro desc) 
         order by convert(date,Fecha_Registro) desc`

       personaController.entrega_resultDB(query,(resultFinal)=>{
          
      resultFinal.forEach(row=>{
            row.FechaRegistro=moment.utc(row.FechaRegistro).format("YYYY-MM-DD");
       });
     
        res.status(200).send(resultFinal);
      //   resolve ( resultFinal);
   
  });
    
}

async function generaPartReliquidacionUpdload(req,res){

  let optionProcess={fecha:JSON.parse(req.body.fecha)};
  console.log("la optionProcess",optionProcess)
  // let optionProcess={fecha:JSON.parse(req.body.fecha),proceso:JSON.parse(req.body.proceso)}
  
  //optionProcess={fecha:{name:'Noviembre', value:'11/2018'},proceso:{name:'ReliquidacionesPartime', value:'ReliquidaPartime'}};
  

  
  await personaController.uploadFile(req,res);
  let pathFile='uploads/reliquidaciones/part-time/'+personaController.getExcelFilename();
  console.log("el file paht es",pathFile);

  let persAsist= await getPersonalArchivo(pathFile);
  let persRRHH=await personaController.getPersonalSoft(optionProcess);
   
  let persDiff=await getPersonalBD(persAsist,persRRHH);   

  let calulaValores=await calculaValoresReliquida(persDiff);
  res.status(200).send(calulaValores);


  console.log("marca");
  //res.status(200).send(valores);

}


async function calculaValoresReliquida(persDiff){

  let var8horas=[7,9,11,13];
  let var12horas=[8,10,12,14];
  // agrupacion de variables
  let mappingvars=[
    {idVar:16,vars:[7,8]},
    {idVar:17,vars:[9,10]},
    {idVar:18,vars:[11,12]},
    {idVar:19,vars:[13,14]}
  ];

  let parametrosPago= await  personaController.getParametrosPago();


 
  //return valores;

   persDiff.forEach(persona=>{
    
    if (persona.IN_BD=="true"){

      if (persona["HH TURNO"]==12){
        let cantTurnos=persona["CANT TURNOS"];
        
        let parametrosTurno=parametrosPago.filter(parametro=>{
         if(var12horas.find(x=>x==parametro.ID)) 
          return parametro

        });


        persona.ESTRUCT_PAGO=parametrosTurno;
      }
      if (persona["HH TURNO"]==8){
        let cantTurnos=persona["CANT TURNOS"];
        let parametrosTurno=parametrosPago.filter(parametro=>{
         if(var8horas.find(x=>x==parametro.ID)) 
          return parametro

        });
        persona.ESTRUCT_PAGO=parametrosTurno;
      }

      else{
        
        //turnos de otra hora
        let cantTurnos=persona["CANT TURNOS"];
        let horasTurnos=persona["HH TURNO"].toString();
       

//array desde un objeto clonar copia

      // let parametrosOtros=Array.from(Object.assign({},parametrosPago));
      let parametrosOtros = JSON.parse(JSON.stringify(parametrosPago));
        let parametrosTurno=parametrosOtros.filter(parametro=>{
         if(var12horas.find(x=>x==parametro.ID)) {

          parametro.VALOR=parseInt(parseInt(parametro.VALOR)*parseInt(persona["HH TURNO"])/12);
          parametro.NOMBRE=parametro.NOMBRE.replace("12",horasTurnos);

          return parametro
         }

        });

        persona.ESTRUCT_PAGO=parametrosTurno;
        

      }

  
 

    }else{
     persona.ESTRUCT_PAGO=null

    }
   

   });


//añade info de turno y totales parciales al json
   persDiff.forEach(personaTurno=>{
    
    let cantTurnos=personaTurno["CANT TURNOS"];

    if (personaTurno.IN_BD=="true"){

      personaTurno.ESTRUCT_PAGO.forEach(estrucPago=>{
        estrucPago.VALOR=estrucPago.VALOR*cantTurnos;
        estrucPago.CANT_TURNOS=cantTurnos;

          //mappingvars
    //parametrosPago
    //obtenemos el id de la variable mapeada correspondiente: sueldo base, gratificacion, etc segun el id de estruct pago
    let filtraVariable= mappingvars.filter(variable=>{
      
      /*   let mappingvars=[
      {idVar:16,vars:[7,8]},
      {idVar:17,vars:[9,10]},
      {idVar:18,vars:[11,12]},
      {idVar:19,vars:[13,14]}
    ];
  
    */
        return variable.vars.find(x=>x==estrucPago.ID);
      });
  
      let idVariable=filtraVariable[0].idVar;
      let variableDetalle=parametrosPago.find(x=>x.ID==idVariable);

      estrucPago.VARIABLE_CODI=variableDetalle.VALOR;
      estrucPago.VARIABLE_DESC=variableDetalle.NOMBRE;






      
      });


    
    }
  });



   //calcula totales generales por persona


  persDiff.forEach(persona=>{
    if(persona.ESTRUCT_PAGO){
    var total = persona.ESTRUCT_PAGO.reduce((a, b) => ({VALOR: parseInt(a.VALOR) + parseInt(b.VALOR)}));
    persona.TOTAL_DIARIO=total.VALOR;
    persona.TOTAL_HABERES=total.VALOR*persona["CANT TURNOS"];  
  }
   

    
  }); 
    



   return persDiff;


 }






 async function generaMapeoCalculo(mappingvars){
   
    let cantturnos12=2
    let cantturnos8=3
    let otros=4



  let parametrosPago= await  personaController.getParametrosPago();


  let calcula=mappingvars.map(value=>{
      console.log(Object.keys(value))
      let keynombre=Object.keys(value)[0];

      //Extrae la key del valor calculado (codigo variable softland)
    let nombre=  parametrosPago.find(x=>x.ID==keynombre) 
    
      //Extrae los valores que irán en las variables 
    let valores= value[keynombre].map(valueVar=>{
    let valueVarDesc=  parametrosPago.find(x=>x.ID==valueVar)

         return valueVarDesc
      });

      
    
  return {variable:nombre,valores:valores}

  

    //si es de 8 horas var8horas

    //si es de 12 horas var12horas

    //si es de otro tipo hora proporcionar a la de 12

    
   

  });

   console.log(calcula);

   return calcula;


/*
   let varValue8=parametrosPago.filter(value=>{
    return var8horas.find(x=>x==value.ID)
   });





   let varValue12=parametrosPago.filter(value=>{
    return var12horas.find(x=>x==value.ID)

   });

   */

   
   //console.log(varValue8,varValue12);





 }



  module.exports={generaReliquidacionUpdload,getPersonalArchivo,getRemuneracionesMes,getFechasRemuneracArchivo,generaPartReliquidacionUpdload}

   