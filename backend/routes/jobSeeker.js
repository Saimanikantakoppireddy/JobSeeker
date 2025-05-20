const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JobSeeker = require('../models/JobSeeker');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Register Job Seeker
router.post('/register', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address, passOutYear, workType } = req.body;
        
        // Check if user already exists
        let jobSeeker = await JobSeeker.findOne({ email });
        if (jobSeeker) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new job seeker
        jobSeeker = new JobSeeker({
            name,
            email,
            password: hashedPassword,
            resume: req.file.path,
            phoneNumber,
            address,
            passOutYear,
            workType
        });

        await jobSeeker.save();

        // Create JWT token
        const token = jwt.sign(
            { id: jobSeeker._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Job Seeker
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const jobSeeker = await JobSeeker.findOne({ email });
        if (!jobSeeker) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, jobSeeker.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: jobSeeker._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 