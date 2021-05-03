const express = require('express');
const router = express.Router({mergeparams:true});
const passport = require('passport');
const Campground = require('../models/campground');
const catchAsync = require('../utils/asyncerrors');
const authenticateuser = require('../middleware');
const camp = require('../controllers/campground');
const multer = require('multer');
const {storage} = require('../cloudinary/');
const { array } = require('joi');
var upload = multer({storage});

// app.get('/makecampground',async (req,res) => {
//     const Camp = new Campground({
//         title: "horrah!"
//     });
//     await Camp.save();
//     res.send(Camp);
// })

router.route('/')
    .get(camp.index)
    .post(upload.array("image"),authenticateuser,catchAsync(camp.addnewcamp))
    // .post(upload.array("image"),(req,res)=> {
    //     console.log(req.body,req.files);
    //     res.send(req.body);
    // })
   
router.get('/new',authenticateuser,camp.newcamppage);

router.route('/:id')
    .get(authenticateuser, catchAsync(camp.showpage))
    .put(authenticateuser,upload.array('image'), catchAsync(camp.updatecamp))
    .delete(authenticateuser, catchAsync(camp.deletecamp))
router.get('/:id/edit',authenticateuser, catchAsync(camp.edit))


module.exports= router;