
'use strict'

var express=require('express');
var PerController=require('../controllers/persona_asistencias');
var api=express.Router();




api.get('/turnosAsistencias',PerController.getTurnosAsistencias)
api.get('/perAsistencias',PerController.getPersonalAsistencias);
api.get('/consolidaInfo',PerController.consolidaInfo);
api.get('/consolidaInfo2',PerController.consolidaInfo2);
api.get('/turnosPersona',PerController.getTurnosPersona);


module.exports=api;