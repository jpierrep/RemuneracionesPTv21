'use strict'




var async= require('async');

var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');
//uso de ficheros
var fs=require('fs');
//rutas de ficheros
var path=require('path');

var sql = require("mssql");
var ExcelFilename;
var moment = require('moment');

// config for your database
var config = {
    user: 'targit',
    password: 'targit2015*',
    server: '192.168.100.14', 
    database: 'Inteligencias' 
};

const schema = {
    'NOMBRE': {
      prop: 'NOMBRE',
      type: String
      // Excel stores dates as integers.
      // E.g. '24/03/2018' === 43183.
      // Such dates are parsed to UTC+0 timezone with time 12:00 .
    },
    'RUT': {
        prop: 'RUT',
        type: String

      },
      'TIPO': {
        prop: 'TIPO',
        type: String

      },
      'DIA': {
        prop: 'DIA',
        type: String

      },
      'CANTIDAD_HRS': {
        prop: 'CANTIDAD_HRS',
        type: Number

      }

}


function home (req,res){
    res.status(200).send({
        message:'Hola mundo desde el servidor'
    
    })
    console.log(req.body);
     };

/*
    function getPersonalAsist (){


    readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
    //console.log(rows)
    let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
     convierteRutID("17.933.157-8"); 
     result=JSON.parse(result);
     return   result;
    }); 
}
*/


//Funcion final que realiza proceso completo
async function generaProcesoSueldoUpdload(req,res){
  
  //obtiene parametros para el pago de sueldo
 let parametrosPago= await getParametrosPago();
  console.log(parametrosPago);
  console.log("dentro genera proceso")

  let sueldoBaseVar="";
  let liquidoPagoVar="";
  if(parametrosPago.find(x=>x.ID==3).VALOR) sueldoBaseVar=parametrosPago.find(x=>x.ID==3).VALOR;  //valor para el turno de 12
  if(parametrosPago.find(x=>x.ID==4).VALOR) liquidoPagoVar=parametrosPago.find(x=>x.ID==4).VALOR;   //valor para el turno de 8
  if(parametrosPago.find(x=>x.ID==4).VALOR) reliquidacionVar=parametrosPago.find(x=>x.ID==6).VALOR;   //valor para el turno de 8
  let vars=`'`+sueldoBaseVar+`','`+liquidoPagoVar+`'`;  

  let optionProcess={fecha:JSON.parse(req.body.fecha),proceso:JSON.parse(req.body.proceso),variables:vars}
  console.log(optionProcess);

  

  await uploadFile(req,res);
  let persAsist= await TESTgetPersonalAsist();
  //res.status(200).send(persAsist);
  let persAgrupa=await getAgrupaPers(persAsist);
 // console.log(persAgrupa);

  let persRRHH=await getPersonalSoft();
 
  let persDiff=await getPersonalBD(persAgrupa,persRRHH);   
  //res.status(200).send(persDiff);
  let persVar=await getVariablesSueldoPers(optionProcess,persDiff);

 let persCalcula=await getCalculaSueldo(optionProcess,persVar,parametrosPago);  
 
  res.status(200).send(persCalcula);
  
}

function getAgrupaPers(persAsist){
  return new Promise(resolve=>{

    let rut=  persAsist.map(value=>{
        return convierteRutID(value.RUT);
    });
 
 
   let unique = (value, index, self) => {
 
     return self.indexOf(value) == index;
 }
 
 let distinctRut = rut.filter(unique);

    
 
 //let zonasJson=[];
 //distinctZonas.map(element => {
 //   zonasJson.push({"name":element});
 // });
 
 //this.zonas=zonasJson;
  console.log(distinctRut);
  let personalTurnos=distinctRut.map(value=>{

 let turnos= persAsist.filter(x=>convierteRutID(x.RUT)==value).map(element=>{
  return {NOMBRE:element.NOMBRE,RUT:element.RUT,TIPO:element.TIPO, DIA:moment(element.DIA).format("DD/MM/YYYY"),CANTIDAD_HRS:element.CANTIDAD_HRS};

 });
  
 console.log(turnos);
 // let object=new Object;
 // object["PERSONA"]=value;
 // object["TURNOS"]=turnos;
     return {RUT_ASIST:value,TURNOS:turnos};
  

  
  });


 resolve(personalTurnos);

  });
}


