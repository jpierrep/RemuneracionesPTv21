
'use strict'

var express=require('express');
var PerController=require('../controllers/persona');
var api=express.Router();


api.get('/home',PerController.home);
api.get('/perSoft',PerController.getPersonalSoft);
api.get('/perAsist',PerController.getPersonalAsist);
api.get('/perDiferencias',PerController.getDiferenciasPersonal);

module.exports=api;