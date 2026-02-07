import api from '../api/axios';

/**
 * AUTH SERVICES
 */
export const authAPI = {
  // Send OTP to mobile number
  sendOtp: (mobile) => {
    return api.post('/auth/send-otp', { mobile });
  },

  // Verify OTP and authenticate user
  verifyOtp: (mobile, otp) => {
    return api.post('/auth/verify-otp', { mobile, otp });
  },

  // Logout (clear token)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPhone');
  },
};

/**
 * PROFILE SERVICES
 */
export const profileAPI = {
  // Get current user profile
  getProfile: () => {
    return api.get('/profile');
  },

  // Update user profile
  updateProfile: (data) => {
    return api.patch('/profile', data);
  },

  // Add utility connection (electricity, water, gas, etc.)
  addConnection: (connectionData) => {
    return api.post('/profile/connections', connectionData);
  },
};

/**
 * COMPLAINT SERVICES
 */
export const complaintAPI = {
  // Create a general complaint
  createComplaint: (formData) => {
    return api.post('/complaint', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all user complaints
  getMyComplaints: () => {
    return api.get('/complaint/my');
  },

  // Get complaint details
  getComplaintById: (complaintId) => {
    return api.get(`/complaint/${complaintId}`);
  },
};

/**
 * PAYMENT SERVICES
 */
export const paymentAPI = {
  // Create a Stripe payment intent
  createPaymentIntent: (amount, service, billId) => {
    return api.post('/payment/create-intent', {
      amount,
      service,
      billId,
    });
  },

  // Confirm a payment (kiosk flow)
  confirmPayment: (paymentIntentId) => {
    return api.post('/payment/confirm', { paymentIntentId });
  },

  // Get all user payments
  getMyPayments: () => {
    return api.get('/payment/my');
  },
};

/**
 * ELECTRICITY SERVICES
 */
export const electricityAPI = {
  // Pay electricity bill
  payBill: (consumerNumber, amountPaise) => {
    return api.post('/electricity/pay-bill', {
      consumerNumber,
      amountPaise,
    });
  },

  // Fetch pending bills for current user
  getPendingBills: () => {
    return api.get('/electricity/pending-bills');
  },

  // Report power outage
  reportOutage: (formData) => {
    return api.post('/electricity/complaints/outage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Report meter issue
  reportMeterIssue: (formData) => {
    return api.post('/electricity/complaints/meter', formData);
  },

  // Request load change
  requestLoadChange: (data) => {
    return api.post('/electricity/requests/load-change', data);
  },

  // Request new connection
  requestNewConnection: (formData) => {
    return api.post('/electricity/requests/new-connection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

/**
 * WATER SERVICES
 */
export const waterAPI = {
  // Pay water bill
  payBill: (connectionId, amountPaise) => {
    return api.post('/water/pay-bill', {
      connectionId,
      amountPaise,
    });
  },

  // Fetch pending bills for current user
  getPendingBills: () => {
    return api.get('/water/pending-bills');
  },

  // Report no water supply
  reportNoSupply: (formData) => {
    return api.post('/water/complaints/no-supply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Report low pressure
  reportLowPressure: (data) => {
    return api.post('/water/complaints/low-pressure', data);
  },

  // Report meter issue
  reportMeterIssue: (data) => {
    return api.post('/water/complaints/meter', data);
  },

  // Request new connection
  requestNewConnection: (formData) => {
    return api.post('/water/requests/new-connection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

/**
 * GAS SERVICES
 */
export const gasAPI = {
  // Pay gas bill
  payBill: (consumerNumber, amountPaise) => {
    return api.post('/gas/pay-bill', {
      consumerNumber,
      amountPaise,
    });
  },

  // Fetch pending bills for current user
  getPendingBills: () => {
    return api.get('/gas/pending-bills');
  },

  // Report gas leakage (emergency)
  reportLeakage: (formData) => {
    return api.post('/gas/complaints/leakage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Report cylinder issue
  reportCylinderIssue: (data) => {
    return api.post('/gas/complaints/cylinder', data);
  },

  // Request new connection
  requestNewConnection: (formData) => {
    return api.post('/gas/requests/new-connection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Book cylinder
  bookCylinder: (data) => {
    return api.post('/gas/requests/new-connection', data); // Reusing the same endpoint
  },
};

/**
 * WASTE MANAGEMENT SERVICES
 */
export const wasteAPI = {
  // Report missed pickup
  reportMissedPickup: (formData) => {
    return api.post('/waste/complaints/missed-pickup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Report overflowing bin
  reportOverflow: (formData) => {
    return api.post('/waste/complaints/overflow', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Report dead animal
  reportDeadAnimal: (formData) => {
    return api.post('/waste/complaints/dead-animal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Request bulk pickup
  requestBulkPickup: (data) => {
    return api.post('/waste/requests/bulk-pickup', data);
  },
};

/**
 * MUNICIPAL SERVICES
 */
export const municipalAPI = {
  // Pay property tax
  payPropertyTax: (propertyId, amountPaise) => {
    return api.post('/municipal/pay-property-tax', {
      propertyId,
      amountPaise,
    });
  },

  // Request birth certificate
  requestBirthCertificate: (formData) => {
    return api.post('/municipal/certificates/birth', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Request death certificate
  requestDeathCertificate: (formData) => {
    return api.post('/municipal/certificates/death', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Submit municipal grievance
  submitGrievance: (formData) => {
    return api.post('/municipal/complaints/grievance', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

/**
 * ADMIN SERVICES
 */
export const adminAPI = {
  // Get complaint statistics
  getComplaintStats: () => {
    return api.get('/admin/analytics/complaints');
  },

  // Get SLA statistics
  getSlaStats: () => {
    return api.get('/admin/analytics/sla');
  },

  // Get payment statistics
  getPaymentStats: () => {
    return api.get('/admin/analytics/payments');
  },

  // List all complaints
  listComplaints: (filters = {}) => {
    return api.get('/admin/complaints', { params: filters });
  },

  // Get complaint details
  getComplaintDetails: (complaintId) => {
    return api.get(`/admin/complaints/${complaintId}`);
  },

  // Assign complaint to officer
  assignComplaint: (complaintId, officerName) => {
    return api.put(`/admin/complaints/${complaintId}/assign`, {
      officerName,
    });
  },

  // Update complaint status
  updateComplaintStatus: (complaintId, status) => {
    return api.put(`/admin/complaints/${complaintId}/status`, {
      status,
    });
  },
};