function getPersonalAsist (){
  return new Promise(resolve=>{
    readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
   // readXlsxFile('uploads/personas/'+ExcelFilename,{schema}).then((rows) => {
   let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
    convierteRutID("17.933.157-8"); 
    result=JSON.parse(result);
    resolve(result);
    }); 
  });

}

function TESTgetPersonalAsist (){
  return new Promise(resolve=>{
    //readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
    readXlsxFile('uploads/personas/'+ExcelFilename,{schema}).then((rows) => {
   let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
  
    result=JSON.parse(result);
    resolve(result);
    }); 
  });

}

function getPersonalSoft(optionsProcess){

   let query;
   
  if (optionsProcess){
    let fecha=optionsProcess.fecha.value;
    let mes=fecha.substr(0,2);
 let año=fecha.substr(3,4);

 let fechaquery=año+'-'+mes+'-01'

  //si trae fecha se saca la info de la fecha, si no la del ultimo mes

   query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
  on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V' and FECHA_SOFT='`+fechaquery+`'`
  }else{
     query=
    `SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL_ULTIMO_MES] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
  on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V'`
  }

   //query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[RRHH_PERSONAL_SOFT] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
   //on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V'and FECHA_SOFT='2018-08-01'` 
return new Promise(resolve=>{
  entrega_resultDB(query,(result)=>{
    
    resolve ( result);
 
 });

});

}

function getPersonalSoftOne(req,res){
  let rut_id= req.params.rut_id;
  console.log(rut_id);
  let  query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL_ULTIMO_MES] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
  on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V' and RUT_ID=`+rut_id

  entrega_resultDB2(query,null).then(result=>{
    if (result.length>0){ 
     console.log(result); 
     console.log(result.length);
     console.log("hay result");
     res.status(200).send(result);
       // console.log(value);
       
   }else{ console.log("no hay");
   res.status(200).send({message:'No hay data disponible'});
  
  }
   
   });

}

async function generaProcesoSueldo(req,res){

  
  //await uploadFile(req,res);
  let persAsist= await getPersonalAsist();
  let persRRHH=await getPersonalSoft();
  let persDiff=await getPersonalBD(persAsist,persRRHH);   
  let persVar=await getVariablesSueldoPers(persDiff);
  let persCalcula=await getCalculaSueldo(persVar);  
   res.status(200).send(persCalcula);


  
}





