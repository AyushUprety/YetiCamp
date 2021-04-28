const express = require('express');
const passport = require('passport');
const router = express.Router();
const user = require('../models/user');
const catchAsync = require('../utils/asyncerrors');
const register = require('../controllers/register')

router.get('/register',register.registerpage )
router.post('/register', catchAsync(register.registernewuser))
      
router.get('/login', catchAsync(register.loginpage))
router.post('/login', passport.authenticate('local',{failureRedirect:'/login', failureFlash: true}),register.loginuser)
router.get('/logout', register.logout)
module.exports = router;