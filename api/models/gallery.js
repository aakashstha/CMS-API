const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imageId: { type: Number, required: true, unique: true },
    imagePath: { type: String, required: true }
})

module.exports = mongoose.model('Gallery', gallerySchema);