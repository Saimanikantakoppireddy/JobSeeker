import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './JobSeekerRegister.css';

const JobSeekerRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        passOutYear: '',
        workType: 'job'
    });
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            formDataToSend.append('resume', resume);

            const response = await axios.post('http://localhost:5000/api/jobseeker/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/jobseeker/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="job-seeker-register">
            <h2>Job Seeker Registration</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Address:</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Pass Out Year:</label>
                    <input
                        type="number"
                        name="passOutYear"
                        value={formData.passOutYear}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Looking For:</label>
                    <select
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                        required
                    >
                        <option value="job">Job</option>
                        <option value="internship">Internship</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Resume:</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default JobSeekerRegister; 