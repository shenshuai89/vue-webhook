const HTTP = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')
const SECRET = '123456'
function sign(body){
  return `sha1=`+crypto.createHmac('sha1',SECRET).update(body).digest('hex')
}
const server = HTTP.createServer((req, res) => {
  console.log(req.method, req.url);
  if(req.method == 'POST' && req.url == '/webhook'){
    // 监听github hook返回的数据
    let buffers = []
    req.on('data',(buffer) =>{
      buffers.push(buffer)
    })
    req.on('end',() =>{
      let body = Buffer.concat(buffers);
      // 判断event：push
      let event = req.headers['x-github-event']; 
      // github请求来的时候，要传递请求体body，另外在传一个signature
      let signature = req.headers['x-hub-signature'];
      if(signature !== sign(body)){
        return res.end('Not Allowed');
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ok:true}));
      if(event == 'push'){
        let payload = JSON.parse(body);
        console.log("执行的文件名", payload.repository.name);
        let child = spawn('sh',[` ./${payload.repository.name}.sh`])
        let bfs = [];
        child.stdout.on('data',(buffer)=>{
          bfs.push(buffer);
        })
        child.stdout.on('end',(buffer) =>{
          let log = Buffer.concat(bfs);
          console.log(log);
        })
      }
    })
  }else{
    res.end('Not Found');
  }
})
server.listen(4000,()=>{
  console.log('webhook服务器启动成功，port：4000');
})