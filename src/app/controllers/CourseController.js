const Course = require('../models/Course');
const shortid = require('shortid');
//cái dấu { } này để import từng phần tử bên trong
const { singleMongooseToObject, multiMongooseToObject } = require('../../util/mongoose');
const removeVietnameseTones = require('../../config/VnameseToEng');
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
        res.status(500).json({
          error: err
        });
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

  // [DELETE] / courses / :id 
  destroy(req, res, next) {
    // dùng delete của plugin sofl delete
    Course.delete({ _id: req.params.id })
      // back: quay trở lại trang trước đó
      .then(() => {
        res.status(200).redirect('back');
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
        res.status(200).redirect('back');
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
        res.status(200).redirect('back');
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  // /[POST] / courses / handle-form-action
  handleFormAction(req, res, next) {
    // res.json(req.body)
    switch (req.body.action) {
      case 'delete':
        //reg.body.courseIds là mảng[ ]
        Course.delete({ _id: { $in: req.body.courseIds } })
          .then(() => {
            res.status(200).redirect('back');
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
        break;
      default:
        res.json({ message: 'action is invalid' })
    }
  }
}

//export (SiteController) thì lát require nhận được nó
module.exports = new CourseController();
