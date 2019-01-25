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


function getVariableMes(req,res){

  //example http://localhost:3800/softland/getVariableMes/0/2019-01/H303
  let fecha= req.params.fecha;
  let variable= req.params.variable;
  let empresa= req.params.empresa;

  console.log(fecha,variable,empresa);
  let  query=`select FICHA,VARIABLE_CODI,VARIABLE_MONTO,EMP_CODI from [Inteligencias].[dbo].RRHH_ESTRUCTURA_SUELDO WHERE  
   VARIABLE_CODI='`+variable+`' and
  emp_codi=`+empresa+` and fecha='`+fecha+`'   and DIA_DESC='HASTA MES EN CURSO'`;

  entrega_resultDB2(query,null).then(result=>{
    if (result.length>0){ 
     console.log("hay result");
     res.status(200).send(result);
   
       
   }else{ console.log("no hay");
   res.status(200).send({message:'No hay data disponible'});
  
  }
   
   });

}


function getVariablesPersona(req,res){

  //example http://localhost:3800/softland/getVariablesPersonaMes/0/2019-01/13ACJU005/D001
  let fecha= req.params.fecha;
  let empresa= req.params.empresa;
  let variable= req.params.variable;
  let ficha= req.params.ficha;

  console.log(fecha,variable,empresa);
let query;
  if(variable){
    query=`select FICHA,VARIABLE_CODI,VARIABLE_MONTO,EMP_CODI from [Inteligencias].[dbo].RRHH_ESTRUCTURA_SUELDO WHERE  
    VARIABLE_CODI='`+variable+`' and FICHA='`+ficha+`' and
   emp_codi=`+empresa+` and fecha='`+fecha+`' and DIA_DESC='HASTA MES EN CURSO'`;

  }else{

    query=`select FICHA,VARIABLE_CODI,VARIABLE_MONTO,EMP_CODI from [Inteligencias].[dbo].RRHH_ESTRUCTURA_SUELDO WHERE  
    FICHA='`+ficha+`' and
   emp_codi=`+empresa+` and fecha='`+fecha+`' and DIA_DESC='HASTA MES EN CURSO'`;
  }


  entrega_resultDB2(query,null).then(result=>{
    if (result.length>0){ 
     console.log("hay result");
     res.status(200).send(result);
   
       
   }else{ console.log("no hay");
   res.status(200).send({message:'No hay data disponible'});
  
  }
   
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
   });


   }); 



}





     module.exports={getVariableMes,getVariablesPersona}

   
     