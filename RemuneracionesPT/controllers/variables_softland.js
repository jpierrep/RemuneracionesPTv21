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


function getPlantillas(req,res){

  let  query=`  SELECT distinct *
  FROM [Inteligencias].[dbo].[RRHH_Mapeo_Variables_Plantilla]  where activo=1
  `
 
   entrega_resultDB2(query,null).then(result=>{
    return res.status(200).send(result);

});
}

function getPlantillaVariablesOne(req,res){
  let plantilla_id= req.params.plantilla_id;
  let  query=`  SELECT *
  FROM [Inteligencias].[dbo].[RRHH_Mapeo_Variables]  where plantilla_id=`+plantilla_id;
 
   entrega_resultDB2(query,null).then(result=>{
    return res.status(200).send(result);

});
}



function CreaPlantilla(req,res){

  //console.log(JSON.parse(req.body.plantilla));
 
 //let plantilla={name:'Plantilla Reliquidaciones',variables:[{field:'C.COSTO',variable:'H003'},{field:'DIAS_LICENCIA',variable:'H082'}]};
 console.log(req.body.plantilla) 

 //En el post el request ya trae en formato json el body debido al middelware que cargamos body parser
//por lo que es posible asignarlo sin hacer JSON.parse


 let plantilla=req.body.plantilla
 let datetime=new Date();
 //let plantilla=JSON.parse(req.body.plantilla)


 let  query=`  insert into [Inteligencias].[dbo].[RRHH_Mapeo_Variables_Plantilla] (nombre,activo,created_at,updated_at) values ('`+plantilla.name+`',1,getdate(),getdate())
 SELECT @@IDENTITY as id
 `

  entrega_resultDB2(query,null).then(result=>{

     let idPlantillaInsert=result[0].id;

const tableVars = new sql.Table('RRHH_Mapeo_Variables') // or temporary table, e.g. #temptable

tableVars.columns.add('plantilla_id', sql.Int, {nullable: true})
tableVars.columns.add('columna_nombre', sql.VarChar(255), {nullable: true})
tableVars.columns.add('columna_variable', sql.VarChar(50), {nullable: true})
tableVars.columns.add('created_at', sql.DateTime, {nullable: true})
tableVars.columns.add('updated_at', sql.DateTime, {nullable: true})



  plantilla.variables.forEach(element => {
    
      
      tableVars.rows.add(idPlantillaInsert,element.field,element.variable,datetime,datetime)
    // tableVars.rows.add(element.field)
      
    });   


   
   // connect to your database
   sql.connect(config).then((pool)=>{
    return pool.request().bulk(tableVars)
    .then(result2=>{
  console.log(result2);
    return res.status(200).send({"status":"ok"});
  }).catch(err=>{
    console.log(err);
  });


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
   });


   }); 



}




module.exports={CreaPlantilla,getPlantillaVariablesOne,getPlantillas}