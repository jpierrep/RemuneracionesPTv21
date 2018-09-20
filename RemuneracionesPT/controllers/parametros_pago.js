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


function home (req,res){
    res.status(200).send({
        message:'Hola mundo desde el servidor'
    
    })
    console.log(req.body);
     };


  function updateParameter(req,res){

    let param_id= req.body.param_id;
   let param_new_value= req.body.param_new_value;
  let  query=`update [Inteligencias].[dbo].[RRHH_PARAM_SUELDO] set VALOR=`+param_new_value+` where ID=`+param_id;
  console.log(query);
  
  // let  query=`select * from [Inteligencias].[dbo].[RRHH_PARAM_SUELDO]  where ID=`+param_id;
   
 
        entrega_resultDB(query,null).then(()=>{
           res.status(200).send({message:"update ok"});
             // console.log(value);
            
         
        }).catch(err=>{
            res.status(404).send({Error:err});
         });

  }

     
function getAllParameters(req,res){
    
    
    let  query=`SELECT *
FROM [Inteligencias].[dbo].[RRHH_PARAM_SUELDO]`
  
    entrega_resultDB(query,null).then(result=>{
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

  function entrega_resultDB(queryDB){
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

  module.exports={home,getAllParameters,updateParameter};