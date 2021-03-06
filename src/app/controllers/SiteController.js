//Mô hình mvc: từ clients --> 1. request lên controller --> 2. chọc vào model
// --> 3. lấy được dữ liệu mang về controller --> 4. chọc sang views, lấy data
// từ model truyền sang views --> 5. views render trả về client



const Course = require('../models/Course');

//cái dấu { } này để import từng phần tử bên trong
const { multiMongooseToObject } =  require('../../util/mongoose');

class SiteController {
    // [GET] / Site
    index(req, res, next) {
       
        //render courses vao homepage
        //2.
        Course.find({})
        //3. 
        .then(courses => { //4.
            res.render('home', { 
                courses: multiMongooseToObject(courses)
             });
        })
        .catch(error => next(error));

    }

    // [GET] / search
    search(req, res) {
        res.render('search');
    }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new SiteController();
