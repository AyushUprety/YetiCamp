const mongoose = require('mongoose');
const { schema } = require('./review');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')

const imageSchema = new Schema({
    url:String,
    filename:String
});
imageSchema.virtual('setThumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
const CampgroundSchema = new Schema({
    title:String,
    images:[imageSchema],
    geometry: {
        type: {
          type: String,
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
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