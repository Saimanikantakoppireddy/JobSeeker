import React, { useEffect, useState } from 'react';

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null,
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('resume', formData.resume);

    try {
      const res = await fetch('http://localhost:5000/api/jobseeker', {
        method: 'POST',
        body: payload,
      });
      const result = await res.json();
      alert('Profile submitted!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Portal</h1>

      {/* Job Listings */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Available Jobs</h2>
        <ul className="space-y-4">
          {jobs.map(job => (
            <li key={job._id} className="p-4 bg-white rounded shadow">
              <h3 className="text-xl font-medium">{job.title}</h3>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Job Seeker Form */}
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Submit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="resume"
            className="w-full"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
