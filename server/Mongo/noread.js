
const mongoose = require('mongoose');
const noReadSchema = mongoose.Schema({
    from: String,
    to: String,
    content: String,
    sendTime: String
}, {
    collection: 'noread'
})
let noread = mongoose.model('noread', noReadSchema)
module.exports = noread;