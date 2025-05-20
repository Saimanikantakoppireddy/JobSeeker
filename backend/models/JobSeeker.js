const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resume: {
        type: String, // This will store the file path or URL
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    passOutYear: {
        type: Number,
        required: true
    },
    workType: {
        type: String,
        enum: ['internship', 'job'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobSeeker', jobSeekerSchema); 