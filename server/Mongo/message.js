
const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    from: String,
    to: String,
    content: mongoose.Schema.Types.Mixed,
    sendTime: String,
    chatType: Number,
    extend: Object,
}, {
    collection: 'chatMessage'
})
let message = mongoose.model('chatMessage', messageSchema)
module.exports = message;