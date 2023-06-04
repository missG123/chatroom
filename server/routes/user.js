// 引入express模块
const express = require('express');
// 定义路由级中间件
const router = express.Router();
// 引入数据模型模块
const user = require('../Mongo/user');
// token验证
const jwt = require('jsonwebtoken')

// 登录
router.post('/login', (req, res) => {
    console.log(req.body);
    user.findOne(req.body).sort({ update_at: -1 }).then((u) => {
        // console.log(u);
        if (u != null) {
            const payload = {
                number: u.number
            }
            const secret = 'chatroom'
            const token = jwt.sign(payload, secret, { 'expiresIn': '24days' })
            res.json({ token, code: 200, message: '登录成功' });
        } else (
            res.json({ code: 200, message: 'number或密码有误' })
        )

    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
});
// 查询用户信息
router.get('/getUser', (req, res) => {
    let ver = jwt.verify(req.headers.token, 'chatroom')
    user.findOne({ number: ver.number }).then((u) => {
        if (u != null) {
            let { number, name, imgUrl, friends, _id } = u
            res.json({ number, name, imgUrl, friends, _id });
        } else {
            res.json(new Error({ message: '找不到该用户' }));
        }
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
})
// 注册
router.post('/register', (req, res) => {
    console.log(req.body);
    user.create(req.body).then((u) => {
        res.json('success')
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
});
// 用户是否已存在
router.get('/getHasUser', (req, res) => {
    user.findOne({ number: req.query.number }).then((u) => {
        if (u != null) {
            res.json({ code: 0, message: '用户已存在' });
        } else {
            res.json({ code: 1, message: '请注册' });
        }
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
})
// 特定条件的用户
router.get('/searchUser', (req, res) => {
    console.log('789', req.query.require)
    if (req.query.require == '') {
        res.json([])
    } else {
        let regexp = new RegExp(req.query.require, 'i')
        user.find({ $or: [{ number: { $regex: regexp } }, { name: { $regex: regexp } }] }).then((u) => {
            if (u != null) {
                console.log(u)
                res.json(u)
            } else {
                res.json('用户不存在')
            }
        }).catch((err) => {
            console.log(2);
            res.json(err);
        })
    }
})
// 添加朋友
router.post('/addFriend', (req, res) => {
    user.updateOne({ number: req.body.my }, { $push: { friends: req.body.friendInfo } }).then((u) => {
        res.json('success')
    }).catch((err) => {
        console.log(2);
        res.json(err);
    })
    // user.updateOne({ number: req.body.friendInfo.number }, { $push: { friends: req.body.my } }).then((u) => {
    //     res.json('success')
    // }).catch((err) => {
    //     console.log(2);
    //     res.json(err);
    // })
})

module.exports = router;