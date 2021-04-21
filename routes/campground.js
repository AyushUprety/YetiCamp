const express = require('express');
const router = express.Router({mergeparams:true});
const passport = require('passport');
const Campground = require('../models/campground');
const catchAsync = require('../utils/asyncerrors');
const authenticateuser = require('../middleware');



// app.get('/makecampground',async (req,res) => {
//     const Camp = new Campground({
//         title: "horrah!"
//     });
//     await Camp.save();
//     res.send(Camp);
// })

router.get('/', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

router.post('/',authenticateuser,catchAsync(async(req,res,next) => {
        if(! req.body.title) throw new ExpressError('Invalid Campground data', 404);
        const campground = new Campground(req.body)
        await campground.save();
        req.flash('success','Campground is created successfully!')
        res.redirect(`/campground/${campground.id}`)
    
}))
router.get('/new',authenticateuser,((req,res) => {
        res.render('campgrounds/new');
}))

router.get('/:id',authenticateuser, catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))
router.get('/:id/edit',authenticateuser, catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',authenticateuser, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    req.flash('success','Campground is successfully updated')
    res.redirect(`/campground/${campground._id}`)
}));
router.delete('/:id',authenticateuser, catchAsync(async (req,res) =>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground is deleted successfully')
    res.redirect('/campground')
}))

module.exports= router;