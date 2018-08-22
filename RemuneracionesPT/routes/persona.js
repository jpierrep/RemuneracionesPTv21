
'use strict'

var express=require('express');
var PerController=require('../controllers/persona');
var api=express.Router();
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/personas'})


api.get('/home',PerController.home);
api.get('/perSoft',PerController.getPersonalSoft);
api.get('/perAsist',PerController.getPersonalAsist);
//api.get('/perDiferencias',PerController.getDiferenciasPersonal);
//api.post('/generaProceso',md_upload,PerController.generaProcesoSueldo);
api.get('/generaProceso',PerController.generaProcesoSueldo);
api.post('/testGeneraProceso',md_upload,PerController.TESTgeneraProcesoSueldo);

module.exports=api;