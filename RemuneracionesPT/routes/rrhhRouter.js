const express = require('express');
const bodyParser = require('body-parser');
const rrhhRouter = express.Router();
rrhhRouter.use(bodyParser.json());

rrhhRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res)=> {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'targit',
        password: 'targit2015*',
        server: '192.168.100.14', 
        database: 'Inteligencias' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select 1 as hola', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});

module.exports = rrhhRouter;