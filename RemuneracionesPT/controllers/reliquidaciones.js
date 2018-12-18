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
  
   
    //obtiene parametros para el pago de sueldo
   let parametrosPago= await  personaController.getParametrosPago();

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
    let optionProcess={fecha:{name:'Diciembre', value:'12/2018'},proceso:{name:'Reliquidaciones', value:'Reliquida'},variables:vars};
    console.log(optionProcess);
  
      
    
  //  Realiza la carga al servidor del archivo
  //  await uploadFile(req,res);
   


    let persAsist= await getPersonalArchivo();
    //res.status(200).send(persAsist);
   // let persAgrupa=await getAgrupaPers(persAsist);
  
    let persRRHH=await personaController.getPersonalSoft();
   
    let persDiff=await getPersonalBD(persAsist,persRRHH);   
    //res.status(200).send(persDiff);
   //
    let persVar=await personaController.getVariablesSueldoPers(optionProcess,persDiff);
    res.status(200).send(persVar);
 
  
   //let persCalcula=await getCalculaSueldo(optionProcess,persVar,parametrosPago);  
   
     
  //  res.status(200).send(persCalcula);
    
  }

  


  function getPersonalArchivo (req,res){
    return new Promise(resolve=>{
      //readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
      readXlsxFile('uploads/reliquidaciones/reliqucmpc.xlsx',).then((rows) => {
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

   if (req.body.fecha){
       //si viene fecha
   }else{
       //si no viene fecha, extraer el ultimo día del mes en curso
   //extrae la info del mes actual, pues no se puede pagar en relacion a meses pasados
  let  query=`select convert(date,max(Fecha_Registro)) as MaxFecha from inteligencias.dbo.RRHH_APP_REG_VAR`
  
//return new Promise(resolve=>{
    personaController.entrega_resultDB(query,(result)=>{

      console.log(result[0].MaxFecha)
      let maxFecha=result[0].MaxFecha;
      maxFecha=moment(maxFecha).format("YYYY-MM-DD");
      query=`SELECT  [ficha] ,[codVariable] ,[valor] ,[empresa],[Fecha_Registro]
      FROM [Inteligencias].[dbo].[RRHH_APP_REG_VAR] where convert(date,fecha_Registro)='`+maxFecha+`'`
      
      personaController.entrega_resultDB(query,(resultFinal)=>{
     
        res.status(200).send(resultFinal);
      //   resolve ( resultFinal);
    });

      
    
  
 
 

});

  //});
    }



  }



  module.exports={generaReliquidacionUpdload,getPersonalArchivo,getRemuneracionesMes }

   