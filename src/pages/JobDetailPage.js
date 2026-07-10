import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import { useAuth } from '../context/AuthContext';

function JobDetailPage() {
  // useParams reads the {id} from the URL
  // e.g. /jobs/1 → id = "1"
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (err) {
      setError('Job not found or no longer available.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // For now we just show a success message
    // In Phase 5 we will build real application tracking
    setApplied(true);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500 text-lg">Loading job details...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 text-blue-600 hover:underline">
          ← Back to Jobs
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Back Button */}
      <button
        onClick={() => navigate('/jobs')}
        className="text-blue-600 hover:underline mb-6 flex items-center gap-1">
        ← Back to Jobs
      </button>

      {/* Job Header Card */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">

        {/* Title and Status */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {job.title}
          </h1>
          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
            {job.status}
          </span>
        </div>

        {/* Company and Location */}
        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            🏢 <strong>{job.company}</strong>
          </span>
          <span className="flex items-center gap-1">
            📍 {job.location}
          </span>
          {job.salaryRange && (
            <span className="flex items-center gap-1">
              💰 {job.salaryRange}
            </span>
          )}
        </div>

        {/* Job Type Badge */}
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
          {job.jobType.replace('_', ' ')}
        </span>

        {/* Divider */}
        <hr className="my-6" />

        {/* Job Description */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Job Description
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>

        {/* Divider */}
        <hr className="my-6" />

        {/* Posted By */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <p>Posted by <strong>{job.postedByName}</strong></p>
            <p>
              {new Date(job.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Apply Button */}
          {applied ? (
            <div className="bg-green-50 text-green-600 px-6 py-3 rounded-lg font-medium">
              ✅ Application Submitted!
            </div>
          ) : isJobSeeker || !isAuthenticated ? (
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg">
              {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;