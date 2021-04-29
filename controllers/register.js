const user = require('../models/user');
const passport = require('passport');

module.exports.registerpage =async(req,res) => {
    res.render('users/register');
}
module.exports.registernewuser = async(req,res) => {
    
    const {email,username,password} = req.body;
    const User = new user({email,username});
    const registereduser = await user.register(User,password);
    req.login(registereduser,() => {
        req.flash('success','Welcome to YetiCamp')
        res.redirect('/campground');
    })
}
module.exports.loginpage = async(req,res) => {
    res.render('users/login');
}
module.exports.loginuser = function(req,res){
    req.flash('success','Successfully logged in!');
    const returnto = req.session.backto || '/campground'
    delete req.session.backto;
    res.redirect(returnto);
}
module.exports.logout = (req,res) => {
    req.logOut();
    req.flash('success','Bye Bye see you soon!');
    res.redirect('/campground');
}