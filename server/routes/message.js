const express = require('express')
const router = express.Router()
const message = require('../Mongo/message')
const fs = require('fs');
const path = require('path')
const multer = require('multer');
const mammoth = require('mammoth')
// const { json } = require('body-parser');
// let upload = multer({ dest: './upload' })

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, file.originalname);
    }
});


let createFolder = function (folder) {
    try {
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    } catch (e) {
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

let uploadFolder = 'uploads/';
createFolder(uploadFolder);

let upload = multer({ storage: storage });

// 获得聊天记录
router.get('/getMessage', (req, res) => {
    message.find({ $or: [{ from: req.query.from, to: req.query.to }, { from: req.query.to, to: req.query.from }] }).then((u) => {
        if (u != null) {
            res.json(u);
        } else {
            res.json(new Error({ message: '找不到该信息' }));
        }
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
})
router.post('/saveMessage', upload.single('upfile'), (req, res, next) => {
    console.log('file', req.files)
    console.log('formdata', req.body)
    let data = { ...req.body };
    if (req.file) {
        data = {
            from: req.body.from,
            to: req.body.to,
            sendTime: req.body.sendTime,
            chatType: req.body.chatType,
            extend: { fileType: req.body.fileType },
            content: JSON.parse(req.body.content)
        }
    }
    console.log(data)
    message.create(data).then((u) => {
        console.log('插入成功')
        res.json('success')
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
})
// 获得某个文件
router.get('/getFileInfo', (req, res) => {
    let url = uploadFolder + req.query.fileName;
    let tail = path.extname(req.query.fileName);
    let str = '';
    if (tail == '.txt') {
        let readStream = fs.createReadStream(url);
        readStream.setEncoding('utf-8');
        readStream.on('data', function (val) {
            str += val;
        });
        readStream.on('end', function () {
            res.json(str);
        });
        readStream.on('error', function (err) {
            console.log(err.stack)
        });
    } else if (tail == '.docx') {
        let p = path.join(process.cwd(), url)
        mammoth.extractRawText({ path: p })
            .then(function (result) {
                var text = result.value; // The raw text 
                console.log(text);
                res.json(text);
            }).done();
    } else if (tail == '.wav') {
        let readStream = fs.createReadStream(url);
        // readStream.setEncoding('base64');
        let chunks = []
        readStream.on('data', function (val) {
            chunks.push(val)
        });
        readStream.on('end', function () {
            let bf = Buffer.concat(chunks).toString('base64')
            let src = 'data:audio/wav;base64,' + bf
            res.json(src);
        });
        readStream.on('error', function (err) {
            console.log(err.stack)
        });
    }
    else {
        res.json('暂不支持该文件格式')
    }

})
module.exports = router;