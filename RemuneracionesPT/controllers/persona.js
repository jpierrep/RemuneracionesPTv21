'use strict'


var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');
//uso de ficheros
var fs=require('fs');
//rutas de ficheros
var path=require('path');

var sql = require("mssql");

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


function getPersonalAsist (req,res){
    readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
    //console.log(rows)
    let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
     convierteRutID("17.933.157-8"); 
    return   res.status(200).send(result);
   
    }); 
}

function getPersonalSoft(req,res){
 let  query=`SELECT top 10 FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL_ULTIMO_MES] `

 entrega_resultDB(query,(result)=>{
    //let json= JSON.parse(result); 


   
    return   res.status(200).send(result);
 
 });

 

}


   function getDiferenciasPersonal(req,res){
   
    readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
    //console.log(rows)
    let resultAsist= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
          
     resultAsist= JSON.parse(resultAsist);

     let  query=`SELECT top 10 FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL_ULTIMO_MES] `;

     entrega_resultDB(query,(resultDB)=>{

      console.log(resultAsist[0]);

      //convierte RUT_ID

      resultAsist.map((element)=>{
         
       let rutbuscar = convierteRutID( element.RUT_ID);
       
       resultDB.find(x=>x.RUT_ID===rutbuscar);
         
          return element;
   
      });
      
      
        
    //return   res.status(200).send(result);
    }); 


});

}


  function convierteRutID (rut){
      
    rut=rut.substr(0,rut.length-1);
    rut=replaceAll(rut,".","");
    rut=replaceAll(rut,"-","");
    // rut1=rut.replace(".","");
  
   console.log(rut);
   return rut;
  }
 
  function replaceAll (string, omit, place, prevstring) {
    if (prevstring && string === prevstring)
      return string;
    prevstring = string.replace(omit, place);
    return replaceAll(prevstring, omit, place, string)
  }

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
         
            return  callback(recordset);
          

        });
        
    });

}

     module.exports={home,getPersonalSoft,getPersonalAsist,getDiferenciasPersonal}