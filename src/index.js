
//
const multer = require('multer');
//
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
//Phương thức [PUT]:để chỉnh sửa nhưng chưa hỗ trợ nên sử dụng [PUT]
//sẽ bị chuyển thành [GET] nên h phải dùng middleware
const methodOverride = require('method-override');


const route = require('./routes');
const db = require('./config/db');

//connect to DB
db.connect();

const app = express();
const port = 3000;

// //set storage engine
// const storage = multer.diskStorage({
//     destination: './src/public/img',
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + Path.extname(file.originalname));
//     }
// });
//Init upload
// module.exports = () => {
//     upload = multer({
//         storage: storage
//     }).single('myImage');
// }
// app.post('/courses/upload', (req, res) => {
//     upload(req, res, (err) => {
//             if (err) {
//                 res.render('courses/upload', {
//                     msg: err
//                 });
//             } else {
//                 console.log(req.file);
//                 res.send('test');
//             }
//         });  
// })

//
app.use(express.static(path.join(__dirname, 'public')));

//add cái này cho form (post) parse ra dạng kiểu dữ liệu cho console.log
app.use(express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());



// HTTP logger
// app.use(morgan('combined'));

// method override
app.use (methodOverride('_method'));

//Template engine: express handlebars (add partial parts)
app.engine(
    'hbs',
    handlebars({
        //Đuôi mở rộng tự đặt//
        extname: '.hbs',
        //Hàm tự thêm vào nhờ express handlebars
        helpers: {
            mySum: (a, b) =>  a + b
        }
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views')); //__dirname/resources/views

//Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
