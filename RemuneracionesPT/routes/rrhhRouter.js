const express = require('express');
const bodyParser = require('body-parser');
const rrhhRouter = express.Router();
rrhhRouter.use(bodyParser.json());
const rrhhRouterPers = express.Router();
rrhhRouterPers.use(bodyParser.json());

var sql = require("mssql");

// config for your database
var config = {
    user: 'targit',
    password: 'targit2015*',
    server: '192.168.100.14', 
    database: 'Inteligencias' 
};
  var recordsetfinal;
 function entrega_result(queryDB,micallback){
   
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
        
            micallback(recordset);
          

        });
        
    });

}
  

rrhhRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=> {
   // send records as a response
var query=`SELECT * FROM [Inteligencias].[dbo].[RRHH_ESTRUCTURA_SUELDO]  where VARIABLE_CODI='D066' and FECHA='20180701'  and DIA='01'`

   entrega_result(query,
     function (result){
     res.send(result);
   //  console.log(result);
       });
   
});



rrhhRouter.route('/:variable/:fecha')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=> {
   // send records as a response
   var query=`SELECT *  FROM [Inteligencias].[dbo].[RRHH_ESTRUCTURA_SUELDO]  where VARIABLE_CODI='`+req.params.variable+`' and FECHA='`+req.params.fecha+`'  and DIA='01'`
  console.log(query);
   console.log( req.params.fecha);
  console.log( req.params.variable);
  console.log(query);
   entrega_result(query,
     function (result){
     res.send(result);
   //  console.log(result);
       });
});


rrhhRouterPers.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=> {
   // send records as a response
   var query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO  FROM [Inteligencias].[dbo].[VIEW_SOFT_PERSONAL_ULTIMO_MES] `
  console.log( req.params.fecha);
  console.log( req.params.variable);
  console.log(query);
   entrega_result(query,
     function (result){
     res.send(result);
   //  console.log(result);
       });
});





module.exports = rrhhRouter;
module.exports = rrhhRouterPers;