function getCalculaSueldo(optionProcess,persDiff,parametrosPago){
  let proceso=optionProcess.proceso.value;
  console.log("proceso es");
  console.log(proceso);

   let turno12=0; 
   let turno8=0 ;
   let sueldoBaseVar="";
   let liquidoPagoVar="";
   if(parametrosPago.find(x=>x.ID==1).VALOR) turno12=parseInt(parametrosPago.find(x=>x.ID==1).VALOR);  //valor para el turno de 12
   if(parametrosPago.find(x=>x.ID==2).VALOR) turno8=parseInt(parametrosPago.find(x=>x.ID==2).VALOR);   //valor para el turno de 8
   if(parametrosPago.find(x=>x.ID==3).VALOR) sueldoBaseVar=parametrosPago.find(x=>x.ID==3).VALOR;  
   if(parametrosPago.find(x=>x.ID==4).VALOR) liquidoPagoVar=parametrosPago.find(x=>x.ID==4).VALOR; 
  return new Promise(resolve=>{


    persDiff.forEach((element,index,array)=>{
      element.SUELDO_MONTO=0;
      element.DESCUENTO=0;
      element.OTROS_DESCUENTOS=0;
      element.CANT_TURNOS=0;
  

      
      if(element.IN_BD=="true"){
        if(element.CARGO_CODI=='122') {
          
          console.log("calculando a partime");
          //por cada uno de los turnos de la persona
          element.TURNOS.forEach((turno)=>{
                     
          if(turno.CANTIDAD_HRS==12){
            turno.VALOR_TURNO=turno12 //valor del turno de 12 hrs según parámetros
          }else if(turno.CANTIDAD_HRS==8){
            turno.VALOR_TURNO=turno8 //valor del turno de 8 hrs según parámetros
          }else{
            turno.VALOR_TURNO=(turno12*turno.CANTIDAD_HRS)/12 //Proporcion del turno de 12 horas
          }  

          });


         }  else{
           console.log("calculando a dotacion")
          
           
           let sueldoBase=0;
           let liquidoPago=0;
           if(element.SUELDO.find(x=>x.VARIABLE_CODI==sueldoBaseVar)) sueldoBase= element.SUELDO.find(x=>x.VARIABLE_CODI==sueldoBaseVar).VARIABLE_MONTO;  //tomando las variables liquidas y sueldo base de los parametros de la aplicacion
           if( element.SUELDO.find(x=>x.VARIABLE_CODI==liquidoPagoVar)) element.SUELDO.find(x=>x.VARIABLE_CODI==liquidoPagoVar).VARIABLE_MONTO;
          
           
           console.log( {nombre:element.NOMBRE ,ficha: element.FICHA,base:sueldoBase, liquido: liquidoPago});
          //calcula valor de cada turno
           element.TURNOS.forEach((turno)=>{
           if (sueldoBase){
            turno.VALOR_TURNO=Math.round(sueldoBase*0.0077777*0.8*turno.CANTIDAD_HRS,0);
          }else{
            turno.VALOR_TURNO=-1;
          }
        });

        if(liquidoPago&&proceso=='2a'){  //tienen que haber liquido a pago y el proceso debe ser segunda quincena
          if (liquidoPago<0 && liquidoPago*-1>=element.SUELDO_MONTO) element.DESCUENTO= element.SUELDO_MONTO+liquidoPago;  
       
        }
                
                
                    }

                          //calcula la suma de sueldos de todos los turnos y cantidad de turnos
                          element.TURNOS.forEach((turno)=>{
                            element.SUELDO_MONTO=element.SUELDO_MONTO+turno.VALOR_TURNO;
                            element.CANT_TURNOS++;
                          });
       
    
      }else{
       //Si no esta en BD
         // cantidad de turnos
         element.TURNOS.forEach((turno)=>{
          element.CANT_TURNOS++;
        });
        element.NOMBRE=element.TURNOS[0].NOMBRE;
        element.RUT=element.TURNOS[0].RUT;
        element.CARGO_DESC=element.TURNOS[0].TIPO;


      }

  
       
  
     });
  
    resolve(persDiff);

  });

}

/* function getCalculaSueldo2(optionProcess,persDiff){
  let proceso=optionProcess.proceso.value;
  console.log("proceso es");
  console.log(proceso);
  return new Promise(resolve=>{


    persDiff.forEach((element,index,array)=>{
      element.SUELDO_MONTO=0;
      element.DESCUENTO=0;
      element.OTROS_DESCUENTOS=0;
  

      
      if(element.IN_BD=="true"){
        if(element.CARGO_CODI=='122') {
          console.log("calculando a partime");
          if(element.CANTIDAD_HRS==12){
            element.SUELDO_MONTO=25000
          }else if(element.CANTIDAD_HRS==8){
            element.SUELDO_MONTO=19000
          }else{
            element.SUELDO_MONTO=(25000*CANTIDAD_HRS)/12 //Proporcion del turno de 12 horas
          }
         }  else{
           console.log("calculando a dotacion")
          
           
           let sueldoBase=0;
           let liquidoPago=0;
           if(element.SUELDO.find(x=>x.VARIABLE_CODI=="P001")) sueldoBase= element.SUELDO.find(x=>x.VARIABLE_CODI=="P001").VARIABLE_MONTO;
           if( element.SUELDO.find(x=>x.VARIABLE_CODI=="H303")) element.SUELDO.find(x=>x.VARIABLE_CODI=="H303").VARIABLE_MONTO;
          
           
           console.log( {nombre:element.NOMBRE ,ficha: element.FICHA,base:sueldoBase, liquido: liquidoPago});
          if (sueldoBase){
            element.SUELDO_MONTO=Math.round(sueldoBase*0.0077777*0.8*element.CANTIDAD_HRS,0);
          }else{
            element.SUELDO_MONTO=-1;
          }

        if(liquidoPago&&proceso=='2a'){  //tienen que haber liquido a pago y el proceso debe ser segunda quincena
          if (liquidoPago<0 && liquidoPago*-1>=SUELDO_MONTO) element.DESCUENTO= SUELDO_MONTO+liquidoPago;  
       
        }
      }
      }
       
  
     });
  
    resolve(persDiff);

  });

} */

