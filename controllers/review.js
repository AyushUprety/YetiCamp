const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req,res) => 
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    console.log(review);
    
    review.author = req.user.id;
    campground.reviews.push(review);
    console.log(campground);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground.id}`)
}

module.exports.deleteReview = async(req,res) => {
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/campground/${id}`)
}