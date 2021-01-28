const express = require('express');
const router = express.Router();

const Sitecontroller = require('../app/controllers/SiteController');

router.get('/search', Sitecontroller.search);

//HOME
router.get('/', Sitecontroller.index);

module.exports = router;
