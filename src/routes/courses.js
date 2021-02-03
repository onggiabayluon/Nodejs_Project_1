const express = require('express');
const router = express.Router();


const courseController = require('../app/controllers/CourseController');
const multipleUploadController  = require('../app/controllers/multipleUploadController');

//đang ở trong route: /courses/:slug
//:slug là route kế tiếp /news/details

router.get('/create', courseController.renderCreate);
//them
router.post('/store', courseController.store);
//
router.post('/handle-form-action', courseController.handleFormAction);
router.get('/:id/edit', courseController.edit);
//upload ảnh
router.get('/upload', courseController.renderUpload);
router.post('/multiple-upload', multipleUploadController.multipleUpload);
//[PUT]: chỉnh sửa lên chính cái id 
router.put('/:id', courseController.update);
//sửa_restore
router.patch('/:id/restore', courseController.restore);
//xoa
router.delete('/:id', courseController.destroy);
router.delete('/:id/force', courseController.forceDestroy);
router.get('/:slug', courseController.show);



module.exports = router;
