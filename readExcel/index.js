var readXlsxFile=require ('read-excel-file/node');
var stringify = require('json-stringify');
readXlsxFile('testPT.xlsx').then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.
//console.log(rows)
console.log(JSON.stringify(rows))

})
