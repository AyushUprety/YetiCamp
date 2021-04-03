const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')
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

app.get('/campground',async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.post('/campground', async(req,res) => {
    const campground = new Campground({
        title:req.body.title,
        location:req.body.location,
        image:req.body.image,
        price:req.body.price,
        description:req.body.description
    })
    await campground.save();
    res.render('campgrounds/show', {campground})
})
app.get('/campground/new', (req,res) => {
    res.render('campgrounds/new')
})

app.get('/campground/:id', async (req,res) => {
    console.log(req.params.id);
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}) 
app.get('/campground/:id/edit', async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
})
app.put('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campground/${campground._id}`)
});
app.delete('/campground/:id', async (req,res) =>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
})

app.listen(3000, ()=>
{
    console.log("serving on port 3000");
})