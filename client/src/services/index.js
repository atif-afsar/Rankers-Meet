import api from './api';

export const registrationService = {
  create: (data) => api.post('/registrations', data),
  getAll: (params) => api.get('/registrations', { params }),
  getById: (id) => api.get(`/registrations/${id}`),
};

export const ticketService = {
  getByRegistrationId: (registrationId) => api.get(`/tickets/${registrationId}`),
};

export const checkinService = {
  scanOrManual: (payload) => api.post('/checkin', payload),
  getStatus: (registrationId) => api.get(`/checkin/${registrationId}`),
  undo: (registrationId) => api.post(`/checkin/undo/${registrationId}`),
};

export const adminService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  getDashboardStats: () => api.get('/dashboard/stats'),
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
};
