const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// Get all jobs
router.get('/', auth, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply for a job
router.post('/:jobId/apply', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already applied for this job' });
        }

        job.applicants.push(req.user.id);
        await job.save();

        res.json({ message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 