function getVariablesSueldoPers(optionsProcess,persDiff){
   
   let fecha=optionsProcess.fecha.value;
    console.log(fecha);
   let mes=fecha.substr(0,2);
   let año=fecha.substr(3,4);
   console.log("la fecha y año es")
   let fechaquery=año+'-'+mes+'-01'
    console.log(fechaquery);
    let vars=optionsProcess.variables;
 
   //let proceso=optionsProcess.proceso;


  return new Promise(resolve=>{



   async.eachOf(persDiff,(value,key,callback)=>{
     //for each
     console.log(value.FICHA);
     //console.log("holaa");
    //callback();
    console.log(key);
     if(value.IN_BD=="true"){

     console.log(value.FICHA); 
     let query =`select * FROM [Inteligencias].[dbo].[RRHH_ESTRUCTURA_SUELDO] where DIA='01' and FECHA='`+fechaquery+`' and FICHA='`+replaceAll(value.FICHA,'"','')+`' and VARIABLE_CODI in (`+vars+ `)`; 
  
 
    entrega_resultDB2(query,null).then(result=>{
      if (result){ 
       // console.log(result); 
       console.log("hay result");
          value.SUELDO=result;
         // console.log(value);
         callback();
       
     }else{ console.log("no hay");
     callback();
    }
     
     });
    

    }else{
    callback();
    }
   },(err)=>{
    if (err) console.error(err.message); 
     //hacer algo
   console.log("termino todo");
   
   resolve (persDiff);
   //console.log(err);
    } );


  /*
    perDiff.forEach(element=>{
      if(element.IN_BD=="true"){
        console.log("es true");
      let vars=`'H303','P001'`;
      let query =`select * FROM [Inteligencias].[dbo].[RRHH_ESTRUCTURA_SUELDO] where DIA='01' and FECHA='2018-08-01' and FICHA='`+replaceAll(element.FICHA,'"','')+`' and VARIABLE_CODI in (`+vars+ `)`; 
      console.log("la query es"+ query); 
      entrega_resultDB(query,(result)=>{
        console.log("el resultado es "+ JSON.stringify(result));
        
       
       
      });

      //getVariablesSueldo(element.FICHA,'aaa',`'H303','P001'`,(result)=>{
      //  console.log(result);
      
     //      });

     }
    });
   */

  
  });


}

//realiza cruce según rut_id

