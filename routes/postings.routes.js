const { Router } = require('express');
const { newPostingPOST } = require('../controllers/postings.controller');

const router = Router();

router.post('/newPosting', newPostingPOST);

module.exports = router;