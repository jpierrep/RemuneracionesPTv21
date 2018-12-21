
'use strict'

var express=require('express');
var VarSoftController=require('../controllers/variables_softland');
var api=express.Router();



//api.get('/leeArchivoReliq',md_upload,ReliqController.getFileReliquida);
api.post('/creaPlantilla',VarSoftController.CreaPlantilla);
api.get('/getPlantillas',VarSoftController.getPlantillas);
api.get('/getPlantillaVarsOne/:plantilla_id',VarSoftController.getPlantillaVariablesOne);




module.exports=api;