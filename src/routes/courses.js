const express = require('express');
const router = express.Router();


const courseController = require('../app/controllers/CourseController');
const UploadController  = require('../app/controllers/UploadController');

//đang ở trong route: /courses/:slug
//:slug là route kế tiếp /news/details

router.get('/create', courseController.renderCreate);
//them
router.post('/createTruyen', courseController.createTruyen);
//
router.post('/handle-form-action', courseController.handleFormAction);

router.get('/:slug/uploadChapter', courseController.uploadChapter);
//upload ảnh
router.get('/upload', courseController.renderUpload);
router.post('/:slug/multiple-upload', UploadController.multipleUpload);
router.post('/:slug/single-upload', UploadController.singleUpload);
//[PUT]: chỉnh sửa lên chính cái id 
router.get('/:slug/edit', courseController.edit);
router.put('/:slug', courseController.update);
//sửa_restore
router.patch('/:slug/restore', courseController.restore);
//xoa
router.delete('/force/:slug', courseController.forceDestroy);
router.delete('/:slug', courseController.destroy);

//
router.get('/:slug', courseController.showAllChapter);
router.get('/:slug/:chapter', courseController.showSingleChapter);
//router.get('/:slug', courseController.showSingleChapter);


module.exports = router;
