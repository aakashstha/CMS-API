const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    courseId: { type: Number, required: true, unique: true },
    courseAcronym: { type: String, required: true },
    courseFullForm: { type: String, required: true },
    availability: { type: Boolean, required: true }
})

module.exports = mongoose.model('Course', courseSchema);