const express = require('express');

const authenticateuser = (req,res,next) => {
    if (req.isAuthenticated()){
         next();
    }
    else{
        req.session.backto = req.originalUrl;
        req.flash('success','Please login first to see the content !')
        res.redirect('/login')
    }
      
}
module.exports = authenticateuser;

// const authenticateuser = (req,res,next) => {
//     if (!req.isAuthenticated()){
//         req.flash('success','Please login first to see the content !');
//         res.redirect('/login');
//     }
//     else
//         next();
// }