
'use strict'

var express=require('express');
var SoftlandController=require('../controllers/softland');
var api=express.Router();





api.get('/getVariableMes/:empresa/:fecha/:variable',SoftlandController.getVariableMes);
api.get('/getVariablesPersonaMes/:empresa/:fecha/:ficha/:variable?',SoftlandController.getVariablesPersona);


module.exports=api;