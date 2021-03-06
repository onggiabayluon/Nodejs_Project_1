const express = require('express');
const router = express.Router();
// var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });

const courseController = require('../app/controllers/CourseController');

//đang ở trong route: /courses/:slug
//:slug là route kế tiếp /news/details

router.get('/create', courseController.renderCreate);
router.get('/render-upload', courseController.renderUpload);
//them
router.post('/store', courseController.store);
//upload photos
router.post('/upload', courseController.uploadphotos);
//
router.post('/handle-form-action', courseController.handleFormAction);
router.get('/:id/edit', courseController.edit);
//[PUT]: chỉnh sửa lên chính cái id 
router.put('/:id', courseController.update);
//sửa_restore
router.patch('/:id/restore', courseController.restore);
//xoa
router.delete('/:id', courseController.destroy);
router.delete('/:id/force', courseController.forceDestroy);
router.get('/:slug', courseController.show);



module.exports = router;
