
'use strict'

var express=require('express');
var Parametros_pago=require('../controllers/parametros_pago');
var api=express.Router();



api.get('/home',Parametros_pago.home);
api.get('/getAll',Parametros_pago.getAllParameters);
api.post('/updateParam',Parametros_pago.updateParameter);


module.exports=api;