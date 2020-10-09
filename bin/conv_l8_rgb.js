/*
- create landsat file based on a given txt file

node conv_l8_rgb filename.txt outputdir

*/


//var txtfile = process.argv[2]; //value will be "filename"
//var outdir = process.argv[3]; //value will be "create or update"

var txtfile = 'C:/tmp/canada_l8.txt';
var outdir = 'C:/webs/node-todo/node-todo-master/data/l8/rgb';

var fs = require('fs');
var cp = require('child_process');
//var cprocess = cp.exec('l82rgb.exe', [txtfile, outdir] );

cp.execSync("C:/rsa/build64-2015/rsa/x64/Debug/l82rgb.exe C:/tmp/canada_l8.txt C:/webs/node-todo/node-todo-master/data/l8/rgb");

/*, function(err, data) {
        if(err) {
            console.log(err)
        } 
        else 
        console.log(data.toString());                       
    }); 
*/

console.log("running executable");
