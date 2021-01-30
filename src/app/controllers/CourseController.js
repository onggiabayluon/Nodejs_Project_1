const Course = require('../models/Course');
<<<<<<< Updated upstream
const imageSchema = require('../models/imageSchema');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

//set storage engine
const storage = multer.diskStorage({
    destination: './src/public/img',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

/// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }



//cái dấu { } này để import từng phần tử bên trong
const { singleMongooseToObject, multiMongooseToObject } =  require('../../util/mongoose');

=======
const shortid = require('shortid');
//cái dấu { } này để import từng phần tử bên trong
const { singleMongooseToObject, multiMongooseToObject } = require('../../util/mongoose');
const removeVietnameseTones = require('../../config/VnameseToEng');
>>>>>>> Stashed changes
class CourseController {

    // [GET] / courses / :slug
    show(req, res, next) {

        //req.params.slug VD: courses/abc 
        //findOne: tìm đến 1 field trong mongodb ở đây là field slug
        //  courses/nodejs
        Course.findOne({ slug: req.params.slug })
        // render, tạo biến Course rồi truyền nó đi vào file show.js
        // đây là bước hiển thị từng course 
        .then(course => {
            res.render('courses/show', { course: singleMongooseToObject(course) })
        })
        .catch(next);
    }

<<<<<<< Updated upstream
    // [GET] / courses / create || lấy dữ liệu do khách tạo
    renderCreate(req, res, next) {
        res.render('courses/create');
    }

    // [POST] / courses / store || post dữ liệu lên stored:đăng khóa học
    // post dữ liệu lên mongodb, ở me / stored / courses thì render ra 
    store(req, res, next) {
        //req.body: là tài nguyên form người dùng nhập vào
        //lấy thumbnail ảnh qua video id youtube
=======
  // [POST] / courses / store || post dữ liệu lên stored:đăng khóa học
  // post dữ liệu lên mongodb, ở me / stored / courses thì render ra 
  store(req, res, next) {
    //req.body: là tài nguyên form người dùng nhập vào
    //lấy thumbnail ảnh qua video id youtube

    req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    //gán tài nguyên khóa học đơn này vào biến course mới rồi save lại
    //const course = new Course(req.body);
    //Chuyển title[tiếng việt] sang slug 
    var title = req.body.title;
    var slug = removeVietnameseTones(title)

    //tra cái slug này xem có cái page nào k
    Course.findOne({ slug: slug }, function(err, page) {
      if(page) {
        // TH nếu slug ĐÃ có
        console.log('slug existed, add shortId to create new slug');
        const course = new Course(req.body);
        course.slug = slug + '-' + shortid.generate();
        course.save()
        .then(() => {
          res.status(201).redirect('/me/stored/courses');
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
      else {
        // TH nếu slug CHƯA có
        const course = new Course(req.body);
        course.slug = slug;
        //save xong rồi redirect qua trang chủ
        course.save()
        .then(() => {
          res.status(201).redirect('/me/stored/courses');
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
    })
  };

  // [GET] / courses / :id / edit
  edit(req, res, next) {
    //lấy dữ liệu để vào edit (Course này là biến trong model)
    Course.findById(req.params.id)
      .then(courseEdit => res.status(200).render('courses/edit', {
        courseEdit: singleMongooseToObject(courseEdit)
      }))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
  //Phương thức [PUT]:để chỉnh sửa nhưng chưa hỗ trợ nên sử dụng [PUT]
  //sẽ bị chuyển thành [GET] nên h phải dùng middleware setup bên file index.js
  // [PUT] / courses / :id 
  update(req, res, next) {
    //update thumbnail
    req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    //update lấy course id, chỉnh sửa reg.body

    var newtitle = req.body.title; 
    var newSlug = removeVietnameseTones(newtitle) 
    Course.findById(req.params.id, function(err, page) {
      if (newtitle !== page.title) {
        // TH1: khoa-hoc-dinh-cap || khoa-hoc-dinh-cap-abc
        // TH2: khoa-hoc-dinh cap || khoa-hoc-dinh
        // Nếu title mới khác title cũ thì update lại luôn cả slug
        // check slug mới có trùng slug mongodb thì add shortId vào slug mới
        // newSlug = khoa-hoc-dinh-cao || page.slug = khoa-hoc-dinh

        Course.findOne({ slug: newSlug }, function(err, slugcheck) {
          // tra cái slug mới xem có slugcheck nào có chưa 
          // nếu slug mới mà có sử dụng r` thì slug cũ = slug mới + shortId
          if (slugcheck) {
            // res.json(slugcheck)
            // đổi slug cũ sang slug mới 
            req.body.slug = newSlug + '-' + shortid.generate();
            Course.updateOne({ _id: req.params.id }, req.body)
              .then(() => {
                res.status(200).redirect('/me/stored/courses');
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          } else {
            // nếu slug mới chưa có sử dụng thì slug cũ = slug mới
            req.body.slug = newSlug;
            Course.updateOne({ _id: req.params.id }, req.body)
              .then(() => {
                res.status(200).redirect('/me/stored/courses');
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      } else {
        // Nếu title mới giống title cũ thì update bình thường, không update slug
        Course.updateOne({ _id: req.params.id }, req.body)
        .then(() => {
          res.status(200).redirect('/me/stored/courses');
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
    });

  }
>>>>>>> Stashed changes

        req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        //gán tài nguyên khóa học đơn này vào biến course mới rồi save lại
       const course = new Course(req.body);
       course.save()
        //save xong rồi redirect qua trang chủ
        .then(() => res.redirect('/me/stored/courses'))
        .catch(error => {
        })
    }

    
    // [GET] / courses / renderUpload || lấy dữ liệu do khách tạo
    renderUpload(req, res, next) {
        imageSchema.find()
        .then(foundImage => res.render('courses/render-upload', { 
          foundImage: multiMongooseToObject(foundImage)
        }))
        .catch(next)
    };
  
     

    
    // [POST] / courses / upload || lưu ảnh vào mongodb
    uploadphotos(req, res) {
      upload(req, res, (err) =>  {
        if (!req.file) return res.send('Please upload a file');
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString('base64');
        // Define a JSONobject for the image attributes for saving to database

        var finalImg = {
          contentType: req.file.mimetype,
          image:  new Buffer(encode_image, 'base64')
        };

        imageSchema.create(finalImg, (err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Image uploaded');
                item.save();
                res.redirect('/courses/render-upload');
            }
        });
    })
  };

     // [GET] / courses / :id / edit
     edit(req, res, next) {
        //lấy dữ liệu để vào edit (Course này là biến trong model)
        Course.findById(req.params.id)
        .then(courseEdit => res.render('courses/edit', {
            courseEdit: singleMongooseToObject(courseEdit) 
        }))
        .catch(next)
    }
     //Phương thức [PUT]:để chỉnh sửa nhưng chưa hỗ trợ nên sử dụng [PUT]
     //sẽ bị chuyển thành [GET] nên h phải dùng middleware setup bên file index.js
     // [GET] / courses / :id 
     update(req, res, next) {
         //update thumbnail
         req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
         //update lấy course id, chỉnh sửa reg.body
        Course.updateOne({ _id: req.params.id }, req.body)
        .then(() => res.redirect('/me/stored/courses'))
        .catch(next)
     }

      // [DELETE] / courses / :id 
      destroy(req, res, next) {
        // dùng delete của plugin sofl delete
        Course.delete({ _id: req.params.id })
        // back: quay trở lại trang trước đó
        .then(() => res.redirect('back'))
        .catch(next)
      }

      // [PATCH] / courses / :id 
      // (phương thức HOẠT ĐỘNG là khi bấm nút khôi phục hãy submit form 
      // với route:[PATCH] / courses / :id)
      restore(req, res, next) {
        Course.restore({ _id: req.params.id })
        .then(() => res.redirect('back'))
        .catch(next)
      }

      // [DELETE] / courses / :id / force
      forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
        .then(() => res.redirect('back'))
        .catch(next)
      }

      // /[]POST] / courses / handle-form-action
      handleFormAction(req, res, next) {
        // res.json(req.body)
        switch(req.body.action)
        {
            case 'delete':
                //reg.body.courseIds là mảng[ ]
                Course.delete({ _id: { $in: req.body.courseIds } })
                .then(() => res.redirect('back'))
                .catch(next)
                break;
            default:
                res.json({message: 'action is invalid'})
        }         
      }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new CourseController();
