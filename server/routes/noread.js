// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const noread = require('../Mongo/noread');

// 存储未读消息
router.post('/saveNoread', (req, res) => {
    console.log(req.body);
    noread.create(req.body).then((u) => {
        console.log('1111插入成功')
        res.json('success')
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
});
// 获取多个未读消息
router.get('/getNoread', (req, res) => {
    console.log('1111', req.query);
    noread.aggregate([{ '$match': { 'to': req.query.to } }, { '$group': { '_id': '$from', 'sum': { $sum: 1 } } }]).then((u) => {

        res.json(u)
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })
});
router.delete('/removeNoread', (req, res) => {
    noread.deleteMany(req.query).then(u => {
        res.json('success')
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
})
module.exports = router
