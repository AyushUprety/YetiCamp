const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/asyncerrors');


router.post('/', catchAsync(async(req,res) => 
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground.id}`)
}))
router.delete('/:reviewid', catchAsync(async(req,res) => {
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/campground/${id}`)
}))

module.exports = router;