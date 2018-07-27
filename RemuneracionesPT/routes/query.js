exports.list = function(req, res){

    req.getConnection(function(err,connection){   
        var query = connection.query('select 1 as hola',function(err,rows){
          if(err)
            console.log("Error Selecting : %s ",err );
  
          //res.render('testtable',{page_title:"Test Table",data:rows});
          console.log(res)
        });
    });
  };