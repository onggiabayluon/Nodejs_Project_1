const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/meController');

//đang ở trong route: /courses/:slug
//:slug là route kế tiếp /news/details

router.get('/stored/manga/:slug', meController.storedAllChapter);
router.get('/stored/manga', meController.storedTruyenTranhs);
// --terminated-- router.get('/trash/truyen-tranh/:slug', meController.trashChapters);
// --terminated-- router.get('/trash/truyen-tranh', meController.trashTruyenTranhs);



module.exports = router;