const express = require('express');
const bodyParser = require('body-parser');
const rrhhRouter = express.Router();
rrhhRouter.use(bodyParser.json());

var sql = require("mssql");

// config for your database
var config = {
    user: 'targit',
    password: 'targit2015*',
    server: '192.168.100.14', 
    database: 'Inteligencias' 
};
  var recordsetfinal;
 function entrega_result(micallback){
   
  // const fruit = request.params.parame;

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(`SELECT *   FROM [Inteligencias].[dbo].[RRHH_ESTRUCTURA_SUELDO]  where VARIABLE_CODI='D066' and FECHA='20180701'  and DIA='01'`
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
   //var result=this.entrega_result();
   //console.log(entrega_result());
   entrega_result(
     function (result){
     res.send(result);
     console.log(result);
       });
   
});



rrhhRouter.route('/:id')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=> {
 console.log("holaa")
});


module.exports = rrhhRouter;