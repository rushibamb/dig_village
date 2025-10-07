import api from './api';

// Admin Tax Management Functions

export const adminGetAllTaxRecords = async (params?: {
  status?: string;
  taxType?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }
  if (params?.taxType && params.taxType !== 'all') {
    queryParams.append('taxType', params.taxType);
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const response = await api.get(`/admin/taxes?${queryParams.toString()}`);
  return response.data;
};

export const adminCreateTaxRecord = async (data: {
  houseNumber: string;
  ownerName: string;
  taxType: string;
  amountDue: number;
  dueDate: string;
  status?: string;
  villagerId?: string;
}) => {
  const response = await api.post('/admin/taxes', data);
  return response.data;
};

export const adminUpdateTaxRecord = async (id: string, data: {
  houseNumber: string;
  ownerName: string;
  taxType: string;
  amountDue: number;
  dueDate: string;
  status?: string;
  villagerId?: string;
}) => {
  const response = await api.put(`/admin/taxes/${id}`, data);
  return response.data;
};

export const adminDeleteTaxRecord = async (id: string) => {
  const response = await api.delete(`/admin/taxes/${id}`);
  return response.data;
};

export const adminMarkAsPaid = async (id: string, paymentDetails?: {
  orderId?: string;
  paymentId?: string;
  receiptNumber?: string;
}) => {
  const response = await api.patch(`/admin/taxes/${id}/mark-paid`, {
    paymentDetails
  });
  return response.data;
};

export const adminUploadTaxCsv = async (formData: FormData) => {
  const response = await api.post('/admin/taxes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Public Tax Search Function

export const searchTaxRecords = async (query: string) => {
  const response = await api.get(`/taxes/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// Payment Functions

export const createPaymentOrder = async (data: {
  taxRecordId: string;
}) => {
  const response = await api.post('/payment/orders', data);
  return response.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  taxRecordId: string;
}) => {
  const response = await api.post('/payment/verify', data);
  return response.data;
};

export const downloadReceipt = async (id: string) => {
  const response = await api.get(`/payment/receipt/${id}`, {
    responseType: 'blob',
  });
  
  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `tax_receipt_${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  return response.data;
};
