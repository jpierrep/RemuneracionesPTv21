'use strict'




var async= require('async');

var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');

const schema = {
    'NOMBRE': {
      prop: 'NOMBRE',
      type: String
      // Excel stores dates as integers.
      // E.g. '24/03/2018' === 43183.
      // Such dates are parsed to UTC+0 timezone with time 12:00 .
    }}


async function generaReliquidacionUpdload(req,res){
  
    //obtiene parametros para el pago de sueldo
   let parametrosPago= await getParametrosPago();
    console.log(parametrosPago);
    console.log("dentro genera proceso")
  
    let optionProcess={fecha:JSON.parse(req.body.fecha),proceso:JSON.parse(req.body.proceso)}
    console.log(optionProcess);
  
    
  
    await uploadFile(req,res);
    let persAsist= await TESTgetPersonalAsist();
    //res.status(200).send(persAsist);
    let persAgrupa=await getAgrupaPers(persAsist);
   // console.log(persAgrupa);
  
    let persRRHH=await getPersonalSoft();
   
    let persDiff=await getPersonalBD(persAgrupa,persRRHH);   
    //res.status(200).send(persDiff);
    let persVar=await getVariablesSueldoPers(optionProcess,persDiff,parametrosPago);
  
   let persCalcula=await getCalculaSueldo(optionProcess,persVar,parametrosPago);  
   
    res.status(200).send(persCalcula);
    
  }


  function getFileReliquida (req,res){
   // return new Promise(resolve=>{
      //readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
      readXlsxFile('uploads/reliquidaciones/reliqucmpc.xlsx',).then((rows) => {
     //let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
    
      //result=JSON.parse(result);
      //resolve(result);
      console.log(rows[0].length)
      let cantAtributos=rows[0].length;
      let atributosHeader=rows[0];

     //transforma un arreglo multidimensional en json
     
    let nuevo= rows.map(fila=>{
      
    var jsonRow=fila.reduce((json, value, key)=>{
        //atributosHeader[key] = es el nombre q tiene el registro
        //value = el valor que tiene
        
        
        json[atributosHeader[key]]=value;

        return json; }, {}
    );

      
    return jsonRow;
     
   }); 
   //quitmaos el indice 0 del arreglo para no duplicarlo (pues trae el nombre de todas las keys)
   nuevo.splice(0,1);


      res.status(200).send(nuevo);
    





    }); 
    //});
  
  }

  module.exports={getFileReliquida}

   