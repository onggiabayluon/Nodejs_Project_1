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

//
app.use(express.static(path.join(__dirname, 'public')));

//add cái này cho form (post) parse ra dạng kiểu dữ liệu cho console.log
app.use(express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());



// HTTP logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

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
            mySum: (a, b) =>  a + b,
            limit: (arr, limit) => {
                if (!Array.isArray(arr)) { return []; }
                return arr.slice(0, limit);
            },
            replaceHyphenIntoSpace: (str) => {
                str = str.toString().replace(/-/g, ' ');
                return  str;// replace '-' -> space 
               
            },
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
