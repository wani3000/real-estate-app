// API 기본 URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://real-estate-backend-bphx.onrender.com';

// API 엔드포인트 생성 함수
export const getApiUrl = (endpoint) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API 요청 URL:', url); // 디버깅용 로그 추가
  return url;
};

// 사용 가능한 API 엔드포인트 
export const API_ENDPOINTS = {
  RECOMMEND: '/api/recommend',
  APARTMENTS: '/api/apartments',
  APT: '/api/apt',
  RENT: '/api/rent',
  TEST: '/api/test'
}; 