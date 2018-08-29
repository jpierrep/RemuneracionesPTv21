
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
api.post('/generaProcesoUpload',md_upload,PerController.generaProcesoSueldoUpdload);
api.get('/getArchivo',PerController.downoloadFIle);
api.get('/getPersona/:rut_id',PerController.getPersonalSoftOne);

module.exports=api;