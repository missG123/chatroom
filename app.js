// 引入express模块
const express = require('express');
// 引入mongoose
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

// 引入websocket
const WebSocketServer = require('ws').Server;


let conn = {}
let userNum = 0;
const wss = new WebSocketServer({ port: 8181 });


wss.on('connection', function (ws, req) {
    console.log('进入ws')
    let index = req.url.indexOf('=')
    let number = req.url.substring(index + 1);
    conn[number] = ws
    // 接收前端数据
    ws.on('message', function (e) {
        console.log('接收到数据')
        let resData = JSON.parse(e);
        console.log('aaaa', resData)
        broadcast(resData)
    })
    ws.on('close', function (e) {
        console.log('服务器连接关闭')
        for (let key in conn) {
            if (conn[key]._closeCode == 1001) {
                delete conn[key]
            }
        }
    })
    ws.on('error', function (e) {
        console.log('服务器端异常')
    })
    ws.on('open', function () {
        console.log('ws连接成功')
    })
})

function broadcast(obj) {

    let user = []
    user.push(obj.to)
    user.push(obj.from);
    if (user && user.length) {
        user.forEach(async item => {
            if (typeof conn[item] === 'undefined') {
                console.log(item + '---该用户离线');
                let readMess = {
                    from: obj.from,
                    to: obj.to,
                    sendTime: obj.sendTime,
                    content: ''
                }
                if (obj.chatType == 0) {
                    readMess.content = obj.content
                } else if (obj.chatType == 1) {
                    readMess.content = '[图片]'
                } else if (obj.chatType == 2) {
                    readMess.content = obj.content.name;
                }
                axios({
                    url: 'http://localhost:3000/api/noread/saveNoread',
                    method: 'POST',
                    data: readMess
                }).then((res) => {
                    console.log(res)
                })

            } else {
                console.log('发送', item)
                conn[item].send(JSON.stringify(obj))
            }
        })
    }
}




// 创建app对象
const app = express();

app.use(bodyParser.json({
}))
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(fileupload());
// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/chatroom', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongodb Connected'))
    .catch((err) => console.log(err));


// CORS设置跨域访问
app.all('*', (req, res, next) => {
    // 响应头的设置，我的后台支持跨域请求
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'appliction/json;charset=utf-8');


    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");


    next();
})

// 定义服务启动端口
app.listen(3000, () => {
    console.log('app listening on port 3000.')
})

// 引入定义的user路由并应用
const user = require('./server/routes/user');
const message = require('./server/routes/message');
const noread = require('./server/routes/noread');
const { default: axios } = require('axios');
// // 访问接口为http://localhost:3000/api/user
app.use('/api', user);
app.use('/api/message', message);
app.use('/api/noread', noread)
