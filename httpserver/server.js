const http = require("http");

const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        res.end("Home");
    }
    else if(req.url=="/about"){
        //res.write("About")
        //res.end()
        res.end("About");
    }
    else{
        res.writeHead(404,{"Content-type" : "text/html"});
        res.end("Page doesn't exist");
    }
});
server.listen(8000,'127.0.0.1', ()=>{
    console.log('listening to port');
})