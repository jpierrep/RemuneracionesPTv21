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
     result=JSON.parse(result);
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

      console.log("los que se encontro"+resultTestAsist[0].RUT);
      
      
        
    return   res.status(200).send(resultTestAsist);
    }); 


});

}


  function convierteRutID (rut){
     
    rut=rut.substr(0,rut.length-1);
    rut=replaceAll(rut,".","");
    rut=replaceAll(rut,"-","");
    // rut1=rut.replace(".","");
  
   console.log("el rut es:"+rut);
   return rut;
  }
 
  function replaceAll (string, omit, place, prevstring) {
    if (prevstring && string === prevstring)
      return string;
    prevstring = string.replace(omit, place);
    return replaceAll(prevstring, omit, place, string)
  }

  const  jsonPersona ='[{"FICHA":"113FLORI30","NOMBRES":"GONZALEZ MOYA HERNAN","RUT":"008.247.003-4","RUT_ID":10420150,"DIRECCION":"AV. CERRILLOS 7530","FECHA_INGRESO":"01/12/2015","FECHA_FINIQUITO":"10/01/2016","ESTADO":"F"},{"FICHA":"13ACJU001","NOMBRES":"LAGOS LAVIN HERMAN EUGENIO","RUT":"007.680.542-3","RUT_ID":7680542,"DIRECCION":"CERRO LA SILLA N°1029","FECHA_INGRESO":"01/02/2008","FECHA_FINIQUITO":"23/02/2009","ESTADO":"F"},{"FICHA":"13ACJU002","NOMBRES":"ASTETE VILLEGAS HECTOR JOEL","RUT":"006.445.943-0","RUT_ID":6445943,"DIRECCION":"PASAJE CARMELA CARVAJAL N°3939","FECHA_INGRESO":"01/02/2008","FECHA_FINIQUITO":"30/06/2008","ESTADO":"F"},{"FICHA":"13ACJU003","NOMBRES":"DOMINGUEZ BARRIOS JOSE EDMUNDO","RUT":"004.889.052-0","RUT_ID":4889052,"DIRECCION":"BELGICA N°1669","FECHA_INGRESO":"01/02/2008","FECHA_FINIQUITO":"25/03/2009","ESTADO":"F"},{"FICHA":"13ACJU004","NOMBRES":"GARRIDO ORELLANA ALFREDO RICARDO","RUT":"005.523.966-5","RUT_ID":5523966,"DIRECCION":"LAS CLEVIAS N°0566 V. PRIMAVERA","FECHA_INGRESO":"01/07/2008","FECHA_FINIQUITO":"25/03/2009","ESTADO":"F"},{"FICHA":"13ACJU005","NOMBRES":"ESCOBAR OSSES ALEJANDRO HERNAN","RUT":"009.926.438-1","RUT_ID":9926438,"DIRECCION":"POBLACION SANTIAGO UROFOSFATO N° 2171","FECHA_INGRESO":"28/02/2009","FECHA_FINIQUITO":"31/12/9999","ESTADO":"V"},{"FICHA":"13ACJU006","NOMBRES":"FUENTES PEÑA JOSE SEGUNDO","RUT":"005.250.203-9","RUT_ID":5250203,"DIRECCION":"PASAJE BENTONITA  N°1113 VILLA LOS INDUSTRIALES","FECHA_INGRESO":"13/03/2009","FECHA_FINIQUITO":"31/08/2009","ESTADO":"F"},{"FICHA":"13ACJU007","NOMBRES":"RIOS SOTO JUAN ALBERTO","RUT":"007.066.150-0","RUT_ID":7066150,"DIRECCION":"PASAJE LAS TENCAS N°1870","FECHA_INGRESO":"27/03/2009","FECHA_FINIQUITO":"05/04/2010","ESTADO":"F"},{"FICHA":"13ACJU008","NOMBRES":"PULGAR SALVADE HERIBERTO ANTONIO","RUT":"005.290.682-2","RUT_ID":5290682,"DIRECCION":"PASAJE SEGUNDA TRANSVERSAL Nº3061","FECHA_INGRESO":"23/08/2009","FECHA_FINIQUITO":"31/05/2014","ESTADO":"F"},{"FICHA":"13ACJU009","NOMBRES":"VIDAL FIGUEROA JORGE WASHINGTON","RUT":"006.768.259-9","RUT_ID":6768259,"DIRECCION":"ALMIRANTE LINCH Nº 1110","FECHA_INGRESO":"01/04/2010","FECHA_FINIQUITO":"31/12/2010","ESTADO":"F"}]';
  const jsonSueldo ='[{"FICHA":"113FLORI30","VARIABLE_CODI":"H303","VARIABLE_MONTO":50000}]';
  function entrega_resultDB(queryDB, callback){
    return callback(JSON.parse(jsonPersona));

  }

  /*
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

*/

     module.exports={home,getPersonalSoft,getPersonalAsist,getDiferenciasPersonal}