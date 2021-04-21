const express = require('express');
const passport = require('passport');
const router = express.Router();
const user = require('../models/user');
const catchAsync = require('../utils/asyncerrors');

router.get('/register', async(req,res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async(req,res) => {
    
        const {email,username,password} = req.body;
        const User = new user({email,username});
        const registereduser = await user.register(User,password);
        req.flash('success','Welcome to YetiCamp')
        res.redirect('/campground');
}))
router.get('/login', catchAsync(async(req,res) => {
    res.render('users/login');
}))
router.post('/login', passport.authenticate('local',{failureRedirect:'/login', failureFlash: true}), function(req,res){
    req.flash('success','Successfully logged in!');
    res.redirect('/campground');
})
router.get('/logout', (req,res) => {
    req.logOut();
    req.flash('success','Bye Bye see you soon!')
    res.redirect('/campground');
})
module.exports = router;