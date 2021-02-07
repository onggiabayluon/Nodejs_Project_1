const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/meController');

//đang ở trong route: /courses/:slug
//:slug là route kế tiếp /news/details

router.get('/stored/truyen-tranh/:slug', meController.storedAllChapter);
router.get('/stored/truyen-tranh', meController.storedTruyenTranhs);
router.get('/trash/truyen-tranh/:slug', meController.trashChapters);
router.get('/trash/truyen-tranh', meController.trashTruyenTranhs);



module.exports = router;