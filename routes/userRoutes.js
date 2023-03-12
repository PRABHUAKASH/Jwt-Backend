const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//signup module with the post method
router.post('/signup', userController.signup);
//Login module with the post method
router.post('/login', userController.login);
//Get the all users using Get routing method
router.get('/user', userController.verifyToken, userController.getUser);

module.exports = router;
