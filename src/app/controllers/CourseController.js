const Course = require('../models/Course');
const imageSchema = require('../models/imageSchema');
const fs = require('fs')


//cái dấu { } này để import từng phần tử bên trong
const { singleMongooseToObject, multiMongooseToObject } = require('../../util/mongoose');

class CourseController {

  // [GET] / courses / :slug
  show(req, res, next) {
    //req.params.slug VD: courses/abc 
    //findOne: tìm đến 1 field trong mongodb ở đây là field slug
    //  courses/nodejs
    Course.findOne({ slug: req.params.slug })
      .then(course => {
        if (course) {
          res.status(200).render('courses/show', { course: singleMongooseToObject(course) })
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }

  // [GET] / courses / create || render trang đăng khóa học
  renderCreate(req, res, next) {
    res.status(200).render('courses/create');
   
  }

  // [POST] / courses / store || post dữ liệu lên stored:đăng khóa học
  // post dữ liệu lên mongodb, ở me / stored / courses thì render ra 
  store(req, res, next) {
    //req.body: là tài nguyên form người dùng nhập vào
    //lấy thumbnail ảnh qua video id youtube

    req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    //gán tài nguyên khóa học đơn này vào biến course mới rồi save lại
    const course = new Course(req.body);
    course.save()
      //save xong rồi redirect qua trang chủ
      .then(() => {
        res.redirect('/me/stored/courses');
        res.status(201);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };


  // [GET] / courses / renderUpload || lấy dữ liệu do khách tạo
  renderUpload(req, res, next) {
    imageSchema.find()
      .then(foundImage => res.render('courses/render-upload', {
        foundImage: multiMongooseToObject(foundImage)
      },
        res.status(200)))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };




  // [POST] / courses / upload || lưu ảnh vào mongodb
  uploadphotos(req, res) {
    upload(req, res, (err) => {
      if (!req.file) return res.send('Please upload a file');
      var img = fs.readFileSync(req.file.path);
      var encode_image = img.toString('base64');
      // Define a JSONobject for the image attributes for saving to database

      var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
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
      },
        res.status(200)))
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
  //Phương thức [PUT]:để chỉnh sửa nhưng chưa hỗ trợ nên sử dụng [PUT]
  //sẽ bị chuyển thành [GET] nên h phải dùng middleware setup bên file index.js
  // [GET] / courses / :id 
  update(req, res, next) {
    //update thumbnail
    req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    //update lấy course id, chỉnh sửa reg.body
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        res.redirect('/me/stored/courses');
        res.status(200);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  // [DELETE] / courses / :id 
  destroy(req, res, next) {
    // dùng delete của plugin sofl delete
    Course.delete({ _id: req.params.id })
      // back: quay trở lại trang trước đó
      .then(() => {
        res.redirect('back');
        res.status(200);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  // [PATCH] / courses / :id 
  // (phương thức HOẠT ĐỘNG là khi bấm nút khôi phục hãy submit form 
  // với route:[PATCH] / courses / :id)
  restore(req, res, next) {
    Course.restore({ _id: req.params.id })
      .then(() => {
        res.redirect('back');
        res.status(200);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  // [DELETE] / courses / :id / force
  forceDestroy(req, res, next) {
    Course.deleteOne({ _id: req.params.id })
      .then(() => {
        res.redirect('back');
        res.status(200);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  // /[]POST] / courses / handle-form-action
  handleFormAction(req, res, next) {
    // res.json(req.body)
    switch (req.body.action) {
      case 'delete':
        //reg.body.courseIds là mảng[ ]
        Course.delete({ _id: { $in: req.body.courseIds } })
          .then(() => {
            res.redirect('back');
            res.status(200);
          })
          .catch(next)
        break;
      default:
        res.json({ message: 'action is invalid' })
    }
  }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new CourseController();
