'use strict'
//app js lleva toda la configuracion de express
var express=require('express');
var bodyParser=require('body-parser');

var app=express();
  
  //cargar rutas
  var user_routes=require('./routes/persona');
  var per_asist_routes=require('./routes/persona_asistencias');
  var reliquidaciones_routes=require('./routes/reliquidaciones');

  var parameter_routes=require('./routes/parametros_pago');
  var VarSoft=require('./routes/variables_softland');
  //var follow_routes=require('./routes/follow');

  //middelware metodo que se ejecuta antes de llegar a un controlador
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json()); // transforma los datos de la peticion a json

  //cors
  //rutas
  //use es un middelware se ejecuta antes de llegar a la accion del controlador en cada peticion que realice 

app.use('/api',user_routes);
app.use('/api/parameters',parameter_routes);
app.use('/api/asistencias',per_asist_routes);
app.use('/reliquida',reliquidaciones_routes);
app.use('/varSoft',VarSoft);

//app.use('/api',follow_routes);


 // app.post('/',(req,res)=>{
 //   res.status(200).send({
 //       message:'Accion de prueba node js'
        
 //   })
 //   console.log(req.body);
 //    });
  
 
 //exportar configuracion

  module.exports=app;