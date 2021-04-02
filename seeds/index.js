const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers');
const { lookupService } = require('dns');
mongoose.connect('mongodb://localhost/yeti-Camp', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!"); 
});

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,'views'))

const sample = array => array[Math.floor(Math.random()*array.length)];


const seeddb = async() =>
{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++)
    {
        let randomPlace = Math.floor(Math.random()*1000);
        let randomprize = Math.floor(Math.random()*5000)+5000;
        const Camp = new Campground({
            location: `${cities[randomPlace].city}, ${cities[randomPlace].state}` ,
            title:`${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description: 'Laboris ipsum et officia nulla sint ut ad ea qui enim nisi voluptate. Ex culpa labore quis anim sint laborum reprehenderit nostrud proident duis nisi. Ea quis ut in amet elit ex fugiat nisi. Non aliquip consectetur consequat incididunt eiusmod id ut aliqua deserunt nisi Lorem eiusmod cillum culpa. Deserunt fugiat magna do nisi. Sunt in anim culpa esse consectetur laborum. Minim excepteur deserunt reprehenderit id aliquip id.',
            price:randomprize
    })
        await Camp.save();
    }
}
seeddb();