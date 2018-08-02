const express = require('express');
const bodyParser = require('body-parser');
const asistDiasTrabRouter = express.Router();
asistDiasTrabRouter.use(bodyParser.json());


var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');

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


 function entrega_result(micallback){

    readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
    //console.log(rows)
     JSON.stringify(micallback(rows.rows)); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
    
    });

}
    
   
asistDiasTrabRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=> {
   // send records as a response
   entrega_result(
     function (result){
     res.send(result);
  // console.log(result);
       });
   
});



module.exports = asistDiasTrabRouter;