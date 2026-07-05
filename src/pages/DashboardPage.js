import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';

function DashboardPage() {
  const { user, isEmployer } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salaryRange: '',
    jobType: 'FULL_TIME',
  });

  // Redirect if not employer
  useEffect(() => {
    if (!isEmployer) {
      navigate('/jobs');
    }
  }, [isEmployer, navigate]);

  // Load jobs on page open
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      // Filter only jobs posted by this employer
      const myJobs = data.filter(
        job => job.postedByEmail === user?.email
      );
      setJobs(myJobs);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        company: '',
        location: '',
        salaryRange: '',
        jobType: 'FULL_TIME',
      });
      loadJobs();
    } catch (err) {
      setError('Failed to create job. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id);
        loadJobs();
      } catch (err) {
        setError('Failed to delete job.');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Employer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome, {user?.email}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Post Job Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Post a New Job
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Java Developer"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. ING Luxembourg"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Luxembourg City"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range (optional)
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g. 80,000 - 100,000 EUR"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, requirements, and responsibilities..."
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
              Post Job
            </button>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Posted Jobs ({jobs.length})
      </h2>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No jobs posted yet.</p>
          <p className="mt-2">Click "Post New Job" to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <div className="flex gap-4 text-gray-500 text-sm mt-1">
                    <span>🏢 {job.company}</span>
                    <span>📍 {job.location}</span>
                    {job.salaryRange && (
                      <span>💰 {job.salaryRange}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                      {job.jobType.replace('_', ' ')}
                    </span>
                    <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;