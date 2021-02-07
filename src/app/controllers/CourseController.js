const Course  = require('../models/Course');
const shortid = require('shortid');
const cloudinary = require('../../config/middleware/ModelCloudinary')
//cái dấu { } này để import từng phần tử bên trong
const { singleMongooseToObject, multiMongooseToObject } = require('../../util/mongoose');
const   removeVietnameseTones                           = require('../../config/middleware/VnameseToEng');
class CourseController {

  // [GET] / courses / :slug
  showAllChapter(req, res, next) {
    Course.find({slug: req.params.slug})
    .select('title slug createdAt updatedAt description thumbnail chaptername chapter ')
    .then (page => {
      if(page) {
        Course.find({chaptername: req.params.slug})
        .select('title slug createdAt updatedAt description thumbnail chaptername chapter')
        .then(courses => {  
          if (courses) {
            // gộp array courses(chứa chapter) vào array page(chứa truyện)
            // gán lại kết quả vào courses
            courses = page.concat(courses); 
            res.status(200).render('courses/showAllChapter', { courses: multiMongooseToObject(courses) })
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
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }

   // [GET] / courses / :slug / :chapter-x
  showSingleChapter(req, res, next) {
    //req.params.slug VD: courses/abc 
    //findOne: tìm đến 1 field trong mongodb ở đây là field slug
    //  courses/nodejs
    Course.findOne({ $and: [ { chaptername: req.params.slug },{ chapter: req.params.chapter }]})
      .then(course => {
        //res.json(course)
        if (course) {
        res.status(200).render('courses/showSingleChapter', { course: singleMongooseToObject(course) })
      
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

   // [GET] / courses / upload || render trang upload
   renderUpload(req, res, next) {
    res.status(200).render('courses/upload');
  }

  // [POST] / courses / createTruyen || post dữ liệu lên stored:đăng khóa học
  // post dữ liệu lên mongodb, ở me / stored / courses thì render ra 
  createTruyen(req, res, next) {
    //req.body: là tài nguyên form người dùng nhập vào
    //lấy thumbnail ảnh qua video id youtube

    //req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
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
          res.status(201).redirect('/me/stored/truyen-tranh');
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
          res.status(201).redirect('/me/stored/truyen-tranh');
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

  
   // [GET] / courses / :slug / uploadChapter
   //{$or: [{"chaptername": req.params.slug}, {"slug": req.params.slug}]
   uploadChapter(req, res, next) {
     Promise.all([Course.find({ $or: [{ "chaptername": req.params.slug }, { "slug": req.params.slug }] })
       , Course.countDocuments({ chapter: { $exists: true } })])
       //.select('title slug createdAt updatedAt description thumbnail chaptername chapter')
       .then(([courses, countedChapter]) => {
         //res.json( courses)
         if (courses) {
           res.status(200).render('courses/uploadChapter', {
             countedChapter,
             courses: multiMongooseToObject(courses)
           })
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

   // [GET] / courses / :slug / edit
  edit(req, res, next) {
    //lấy dữ liệu để vào edit (Course này là biến trong model)
    Course.findOne({ slug: req.params.slug })
      .then(courseEdit => res.status(200).render('courses/editTruyenTranh', {
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
    // //update thumbnail
    // req.body.thumbnail = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
    //update lấy course id, chỉnh sửa reg.body
    // tìm tất cả chapter truyện lưu vào biến để lát thay đổi hêt các chaptername
    var newtitle = req.body.title; 
    var oldSlug = req.params.slug;
    var newSlug = removeVietnameseTones(newtitle) 
    Course.find({ chaptername: req.params.slug })
    .select("chaptername chapter")
    .then(
      Course.findOne({ slug: req.params.slug }, function(err, page) {
        if (newtitle !== page.title) {

          // TH1: slug hiện tại:khoa-hoc-dinh-cap, muốn chỉnh tên lại: khoa-hoc-dinh, TH này thay tên slug cũ = slug mới
          // TH2: đã có slug này trong mongodb: khoa-hoc-dinh-cap || slug hiện tại:khoa-hoc-dinh, muốn chỉnh tên lại: khoa-hoc-dinh-cap (trùng tên slug), TH này +shortid
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
              Course.updateMany({ chaptername: oldSlug }, {chaptername: req.body.slug})
              .select("chaptername")
              .then(result => {
                  console.log(result)
              })
              Course.updateOne({ slug: req.params.slug }, req.body)
                .then(() => {
                  res.status(200).redirect('/me/stored/truyen-tranh');
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
              Course.updateMany({ chaptername: oldSlug }, {chaptername: newSlug})
              .select("chaptername")
              .then(result => {
                  console.log(result)
              })
              Course.updateOne({ slug: req.params.slug }, req.body)
                .then(() => {
                  res.status(200).redirect('/me/stored/truyen-tranh');
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
          Course.updateOne({ slug: req.params.slug }, req.body)
          .then(() => {
            res.status(200).redirect('/me/stored/truyen-tranh');
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
        }
      })
    )
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
    Course.restore({ slug: req.params.slug })
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

  // [DELETE] / courses / :slug 
  async destroy(req, res, next) {
    // dùng delete của plugin sofl delete
    await Course.findOne({ slug: req.params.slug }, function(err, page) {
      // Xem page có chưa chaptername ko: 
      // - nếu có nghĩa là delete chapter: delete thêm cả ảnh trên databse
      //res.json(page.chaptername)
      if (page.chaptername) {
        let res_promises =  page.image.map(image => new Promise((resolve, reject) => {
          let imagePublicId = image.publicId
          //res.json(imagePublicId)
          cloudinary.deleteMultiple(imagePublicId).then(function (result) {
            resolve(result);
          });
          Course.deleteOne({ slug: req.params.slug })
            .then(() => {
              res.status(200).redirect('back');
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }))
      }
      else {
        Course.delete({ slug: req.params.slug })
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
    })
  }

  // [DELETE] / courses / /force /:slug 
  forceDestroy(req, res, next) {
    // - nếu không nghĩa là force delete truyen: delete binh thường
    Course.deleteOne({ slug: req.params.slug })
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
    //res.json(req.body)
    switch (req.body.action) {
      case 'delete':
        //reg.body.courseIds là mảng[ ]
        Course.delete({ slug: { $in: req.body.chapterSlug } })
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
