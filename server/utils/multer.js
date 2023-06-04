const multer = require('multer')
const storage = multer.diskStorage({
    // 文件存储目录
    destination(req, file, callback) {
        console.log(file, __dirname)
        callback(null, './uploads')
    },
    // 设置上传文件相关信息
    filename(req, file, callback) {
        // console.log(file)
        callback(null, file.fieldname)
    }

})
let upload = multer({ storage: storage });

module.exports = upload