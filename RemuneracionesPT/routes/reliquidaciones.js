
'use strict'

var express=require('express');
var ReliqController=require('../controllers/reliquidaciones');
var api=express.Router();
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/reliquidaciones'})



api.get('/leeArchivoReliq',md_upload,ReliqController.getFileReliquida);


module.exports=api;