function getPersonalBD(persAsist,persRRHH){

  return new Promise(resolve=>{

   persAsist.forEach(element => {
    element.IN_BD="false"; 
  
   });

 



   var resultTestAsist=persAsist.map((element)=>{
    //   console.log("el elemento es"+element.RUT);
    // let rutbuscar = convierteRutID(element.RUT);
    let rutbuscar = element.RUT_ASIST

        //console.log("evaluando" +element.RUT+"y"+rutbuscar)
  
      let persRRHHEncontrar= persRRHH.find(x=>x.RUT_ID==rutbuscar);
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

function getVariablesSueldo(ficha,mes,vars,callback){
  //las variables tienen que tener el formato 'H001','H105','P010'
  
  let query =`select * FROM [Inteligencias].[dbo].[RRHH_ESTRUCTURA_SUELDO] where DIA='01' and FECHA='2018-08-01' and FICHA='`+replaceAll(ficha,'"','')+`' and VARIABLE_CODI in (`+vars+ `)`; 
  console.log("la query es"+ query); 
  entrega_resultDB(query,(result)=>{
    console.log("el resultado es "+ JSON.stringify(result));
    
    callback(result);
   
  });
  
  
  
  }



   function getDiferenciasPersonal1(req,res){
   
    readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
    //console.log(rows)
    let resultAsist= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
          
     resultAsist= JSON.parse(resultAsist);

     let  query=`SELECT  FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL_ULTIMO_MES]  where Estado='V'`;

     entrega_resultDB(query,(resultDB)=>{

      //console.log(resultAsist[0]);

     

      var resultTestAsist=resultAsist.filter((element)=>{
      //   console.log("el elemento es"+element.RUT);
       let rutbuscar = convierteRutID(element.RUT);
       
       
      if (resultDB.find(x=>x.RUT_ID==rutbuscar)){
        console.log(" SI encontró");
        return element;
      }
         else {  console.log(" NO encontró");
        }
       
   
      });


      
      
        
    return   res.status(200).send(resultTestAsist);
    }); 


});

}


  function convierteRutID (rut){
     
    rut=rut.substr(0,rut.length-1);
    rut=replaceAll(rut,".","");
    rut=replaceAll(rut,"-","");
    // rut1=rut.replace(".","");
    if (isNaN(parseFloat(rut)) && !isFinite(rut))
      rut=0;
    
  
   console.log("el rut es:"+rut);
   return rut;
  }
 
  function replaceAll (string, omit, place, prevstring) {
    if (prevstring && string === prevstring)
      return string;
    prevstring = string.replace(omit, place);
    return replaceAll(prevstring, omit, place, string)
  }

  //const  jsonPersona ='[{"FICHA":"113FLORI30","NOMBRES":"GONZALEZ MOYA HERNAN","RUT":"008.247.003-4","RUT_ID":10420150,"DIRECCION":"AV. CERRILLOS 7530","FECHA_INGRESO":"01/12/2015","FECHA_FINIQUITO":"10/01/2016","ESTADO":"F"},{"FICHA":"13ACJU001","NOMBRES":"LAGOS LAVIN HERMAN EUGENIO","RUT":"007.680.542-3","RUT_ID":7680542,"DIRECCION":"CERRO LA SILLA N°1029","FECHA_INGRESO":"01/02/2008","FECHA_FINIQUITO":"23/02/2009","ESTADO":"F"},{"FICHA":"13ACJU002","NOMBRES":"ASTETE VILLEGAS HECTOR JOEL","RUT":"006.445.943-0","RUT_ID":6445943,"DIRECCION":"PASAJE CARMELA CARVAJAL N°3939","FECHA_INGRESO":"01/02/2008","FECHA_FINIQUITO":"30/06/2008","ESTADO":"F"},{"FICHA":"13ACJU003","NOMBRES":"DOMINGUEZ BARRIOS JOSE EDMUNDO","RUT":"004.889.052-0","RUT_ID":4889052,"DIRECCION":"BELGICA N°1669","FECHA_INGRESO":"01/02/2008","FECHA_FINIQUITO":"25/03/2009","ESTADO":"F"},{"FICHA":"13ACJU004","NOMBRES":"GARRIDO ORELLANA ALFREDO RICARDO","RUT":"005.523.966-5","RUT_ID":5523966,"DIRECCION":"LAS CLEVIAS N°0566 V. PRIMAVERA","FECHA_INGRESO":"01/07/2008","FECHA_FINIQUITO":"25/03/2009","ESTADO":"F"},{"FICHA":"13ACJU005","NOMBRES":"ESCOBAR OSSES ALEJANDRO HERNAN","RUT":"009.926.438-1","RUT_ID":9926438,"DIRECCION":"POBLACION SANTIAGO UROFOSFATO N° 2171","FECHA_INGRESO":"28/02/2009","FECHA_FINIQUITO":"31/12/9999","ESTADO":"V"},{"FICHA":"13ACJU006","NOMBRES":"FUENTES PEÑA JOSE SEGUNDO","RUT":"005.250.203-9","RUT_ID":5250203,"DIRECCION":"PASAJE BENTONITA  N°1113 VILLA LOS INDUSTRIALES","FECHA_INGRESO":"13/03/2009","FECHA_FINIQUITO":"31/08/2009","ESTADO":"F"},{"FICHA":"13ACJU007","NOMBRES":"RIOS SOTO JUAN ALBERTO","RUT":"007.066.150-0","RUT_ID":7066150,"DIRECCION":"PASAJE LAS TENCAS N°1870","FECHA_INGRESO":"27/03/2009","FECHA_FINIQUITO":"05/04/2010","ESTADO":"F"},{"FICHA":"13ACJU008","NOMBRES":"PULGAR SALVADE HERIBERTO ANTONIO","RUT":"005.290.682-2","RUT_ID":5290682,"DIRECCION":"PASAJE SEGUNDA TRANSVERSAL Nº3061","FECHA_INGRESO":"23/08/2009","FECHA_FINIQUITO":"31/05/2014","ESTADO":"F"},{"FICHA":"13ACJU009","NOMBRES":"VIDAL FIGUEROA JORGE WASHINGTON","RUT":"006.768.259-9","RUT_ID":6768259,"DIRECCION":"ALMIRANTE LINCH Nº 1110","FECHA_INGRESO":"01/04/2010","FECHA_FINIQUITO":"31/12/2010","ESTADO":"F"}]';
  //const jsonSueldo ='[{"FICHA":"113FLORI30","VARIABLE_CODI":"H303","VARIABLE_MONTO":50000}]';
  
  //function entrega_resultDB(queryDB, callback){
  //  return callback(JSON.parse(jsonPersona));

  //}


 function entrega_resultDB(queryDB, callback){
   
  // const fruit = request.params.parame;

    // connect to your database
   sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(queryDB
    , function (err, recordset) {
             
            if (err) console.log(err)
         
            callback(recordset);
          

        });
        
    });

}

function entrega_resultDB2(queryDB, callback){
  return new Promise(resolve=>{ 
  // const fruit = request.params.parame;

    // connect to your database
   sql.connect(config).then((pool)=>{
     return pool.request().query(queryDB)
   }).then(result=>{
    resolve(result);

    }).catch(err=>{
     console.log(err);
   })


   }); 



}


    //subir archivos de usuario avatar

   function uploadFile(req,res){
    
    return new Promise(resolve=>{
    //  var userId=req.params.id;
 
         //request trae archivos si es que son subidos
       if(req.files){
           //campo path del campo imagen enviado por post
         var file_path=req.files.file.path;
         //obtneemos el nombre del archivo
         var file_split=file_path.split('\\');
         console.log(file_split);
         //[ 'uploads', 'users', 'LmkbKFCxtEqb4Ij6eeppHipB.jpg' ]
         //en la posicion 2 entrega el nombre del archivo
         var file_name=file_split[2]
         //seteamos la variable global con el nombre del archivo a leer
         ExcelFilename=file_name;
         //extencion del archivo
         var ext_split=file_name.split('\.');
         var file_ext=ext_split[1];
         //comprobar que las extenciones son correctas
 //puede subir usuarios solamente el dueño de la cuenta

         if(  file_ext=='xls'||file_ext=='xlsx'){
            //Actualizar documento de usuario logeado
          
                // return res.status(200).send({message:"se cargo el archivo"});
                console.log("se cargó el archivo");
               resolve();
 
        
              }else{
         return  removeFilesOfUploads(res,file_path,"error en la extencion"); //lleva return para no mandar respuestas seguidas y nos de error no se pueden enviar varias cabeceras a la vez
 
         }
     }else{
           return res.status(200).send({message:'No se han subido archivos'});
       }
 
      });
    }

    function  removeFilesOfUploads(res, file_path,message_print){
       //si no es correcto, se elimina el archivo subido, pues la libreria lo sube de todas maneras
       fs.unlink(file_path,(err)=>{
         //hay error
           return res.status(200).send({message:message_print});
       });
      }
 

        function downoloadFIle (req,res){
          console.log("dentro");
          var filepath='./uploads/personas/'+ExcelFilename;
          var filename=ExcelFilename;
         // return res.status(200).send({message:"asdassa"});
          res.download(filepath,filename,(err)=>{
            console.log(filepath);
            console.log(filename);
            if(err){
              console.log(err);
            }
          });

        }

      
      async  function getParametrosPago(){
          return new Promise(resolve=>{
          let  query=`SELECT *
      FROM [Inteligencias].[dbo].[RRHH_PARAM_SUELDO]`
        
          entrega_resultDB2(query,null).then(result=>{
            if (result.length>0){ 
             console.log(result.length);
             console.log("hay result");
           
             resolve(result);
               // console.log(value);
               
           }else{ console.log("no hay");
           
          
          }
           
           });
          });
        }



     module.exports={home,getPersonalSoft,getPersonalAsist,generaProcesoSueldo,uploadFile,generaProcesoSueldoUpdload,downoloadFIle,getPersonalSoftOne,convierteRutID,getVariablesSueldoPers,getParametrosPago,entrega_resultDB}

   
     
