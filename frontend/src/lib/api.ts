// API Configuration
const API_BASE_URL = localStorage.getItem("apiBaseUrl") || "/api";

export const setApiBaseUrl = (url: string) => {
  localStorage.setItem("apiBaseUrl", url);
};

export const getApiBaseUrl = () => {
  return localStorage.getItem("apiBaseUrl") || "/api";
};

// Generic API call helper
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || JSON.stringify(error);
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Citizens API
export const citizensApi = {
  getAll: (skip = 0, limit = 100, name?: string) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    if (name) {
      params.append("name", name);
    }
    return apiCall<any[]>(`/citizens?${params.toString()}`);
  },
  getById: (id: number) => apiCall<any>(`/citizens/${id}`),
  create: (data: any) =>
    apiCall<any>("/citizens", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/citizens/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => apiCall<any>(`/citizens/${id}`, { method: "DELETE" }),
};

// Addresses API
export const addressesApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/addresses?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/addresses/${id}`),
  create: (data: any) =>
    apiCall<any>("/addresses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/addresses/${id}`, { method: "DELETE" }),
};

// Utility Accounts API
export const utilityAccountsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/utility-accounts?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/utility-accounts/${id}`),
  getByCitizen: (citizenId: number) =>
    apiCall<any[]>(`/utility-accounts/citizen/${citizenId}`),
  create: (data: any) =>
    apiCall<any>("/utility-accounts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/utility-accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/utility-accounts/${id}`, { method: "DELETE" }),
};

// Electricity Usage API
export const electricityUsageApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/electricity-usage?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/electricity-usage/${id}`),
  getByAccount: (accountId: number) =>
    apiCall<any[]>(`/electricity-usage/account/${accountId}`),
  create: (data: any) =>
    apiCall<any>("/electricity-usage", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/electricity-usage/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/electricity-usage/${id}`, { method: "DELETE" }),
};

// Water Usage API
export const waterUsageApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/water-usage?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/water-usage/${id}`),
  getByAccount: (accountId: number) =>
    apiCall<any[]>(`/water-usage/account/${accountId}`),
  create: (data: any) =>
    apiCall<any>("/water-usage", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/water-usage/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/water-usage/${id}`, { method: "DELETE" }),
};

// Electricity Bills API
export const electricityBillsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/electricity-bills?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/electricity-bills/${id}`),
  getByAccount: (accountId: number) =>
    apiCall<any[]>(`/electricity-bills/account/${accountId}`),
  create: (data: any) =>
    apiCall<any>("/electricity-bills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/electricity-bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/electricity-bills/${id}`, { method: "DELETE" }),
};

// Water Bills API
export const waterBillsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/water-bills?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/water-bills/${id}`),
  getByAccount: (accountId: number) =>
    apiCall<any[]>(`/water-bills/account/${accountId}`),
  create: (data: any) =>
    apiCall<any>("/water-bills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/water-bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/water-bills/${id}`, { method: "DELETE" }),
};

// Payments API
export const paymentsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/payments?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/payments/${id}`),
  getByBill: (billType: string, billId: number) =>
    apiCall<any[]>(`/payments/bill/${billType}/${billId}`),
  create: (data: any) =>
    apiCall<any>("/payments", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => apiCall<any>(`/payments/${id}`, { method: "DELETE" }),
};

// Public Transport Routes API
export const routesApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/routes?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/routes/${id}`),
  create: (data: any) =>
    apiCall<any>("/routes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/routes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => apiCall<any>(`/routes/${id}`, { method: "DELETE" }),
};

// Drivers API
export const driversApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/drivers?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/drivers/${id}`),
  create: (data: any) =>
    apiCall<any>("/drivers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/drivers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => apiCall<any>(`/drivers/${id}`, { method: "DELETE" }),
};

// Buses API
export const busesApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/buses?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/buses/${id}`),
  getByRoute: (routeId: number) => apiCall<any[]>(`/buses/route/${routeId}`),
  create: (data: any) =>
    apiCall<any>("/buses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/buses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiCall<any>(`/buses/${id}`, { method: "DELETE" }),
};

// Emergency Services API
export const emergencyServicesApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/emergency-services?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/emergency-services/${id}`),
  create: (data: any) =>
    apiCall<any>("/emergency-services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/emergency-services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/emergency-services/${id}`, { method: "DELETE" }),
};

// Emergency Requests API
export const emergencyRequestsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/emergency-requests?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/emergency-requests/${id}`),
  getByStatus: (status: string) =>
    apiCall<any[]>(`/emergency-requests/status/${status}`),
  create: (data: any) =>
    apiCall<any>("/emergency-requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/emergency-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/emergency-requests/${id}`, { method: "DELETE" }),
};

// Waste Collection Zones API
export const wasteZonesApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/waste-collection-zones?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/waste-collection-zones/${id}`),
  create: (data: any) =>
    apiCall<any>("/waste-collection-zones", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/waste-collection-zones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/waste-collection-zones/${id}`, { method: "DELETE" }),
};

// Trucks API
export const trucksApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/trucks?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/trucks/${id}`),
  create: (data: any) =>
    apiCall<any>("/trucks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/trucks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) => apiCall<any>(`/trucks/${id}`, { method: "DELETE" }),
};

// Waste Collection Logs API
export const wasteLogsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/waste-collection-logs?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/waste-collection-logs/${id}`),
  getByZone: (zoneId: number) =>
    apiCall<any[]>(`/waste-collection-logs/zone/${zoneId}`),
  create: (data: any) =>
    apiCall<any>("/waste-collection-logs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/waste-collection-logs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/waste-collection-logs/${id}`, { method: "DELETE" }),
};

// Complaints API
export const complaintsApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/complaints?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/complaints/${id}`),
  getByStatus: (status: string) =>
    apiCall<any[]>(`/complaints/status/${status}`),
  getByCitizen: (citizenId: number) =>
    apiCall<any[]>(`/complaints/citizen/${citizenId}`),
  create: (data: any) =>
    apiCall<any>("/complaints", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiCall<any>(`/complaints/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/complaints/${id}`, { method: "DELETE" }),
};

// Complaint Updates API
export const complaintUpdatesApi = {
  getAll: (skip = 0, limit = 100) =>
    apiCall<any[]>(`/complaint-updates?skip=${skip}&limit=${limit}`),
  getById: (id: number) => apiCall<any>(`/complaint-updates/${id}`),
  getByComplaint: (complaintId: number) =>
    apiCall<any[]>(`/complaint-updates/complaint/${complaintId}`),
  create: (data: any) =>
    apiCall<any>("/complaint-updates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiCall<any>(`/complaint-updates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/complaint-updates/${id}`, { method: "DELETE" }),
};

// Dashboard Stats API
export const statsApi = {
  getStats: () => apiCall<any>("/stats"),
};
