// 引入mongoose模块
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    number: String,
    pwd: String,
    name: String,
    imgUrl: String,
    friends: Array
}, {
    collection: 'user'
})
let user = mongoose.model('user', userSchema);
module.exports = user;