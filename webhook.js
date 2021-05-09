const HTTP = require('http')
const server = HTTP.createServer((req, res) => {
  console.log(req.method, req.url);
  if(req.method == 'POST' && req.url == '/webhook'){
    res.setHeaders('Content-Type', 'application/json');
    res.end(JSON.stringify({ok:true}));
  }else{
    res.end('Not Found');
  }
})
server.listen(4000,()=>{
  console.log('webhook服务器启动成功，port：4000');
})