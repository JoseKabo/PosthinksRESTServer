const { Router } = require('express');
const { changeInfoPOST, changePassPOST, myPostsPOST, myBasicInfoPOST, mystadisticsPOST } = require('../controllers/profile.controller');

const router = Router();

router.post('/changeInfo', changeInfoPOST);
router.post('/changePass', changePassPOST);
router.post('/myposts', myPostsPOST);
router.post('/mybasicinfo', myBasicInfoPOST);
router.post('/mystadistics', mystadisticsPOST);

module.exports = router;