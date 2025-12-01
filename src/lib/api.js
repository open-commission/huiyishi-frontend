// API 工具类
const BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // 如果有token，则添加到Authorization头
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
}

// 认证相关API
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// 会议室相关API
export const roomsApi = {
  getAllRooms: () => apiRequest('/rooms', {
    method: 'GET',
  }),
};

// 预约相关API
export const reservationsApi = {
  getAllReservations: () => apiRequest('/reservations', {
    method: 'GET',
  }),
  
  getUserReservations: () => apiRequest('/reservations/my', {
    method: 'GET',
  }),
  
  createReservation: (reservationData) => apiRequest('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  }),
};