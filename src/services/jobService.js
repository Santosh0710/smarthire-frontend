import api from './api';

// All job related API calls
const jobService = {

  // Get all open jobs (public)
  getAllJobs: async () => {
    const response = await api.get('/api/jobs');
    return response.data;
  },

  // Get single job by ID (public)
  getJobById: async (id) => {
    const response = await api.get(`/api/jobs/${id}`);
    return response.data;
  },

  // Create new job (employer only)
  createJob: async (jobData) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  },

  // Update job (employer only)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/api/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job (employer only)
  deleteJob: async (id) => {
    await api.delete(`/api/jobs/${id}`);
  },
};

export default jobService;