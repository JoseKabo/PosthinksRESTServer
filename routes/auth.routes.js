const { Router } = require('express');
const { signinPOST, signupPOST } = require('../controllers/auth.controller');

const router = Router();

router.post('/signin', signinPOST);
router.post('/signup', signupPOST);

module.exports = router;