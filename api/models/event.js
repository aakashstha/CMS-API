const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    eventId: { type: Number, required: true, unique: true },
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    date: { type: Date, required: true }
})

module.exports = mongoose.model('Event', eventSchema);