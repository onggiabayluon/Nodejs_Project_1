const multer = require('multer');
//set storage engine
const storage = multer.diskStorage({
    destination: './src/public/img',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + Path.extname(file.originalname));
    }
});
module.exports = () => {
    upload = multer({
        storage: storage
    }).single('myImage');
};


