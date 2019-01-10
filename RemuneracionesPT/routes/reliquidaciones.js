
'use strict'

var express=require('express');
var ReliqController=require('../controllers/reliquidaciones');
var api=express.Router();
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/reliquidaciones'});
var md_uploadpt=multipart({uploadDir:'./uploads/reliquidaciones/part-time'})




//api.get('/leeArchivoReliq',md_upload,ReliqController.getFileReliquida);
api.get('/generaProcesoReliquida',md_upload,ReliqController.generaReliquidacionUpdload);
api.get('/getRemuneracionesArchivo/:fecha?',ReliqController.getRemuneracionesMes);
api.get('/getFechasRemuneracionesArchivo/:fecha?',ReliqController.getFechasRemuneracArchivo);
//api.get('/generaProcesoReliquidaPartTime',md_upload,ReliqController.generaPartReliquidacionUpdload);
api.post('/generaProcesoReliquidaPartTime',md_uploadpt,ReliqController.generaPartReliquidacionUpdload);





module.exports=api;