const Course    = require('../models/Course');
const shortid   = require('shortid');
const multipleUploadMiddleware = require("../../config/middleware/multipleUploadMiddleware");
const cloudinary = require('../../config/middleware/ModelCloudinary')

let debug = console.log.bind(console);
class multipleUploadController {

    /**
 * Created by trungquandev.com's author on 17/08/2019.
 * multipleUploadController.js
 */
    // [POST] / :slug / multipleUpload
    multipleUpload = async (req, res) => {
        try {
            // thực hiện upload
            await multipleUploadMiddleware(req, res);

            // Nếu upload thành công, không lỗi thì tất cả các file của bạn sẽ được lưu trong biến req.files
            debug(req.files);

            // Mình kiểm tra thêm một bước nữa, nếu như không có file nào được gửi lên thì trả về thông báo cho client
            if (req.files.length <= 0) {
                return res.send(`You must select at least 1 file or more.`);
            }

            // trả về cho người dùng cái thông báo đơn giản.
            // const files = req.files;
           
            let res_promises = req.files.map(file => new Promise((resolve, reject) => {
                cloudinary.uploadMultiple(file.path).then(function(result) {
                    resolve(result);
                })
            }))

            
            // Promise.all get imgas
            Promise.all(res_promises)
                .then(async(arrImg) => {
                    const course = new Course(req.body);
                    course.title = 'chapter of ' + req.params.slug
                    course.slug = req.params.slug + '-' + shortid();
                    course.chaptername = req.params.slug

                    //course.chapter = req.body.chapter.removeVnmese......

                    console.log('title: ' +  course.title);
                    console.log('chaptername: ' +  course.chaptername);
                    console.log('chapter: ' + req.body.chapter);

                    let Img = arrImg.map(img => { 
                        course.image.push({
                            url: img.url
                        });
                        console.log('url: ' + img.url);
                    })
                    course.save();
                    // arrImg chính là array mà chúng ta đã upload 
                    // các bạn có thể sử dụng arrImg để save vào database, hay hơn thì sử dụng mongodb
                    // console.log(arrImg)
                })
                .catch((error) => {
                    console.error('> Error>', error);
                })

           
            //res.json(files[1].path);
            // Loop through all the uploaded images and display them on frontend

            // for (index = 0, len = files.length; index < len; ++index) {
            //     result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
            // }
            // result += '<hr/><a href="./">Upload more images</a>';
            // res.send(result);
            // const course = new Course();
            // course.title = 'test'+ '-' + shortid.generate();
            // course.slug = 'test' + '-' + shortid.generate();
            // var done = 0;
            // for (index = 0, len = files.length; index < len; ++index) {
            //     done++;
            //     var img = fs.readFileSync(files[index].path);
            //     var encode_image = img.toString('base64');

            //     //   Define a JSONobject for the image attributes for saving to 
            //     course.image.push({
            //            number: index,
            //            name: files[index].originalname,
            //            data: Buffer.from(encode_image, 'base64'),
            //            contentType: files[index].mimetype
            //     })
            //     if (done == len) {
            //         course.save();
            //     }     
            // }

            //res.send(`Your files has been uploaded.`)
            res.status(201).redirect('/me/stored/truyen-tranh');
            
        } catch (error) {
            // Nếu có lỗi thì debug lỗi xem là gì ở đây
            debug(error);

            // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send(`Exceeds the number of files allowed to upload.`);
            }

            return res.send(`Error when trying upload many files: ${error}}`);
        }
    };

}

//export (SiteController) thì lát require nhận được nó
module.exports = new multipleUploadController();
