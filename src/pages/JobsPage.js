import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  // Re-filter whenever search term or job type changes
  useEffect(() => {
    filterJobs();
  }, [searchTerm, selectedType, jobs]);

  const loadJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let result = jobs;

    // Filter by search term (title, company or location)
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by job type
    if (selectedType !== 'ALL') {
      result = result.filter(job => job.jobType === selectedType);
    }

    setFilteredJobs(result);
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
          {filteredJobs.length} open positions in Luxembourg
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-3">

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title, company or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Job Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="REMOTE">Remote</option>
        </select>

        {/* Clear Button */}
        {(searchTerm || selectedType !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('ALL');
            }}
            className="text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg border border-gray-300">
            Clear
          </button>
        )}
      </div>

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No jobs found.</p>
          <p className="mt-2">
            {searchTerm || selectedType !== 'ALL'
              ? 'Try different search terms or filters.'
              : 'Check back later!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all">

              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.title}
                </h2>
                <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                  {job.jobType.replace('_', ' ')}
                </span>
              </div>

              <div className="flex gap-4 text-gray-500 text-sm mb-3">
                <span>🏢 {job.company}</span>
                <span>📍 {job.location}</span>
                {job.salaryRange && (
                  <span>💰 {job.salaryRange}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {job.description}
              </p>

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