const Campground = require('../models/campground');

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}
module.exports.addnewcamp = async(req,res,next) => {
    const campground = new Campground(req.body);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user.id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${campground._id}`)
}
module.exports.newcamppage = (req,res) => {
    res.render('campgrounds/new');
}
module.exports.showpage = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show', {campground});
}
module.exports.edit = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user.id)){
        req.flash('success','oops you donot have permission to do that')
}

    res.render('campgrounds/edit',{campground});
}
module.exports.updatecamp = async(req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if(!campgrounds.author.equals(req.user.id)){
        req.flash('success','you donot have permission to do that!');
        return res.redirect(`/campground/${id}`)
    }
    else{
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
        const Image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.images.push(...Image);
        await campground.save();
        req.flash('success','Campground is successfully updated')
        res.redirect(`/campground/${campground.id}`)
    }
  
}
module.exports.deletecamp = async (req,res) =>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground is deleted successfully')
    res.redirect('/campground')
}