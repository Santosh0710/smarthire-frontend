import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load jobs when page opens
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500 text-lg">Loading jobs...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Browse Jobs
        </h1>
        <p className="text-gray-500 mt-2">
          {jobs.length} open positions in Luxembourg
        </p>
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No jobs available right now.</p>
          <p className="mt-2">Check back later!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all">

              {/* Job Title and Type */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h2>
                <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                  {job.jobType.replace('_', ' ')}
                </span>
              </div>

              {/* Company and Location */}
              <div className="flex gap-4 text-gray-500 text-sm mb-3">
                <span>🏢 {job.company}</span>
                <span>📍 {job.location}</span>
                {job.salaryRange && (
                  <span>💰 {job.salaryRange}</span>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-gray-600 text-sm line-clamp-2">
                {job.description}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  Posted by {job.postedByName}
                </span>
                <span className="text-blue-600 text-sm font-medium">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobsPage;