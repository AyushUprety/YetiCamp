const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const joi = require('joi');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
// const {campgroundSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/asyncerrors');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');


mongoose.connect('mongodb://localhost/yeti-Camp', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!"); 
});

app.engine('ejs', ejsmate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.get('/', (req,res)=>
{
    res.render("home");
})
// app.get('/makecampground',async (req,res) => {
//     const Camp = new Campground({
//         title: "horrah!"
//     });
//     await Camp.save();
//     res.send(Camp);
// })

app.get('/campground', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.post('/campground', catchAsync(async(req,res,next) => {
    //if(! req.body.title) throw new ExpressError('Invalid Campground data', 404);
      
        const campground = new Campground(req.body)
        await campground.save();
        res.render('campgrounds/show', {campground})
    
}))
app.get('/campground/new', ((req,res) => {
    res.render('campgrounds/new')
}))

app.get('/campground/:id', catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}))
app.get('/campground/:id/edit', catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
app.put('/campground/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campground/${campground._id}`)
}));
app.delete('/campground/:id', catchAsync(async (req,res) =>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
}))
app.post('/campground/:id/reviews', async(req,res) => 
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground.id}`)
})
app.delete('/campground/:id/reviews/:reviewid', async(req,res) => {
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/campground/${id}`)
})
app.all('*',(req,res,next) =>
{
    next(new ExpressError('page not found',404));
})

app.listen(3000, ()=>
{
    console.log("serving on port 3000");
})
app.use(function(err,req,res,next){
    const {statusCode= 500} = err;
    if(!err.message) err.message="oh no something went wrong !";
    res.status(statusCode).render("error", {err});
})

// campgroundSchema.post('findOneAndDelete', async function(doc){
//     if(doc){
//         await Review.remove({
//             id:{
//                 $in:doc.reviews
//             }
//         })
//     }
// })