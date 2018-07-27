var express = require('express');
const rrhhRouter = require('./routes/rrhhRouter');
var app = express();

app.use('/rrhhRouter',rrhhRouter)

var server = app.listen(5000, function () {
    console.log('Server is running..');
});