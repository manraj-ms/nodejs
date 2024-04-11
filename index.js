const fs = require("fs");
fs.writeFileSync('read.txt',"file created using core module \n");
fs.writeFileSync('read.txt',"file created using core module 2 \n");
fs.appendFileSync('read.txt', "appended text");

console.log('hello');

const data = fs.readFileSync('read.txt', "utf-8")
//const data = fs.readFile('read.txt',(error,data)=>{
    // console.log(data);
// })
console.log(data);

// original_data = data.toString();
// console.log(original_data);

fs.renameSync('read.txt','newread.txt');

// os.totalmem .freemem .arch 
// path.dirname .extname .basename(filename) .path(All)
//module.exports=req;//module.exports.req1 = req1
//require("path") //req1.req1 (normal can be used if const{ } is used on import file)
//can use same destructuring in module.exports as well


