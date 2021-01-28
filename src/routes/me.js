const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/meController');

//đang ở trong route: /courses/:slug
//:slug là route kế tiếp /news/details

router.get('/stored/courses', meController.storedcourses);
router.get('/trash/courses', meController.trashcourses);


module.exports = router;