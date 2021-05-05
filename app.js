if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
console.log(process.env.secret);
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const joi = require('joi');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');
// const {campgroundSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/asyncerrors');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const user = require('./models/user');
const newuser = require('./routes/register');
const dbUrl = process.env.DB_URL
// 'mongodb://localhost/yeti-Camp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:true
});

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
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create(
    {
        mongoUrl:dbUrl,
        touchAfter: 24 * 3600 
    }
)

const sessionoptions = {
    store,
    secret: 'secretkey',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+86400*7,
        maxAge:86400*7
    }
}
app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
    console.log(req.session);
    res.locals.success = req.flash('success');
    res.locals.currentuser = req.user;
    next()
})


app.use('/',newuser);
app.use('/campground', campgrounds);
app.use('/campground/:id/reviews', reviews);

app.get('/', (req,res)=>
{
    res.render("home");
})

app.all('*',(req,res,next) =>
{
    next(new ExpressError('page not found',404));
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
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