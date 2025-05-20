import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/jobs', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setJobs(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch jobs');
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Application submitted successfully!');
        } catch (err) {
            alert('Failed to submit application');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="job-seeker-dashboard">
            <h2>Available Jobs</h2>
            <div className="jobs-grid">
                {jobs.map(job => (
                    <div key={job._id} className="job-card">
                        <h3>{job.title}</h3>
                        <p className="company">{job.company}</p>
                        <p className="location">{job.location}</p>
                        <p className="type">{job.type}</p>
                        <p className="description">{job.description}</p>
                        <div className="job-details">
                            <span className="salary">${job.salary}</span>
                            <span className="experience">{job.experience} years</span>
                        </div>
                        <button 
                            onClick={() => handleApply(job._id)}
                            className="apply-button"
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobSeekerDashboard; 