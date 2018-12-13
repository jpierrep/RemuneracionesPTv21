'use strict'




var async= require('async');

var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');
//uso de ficheros
var fs=require('fs');
//rutas de ficheros
var path=require('path');

var sql = require("mssql");
var ExcelFilename;
var moment = require('moment');
var PerController=require('../controllers/persona');

// config for your database
var config = {
    user: 'targit',
    password: 'targit2015*',
    server: '192.168.100.14', 
    database: 'Inteligencias' 
};


function getPersonalAsist(){
    return new Promise(resolve=>{
      readXlsxFile('testPT.xlsx',{schema}).then((rows) => {
     // readXlsxFile('uploads/personas/'+ExcelFilename,{schema}).then((rows) => {
     let result= JSON.stringify(rows.rows); //la consulta trae un campo rows y uno errors, por eso enviamos el rows
      convierteRutID("17.933.157-8"); 
      result=JSON.parse(result);
      resolve(result);
      }); 
    });
  
  }

  async function consolidaInfo(req,res ){
   let turnosAsist=await getTurnosAsistencias();
   let personalAsist=await getPersonalAsistencias();
   
   let personalSofland=await PerController.getPersonalSoft();


  turnosAsist.forEach((turno)=>{
      
    let persAsistEncontrar= personalAsist.find(x=>x.Id_dDetalle==turno.DET_FUNC);
    let persReemplazoEncontrar=[];
    if(personalAsist.REEMPLAZO){
      persReemplazoEncontrar=personalAsist.find(x=>x.Id_dDetalle==turno.REEMPLAZO);
    }
    turno.PERSONAL_REEMPLAZO=persReemplazoEncontrar;
    turno.PERSONAL=persAsistEncontrar

  });

   personalAsist.forEach((pers)=>{
     if (pers.PersonalRut)
    pers.RUT_ID=PerController.convierteRutID(pers.PersonalRut);
    else
     pers.RUT_ID=0;
   
    });

     
   


  return   res.status(200).send(turnosAsist); 

   /*let turnosAsist=turnosAsist.map(value=>{

    let turnos= personalAsist.filter(x=>convierteRutID(x.RUT)==value).map(element=>{
     return {NOMBRE:element.NOMBRE,RUT:element.RUT,TIPO:element.TIPO, DIA:moment(element.DIA).format("DD/MM/YYYY"),CANTIDAD_HRS:element.CANTIDAD_HRS};
   
    
    }); */







  }


  async function consolidaInfo2(req,res ){
    let turnosAsist=await getTurnosAsistencias2();
    let personalAsist=await getPersonalAsistencias();
    
   // let personalSofland=await PerController.getPersonalSoft();
 
 
   turnosAsist.forEach((turno)=>{
       
     let persAsistEncontrar= personalAsist.find(x=>x.Id_Detalle==turno.IdPersonal);
  
     turno.PERSONAL=persAsistEncontrar;
 
   });
 
    personalAsist.forEach((pers)=>{
      if (pers.PersonalRut)
     pers.RUT_ID=PerController.convierteRutID(pers.PersonalRut);
     else
      pers.RUT_ID=0;
    
     });
 
      
    
 
 
   return   res.status(200).send(turnosAsist); 
 
    /*let turnosAsist=turnosAsist.map(value=>{
 
     let turnos= personalAsist.filter(x=>convierteRutID(x.RUT)==value).map(element=>{
      return {NOMBRE:element.NOMBRE,RUT:element.RUT,TIPO:element.TIPO, DIA:moment(element.DIA).format("DD/MM/YYYY"),CANTIDAD_HRS:element.CANTIDAD_HRS};
    
     
     }); */
 
 
 
 
 
 
 
   }






  
  function getTurnosAsistencias2(req,res){

      //extrae la info del mes actual, pues no se puede pagar en relacion a meses pasados
    let  query=`select case when REEMPLAZO is null then detfunc else reemplazo end as IdPersonal, count(*) as CantidadTurnos
    from Turnos2.dbo.Asistencia  as asist left join 
 Turnos2.dbo.Detalle_Funcionarios  as detfunc on asist.IdDetalle=detfunc.Id_Detalle
 left join Turnos2.dbo.Planilla AS Planilla ON  detfunc.PLANILLA = Planilla.ID_PL left join
  Turnos2.dbo.CentroCosto AS CentroCosto ON PLANILLA.AREA_CCTO = CentroCosto.Id_Centro
  LEFT JOIN   Inteligencias.dbo.CENTROS_COSTO AS mant_cc ON mant_cc.EMP_CODI = CentroCosto.Empresa AND 
                          mant_cc.CENCO2_CODI COLLATE SQL_Latin1_General_CP1_CI_AS = CentroCosto.Codigo LEFT OUTER JOIN
                          Inteligencias.dbo.EMPRESAS AS EMPRESAS ON EMPRESAS.EMP_CODI = CentroCosto.Empresa 
 
 
 where   (detfunc.DF_Contrato  <=DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, asist.FECHA_ASIST) + 1, 0)) and detfunc.DF_Finiquito>= DATEADD(mm, DATEDIFF(mm,0,asist.FECHA_ASIST), 0) )  
  and month(FECHA_ASIST)=12 and year(fecha_asist)=2018
 and CENCO1_DESC = 'PODER JUDICIAL JURISDICCION VALPARAISO' 
and (motivo is null or (not MOTIVO>0))

group by case when REEMPLAZO is null then detfunc else reemplazo end  `
    
     //query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[RRHH_PERSONAL_SOFT] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
     //on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V'and FECHA_SOFT='2018-08-01'` 

     return new Promise(resolve=>{
    entrega_resultDB(query,null).then(result=>{
        if (result.length>0){ 
         console.log(result.length);
         console.log("hay result");
       
         //return   res.status(200).send(result);
         resolve(result);
           // console.log(value);
           
       }else{ console.log("no hay");
       
      
      }
       
       });
  
      });


  }

  


  function getTurnosAsistencias(req,res){


    //extrae la info del mes actual, pues no se puede pagar en relacion a meses pasados
    let  query=`select  
    [ID_ASIST], asist.[FECHA_ASIST], asist.[MOTIVO], asist.[DETFUNC], asist.[TURNO], asist.[REEMPLAZO], asist.[HH_FESTIVAS], asist.[HH_EXT], asist.[TIPO_REEMP], asist.[Paquete], asist.[Centro], asist.[PlanillaRol], asist.[Tiempo], asist.[Observacion] as ObservacionAsist, asist.[OrigenHora], asist.[asistencia], asist.[cerrar], asist.[HorasExtrasDia], asist.[HorasExtrasSemana], asist.[HorasExtrasFestivas], asist.[MesCerrado], asist.[DiasCerrado], asist.[DomingoCerrado], asist.[IdDetalle], asist.[IdCausal], asist.[Cumplido], asist.[InHabilitado]
    --,[ID_DETFUNC], detfunc.[PLANILLA], detfunc.[FICHA], detfunc.[CICLO], detfunc.[RELEVO], detfunc.[Grupo], detfunc.[Colacion], detfunc.[Horas], detfunc.[Maximo], detfunc.[Id_Detalle], detfunc.[Rol], detfunc.[AsignaHoras], detfunc.[AsignaPesos], detfunc.[RepiteHoras], detfunc.[RepitePesos], detfunc.[CadaHoras], detfunc.[CadaPesos], detfunc.[MesHoras], detfunc.[MesPesos], detfunc.[AñoHoras], detfunc.[AñoPesos], detfunc.[Movilizacion], detfunc.[DF_Contrato], detfunc.[DF_Finiquito], detfunc.[Calendario], detfunc.[IdPersona], detfunc.[DF_Activo], detfunc.[RepiteMovilizacion], detfunc.[CadaMovilizacion], detfunc.[MesMovilizacion], detfunc.[AñoMovilizacion], detfunc.[FechaCreacionIngreso]   
    ,[ID_PL]
	-- Planilla.[Administra], Planilla.[Pl_Grupo], Planilla.[FECHA], Planilla.[FECHA_TERMINO], Planilla.[FONO], Planilla.[CALENDARIO], Planilla.[AREA_CCTO], Planilla.[OBSERVACION] as ObservacionPlanilla, Planilla.[USUARIO_CREA], Planilla.[FECHA_CREA], Planilla.[USUARIO_MOD], Planilla.[FECHA_MOD], Planilla.[VIGENTE], Planilla.[NUMERO_GUARDIAS], Planilla.[HorasPaquete], Planilla.[Empresa], Planilla.[SubTitulo], Planilla.[Rubro], Planilla.[HorDiaLun], Planilla.[HorDiaMar], Planilla.[HorDiaMie], Planilla.[HorDiaJue], Planilla.[HorDiaVie], Planilla.[HorDiaSab], Planilla.[HorDiaDom], Planilla.[Cotizacion]   
    ,mant_cc.*   
        from Turnos2.dbo.Asistencia  as asist left join 
        Turnos2.dbo.Detalle_Funcionarios  as detfunc on asist.IdDetalle=detfunc.Id_Detalle
        left join Turnos2.dbo.Planilla AS Planilla ON  detfunc.PLANILLA = Planilla.ID_PL left join
         Turnos2.dbo.CentroCosto AS CentroCosto ON PLANILLA.AREA_CCTO = CentroCosto.Id_Centro
         LEFT JOIN   Inteligencias.dbo.CENTROS_COSTO AS mant_cc ON mant_cc.EMP_CODI = CentroCosto.Empresa AND 
                                 mant_cc.CENCO2_CODI COLLATE SQL_Latin1_General_CP1_CI_AS = CentroCosto.Codigo LEFT OUTER JOIN
                                 Inteligencias.dbo.EMPRESAS AS EMPRESAS ON EMPRESAS.EMP_CODI = CentroCosto.Empresa 
        
        
        where   (detfunc.DF_Contrato  <=DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, asist.FECHA_ASIST) + 1, 0)) and detfunc.DF_Finiquito>= DATEADD(mm, DATEDIFF(mm,0,asist.FECHA_ASIST), 0) )  
         and month(FECHA_ASIST)=11 and year(fecha_asist)=2018
        and CENCO1_DESC = 'PODER JUDICIAL JURISDICCION VALPARAISO'  `
    
     //query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[RRHH_PERSONAL_SOFT] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
     //on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V'and FECHA_SOFT='2018-08-01'` 

     return new Promise(resolve=>{
    entrega_resultDB(query,null).then(result=>{
        if (result.length>0){ 
         console.log(result.length);
         console.log("hay result");
       
         //return   res.status(200).send(result);
         resolve(result);
           // console.log(value);
           
       }else{ console.log("no hay");
       
      
      }
       
       });
  
      });
  
  }


  function getPersonalAsistencias(req,res){

    //extrae la info del mes actual, pues no se puede pagar en relacion a meses pasados
    let  query=`SELECT      case when (Detalle_Funcionarios.IdPersona<0)then 'RELEVO' else  Personal.Nombre end AS PersonalNombre, case when (Detalle_Funcionarios.IdPersona<0)then 'RELEVO' else  Personal.Rut end  AS PersonalRut, 
    CAST(CentroCosto.Empresa AS int) 
   AS CentroCostoEmpresa, substring(CentroCosto.Codigo,1,8) AS CentroCostoCodigo, CentroCosto.Descripcion AS CentroCostoDesc, 
   Detalle_Funcionarios.FICHA AS DetalleFuncFicha, Detalle_Funcionarios.Colacion AS DetalleFuncColacion, Detalle_Funcionarios.Horas AS DetalleFuncHorasTipo, 
   Detalle_Funcionarios.ID_DETFUNC AS DetalleFuncIdFunc, Detalle_Funcionarios.PLANILLA AS DetalleFuncIdPlanilla, Planilla.FONO AS PlanillaFono, 
   Planilla.OBSERVACION AS PlanillaObserv,PLANILLA.SubTitulo, Planilla.NUMERO_GUARDIAS AS PlanillaNumGuardias, Planilla.VIGENTE AS PlanillaVigente
, Planilla.CALENDARIO, CALEND.DESC_CAL, CentroCosto.Empresa, 
   MANTENEDOR_CC_AREA.AREA_DESC, MANTENEDOR_CC_AREA.AREA_CODI, EMPRESAS.EMP_DESC,'' as 'SUPERVISOR'

    , CentroCosto.Id_Centro as 'CentroCostoId_Centro'
    ,Detalle_Funcionarios.IdPersona,Detalle_Funcionarios.Id_Detalle
    ,case when (Detalle_Funcionarios.PLANILLA<0) then 'GUARDIA PART-TIME' when (Detalle_Funcionarios.IdPersona<0)then 'RELEVO' when (CentroCosto.Descripcion like '%RELEV%') then 'RELEVO VACACIONES' else 'GUARDIA TURNO' end as 'PERSONAL_TIPO'
    , case when Detalle_Funcionarios.DF_Activo=1 then 'SI' else 'NO' end  as DetalleFuncActivo
    ,CONVERT(varchar,Detalle_Funcionarios.DF_Contrato,103) as DetalleFuncContrato,CONVERT(varchar,Detalle_Funcionarios.DF_Finiquito,103) as DetalleFuncFiniquito
    ,convert(date,Detalle_Funcionarios.FechaCreacionIngreso) as FechaCreacionIngreso
  
FROM            Turnos2.dbo.Personas AS Personal right JOIN
Turnos2.dbo.Detalle_Funcionarios AS Detalle_Funcionarios ON Personal.IdPersona = Detalle_Funcionarios.IdPersona left JOIN
Turnos2.dbo.Planilla AS Planilla ON  Detalle_Funcionarios.PLANILLA = Planilla.ID_PL left join
Turnos2.dbo.CentroCosto AS CentroCosto ON PLANILLA.AREA_CCTO = CentroCosto.Id_Centro left JOIN
Turnos2.dbo.CALENDARIO AS CALEND ON Planilla.CALENDARIO = CALEND.ID_CAL LEFT OUTER JOIN
   Inteligencias.dbo.MANTENEDOR_CC_AREA AS MANTENEDOR_CC_AREA ON MANTENEDOR_CC_AREA.EMP_CODI = CentroCosto.Empresa AND 
   MANTENEDOR_CC_AREA.CENCO2_CODI COLLATE SQL_Latin1_General_CP1_CI_AS = CentroCosto.Codigo LEFT OUTER JOIN
   Inteligencias.dbo.EMPRESAS AS EMPRESAS ON EMPRESAS.EMP_CODI = CentroCosto.Empresa  `
    
     //query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[RRHH_PERSONAL_SOFT] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
     //on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V'and FECHA_SOFT='2018-08-01'` 
     return new Promise(resolve=>{

    entrega_resultDB(query,null).then(result=>{
        if (result.length>0){ 
         console.log(result.length);
         console.log("hay result");
       
         resolve(result);
         //return   res.status(200).send(result);
           // console.log(value);
           
       }else{ console.log("no hay");
       
      
      }
       
       });
  
      });
  
  }


  function entrega_resultDB(queryDB, callback){
    return new Promise(resolve=>{ 
    // const fruit = request.params.parame;
  
      // connect to your database
     sql.connect(config).then((pool)=>{
       return pool.request().query(queryDB)
     }).then(result=>{
      resolve(result);
  
      }).catch(err=>{
       console.log(err);
     })
  
  
     }); 
  
  
  
  }


   
  function getTurnosPersona(req,res){

    //extrae los turnos realizados por una persona durante un año
  let  query=`select  
  [ID_ASIST], asist.[FECHA_ASIST], asist.[MOTIVO], asist.[DETFUNC], asist.[TURNO], asist.[REEMPLAZO], asist.[HH_FESTIVAS], asist.[HH_EXT], asist.[TIPO_REEMP], asist.[Paquete], asist.[Centro], asist.[PlanillaRol], asist.[Tiempo], asist.[Observacion] as ObservacionAsist, asist.[OrigenHora], asist.[asistencia], asist.[cerrar], asist.[HorasExtrasDia], asist.[HorasExtrasSemana], asist.[HorasExtrasFestivas], asist.[MesCerrado], asist.[DiasCerrado], asist.[DomingoCerrado], asist.[IdDetalle], asist.[IdCausal], asist.[Cumplido], asist.[InHabilitado]
  --,[ID_DETFUNC], detfunc.[PLANILLA], detfunc.[FICHA], detfunc.[CICLO], detfunc.[RELEVO], detfunc.[Grupo], detfunc.[Colacion], detfunc.[Horas], detfunc.[Maximo], detfunc.[Id_Detalle], detfunc.[Rol], detfunc.[AsignaHoras], detfunc.[AsignaPesos], detfunc.[RepiteHoras], detfunc.[RepitePesos], detfunc.[CadaHoras], detfunc.[CadaPesos], detfunc.[MesHoras], detfunc.[MesPesos], detfunc.[AñoHoras], detfunc.[AñoPesos], detfunc.[Movilizacion], detfunc.[DF_Contrato], detfunc.[DF_Finiquito], detfunc.[Calendario], detfunc.[IdPersona], detfunc.[DF_Activo], detfunc.[RepiteMovilizacion], detfunc.[CadaMovilizacion], detfunc.[MesMovilizacion], detfunc.[AñoMovilizacion], detfunc.[FechaCreacionIngreso]   
  ,[ID_PL]

-- Planilla.[Administra], Planilla.[Pl_Grupo], Planilla.[FECHA], Planilla.[FECHA_TERMINO], Planilla.[FONO], Planilla.[CALENDARIO], Planilla.[AREA_CCTO], Planilla.[OBSERVACION] as ObservacionPlanilla, Planilla.[USUARIO_CREA], Planilla.[FECHA_CREA], Planilla.[USUARIO_MOD], Planilla.[FECHA_MOD], Planilla.[VIGENTE], Planilla.[NUMERO_GUARDIAS], Planilla.[HorasPaquete], Planilla.[Empresa], Planilla.[SubTitulo], Planilla.[Rubro], Planilla.[HorDiaLun], Planilla.[HorDiaMar], Planilla.[HorDiaMie], Planilla.[HorDiaJue], Planilla.[HorDiaVie], Planilla.[HorDiaSab], Planilla.[HorDiaDom], Planilla.[Cotizacion]   
  ,mant_cc.*  
,turnos_desc.CODIGO_TURNO,turnos_desc.DESCRIPCION_TURNO,turnos_desc.HH_COLACION,turnos_desc.DESDE,turnos_desc.HASTA 
      from Turnos2.dbo.Asistencia  as asist left join 
      Turnos2.dbo.Detalle_Funcionarios  as detfunc on asist.IdDetalle=detfunc.Id_Detalle
      left join Turnos2.dbo.Planilla AS Planilla ON  detfunc.PLANILLA = Planilla.ID_PL left join
       Turnos2.dbo.CentroCosto AS CentroCosto ON PLANILLA.AREA_CCTO = CentroCosto.Id_Centro
   left join Turnos2.dbo.Turnos as turnos_desc
   on turnos_desc.ID_TURNO=asist.TURNO
       LEFT JOIN   Inteligencias.dbo.CENTROS_COSTO AS mant_cc ON mant_cc.EMP_CODI = CentroCosto.Empresa AND 
                               mant_cc.CENCO2_CODI COLLATE SQL_Latin1_General_CP1_CI_AS = CentroCosto.Codigo LEFT OUTER JOIN
                               Inteligencias.dbo.EMPRESAS AS EMPRESAS ON EMPRESAS.EMP_CODI = CentroCosto.Empresa 
      
      
      where   (detfunc.DF_Contrato  <=DATEADD(d, -1, DATEADD(m, DATEDIFF(m, 0, asist.FECHA_ASIST) + 1, 0)) and detfunc.DF_Finiquito>= DATEADD(mm, DATEDIFF(mm,0,asist.FECHA_ASIST), 0) )  
       --and month(FECHA_ASIST)=11 
   and year(fecha_asist)=2018
      and CENCO1_DESC = 'PODER JUDICIAL JURISDICCION VALPARAISO' and (case when REEMPLAZO is null then detfunc else reemplazo end)='21326' and (motivo is null or not MOTIVO>0)`
  
   //query=`SELECT FICHA,NOMBRES,RUT,RUT_ID,DIRECCION,FECHA_INGRESO,FECHA_FINIQUITO,ESTADO,CARGO_DESC,CARGO_CODI,ult.CENCO2_CODI,cc.CENCO2_DESC,cc.CENCO1_DESC  FROM [Inteligencias].[dbo].[RRHH_PERSONAL_SOFT] as ult left join Inteligencias.dbo.CENTROS_COSTO as cc
   //on cc.EMP_CODI=ult.EMP_CODI and cc.CENCO2_CODI=ult.CENCO2_CODI collate SQL_Latin1_General_CP1_CI_AI  where Estado='V'and FECHA_SOFT='2018-08-01'` 

  
  entrega_resultDB(query,null).then(result=>{
      if (result.length>0){ 
       console.log(result.length);
       console.log("hay result");
     
       return   res.status(200).send(result);
       //resolve(result);
         // console.log(value);
         
     }else{ console.log("no hay");
    
    }
     });

   


}
  
  
  module.exports={getPersonalAsistencias,getTurnosAsistencias,consolidaInfo,consolidaInfo2,getTurnosPersona}

   
     
