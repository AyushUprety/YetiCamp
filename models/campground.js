const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')

const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Campground',CampgroundSchema);