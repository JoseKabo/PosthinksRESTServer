const { Router } = require('express');
const { getAllPostGET } = require('../controllers/home.controller');

const router = Router();

router.get('/getAllPosts', getAllPostGET);

module.exports = router;