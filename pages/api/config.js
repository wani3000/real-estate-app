// 국토교통부 API 관련 설정
export const API_CONFIG = {
  // 기본 URL
  BASE_URL: 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev',
  
  // API 키
  API_KEY: process.env.MOLIT_API_KEY || '',
  
  // 서울시 각 구의 법정동 코드
  SEOUL_DISTRICTS: [
    { name: '강남구', code: '11680' },
    { name: '강동구', code: '11740' },
    { name: '강서구', code: '11500' },
    { name: '관악구', code: '11620' },
    { name: '광진구', code: '11215' },
    { name: '구로구', code: '11530' },
    { name: '금천구', code: '11545' },
    { name: '노원구', code: '11350' },
    { name: '도봉구', code: '11320' },
    { name: '동대문구', code: '11230' },
    { name: '동작구', code: '11590' },
    { name: '마포구', code: '11440' },
    { name: '서대문구', code: '11410' },
    { name: '서초구', code: '11650' },
    { name: '성동구', code: '11200' },
    { name: '성북구', code: '11290' },
    { name: '송파구', code: '11710' },
    { name: '양천구', code: '11470' },
    { name: '영등포구', code: '11560' },
    { name: '용산구', code: '11170' },
    { name: '은평구', code: '11380' },
    { name: '종로구', code: '11110' },
    { name: '중구', code: '11140' },
    { name: '중랑구', code: '11260' }
  ],
  
  // 대출 설정
  LOAN_OPTIONS: {
    // LTV 비율 (0.7 = 70%)
    LTV_RATE: 0.7,
    
    // DSR 비율 (0.5 = 50%)
    DSR_RATE: 0.5,
    
    // 대출 이자율 (0.035 = 3.5%)
    INTEREST_RATE: 0.035,
    
    // 대출 기간 (30년 = 360개월)
    LOAN_TERM_MONTHS: 360
  }
}; 