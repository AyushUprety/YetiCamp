const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/asyncerrors');
const reviews = require('../controllers/review')


router.post('/', catchAsync(reviews.createReview))
router.delete('/:reviewid', catchAsync(reviews.deleteReview))

module.exports = router;