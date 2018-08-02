var express = require('express');
const rrhhRouter = require('./routes/rrhhRouter');
const asistDiasTrabRouter = require('./routes/asistDiasTrabRouter');
var app = express();

app.use('/rrhhRouter',rrhhRouter)
app.use('/asistDiasTrab',asistDiasTrabRouter)

var server = app.listen(5000, function () {
    console.log('Server is running..');
});