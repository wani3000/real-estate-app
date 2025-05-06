const express = require("express");
const axios = require("axios");
const cors = require("cors");
const xml2js = require("xml2js");
const app = express();
const PORT = process.env.PORT || 4000;

// 환경 변수 로드 시도
try {
  require('dotenv').config();
  console.log("환경 변수 로드 성공");
} catch (error) {
  console.log("dotenv 모듈 없음, 기본 설정 사용");
}

app.use(cors());
app.use(express.json());

// 루트 경로 핸들러 추가
app.get("/", (req, res) => {
  res.json({
    message: "서울 아파트 추천 API 서버가 정상 작동 중입니다",
    availableEndpoints: [
      "/api/test - 서버 연결 테스트",
      "/api/test-key - API 키 유효성 테스트",
      "/api/recommend - 아파트 추천 API",
      "/api/apt - 매매 아파트 데이터",
      "/api/rent - 전세 아파트 데이터",
      "/api/apartments - 필터링된 아파트 데이터"
    ],
    version: "1.0.0"
  });
});

// 서비스 키 설정 (환경 변수에서 로드, 없으면 기본값 사용)
const SERVICE_KEY = process.env.SERVICE_KEY || "NmuQ26kkGuNHAePDkB71bKSID9V0LZG7po75Axh0DvSsJ%2BldwBWOziJ9G97m%2FP6mj9BvLZD0F3%2FcpI4rCW%2B1%2FQ%3D%3D";

// 목업 데이터 사용 설정
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || true; // 기본적으로 목업 데이터 사용

// 국토교통부 실거래가 API 정확한 엔드포인트 형식 - 공식 문서 확인 결과
const API_BASE_URL = process.env.API_BASE_URL || "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade";
const RENT_API_URL = process.env.RENT_API_URL || "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent";

console.log(`API URL: ${API_BASE_URL}`);
console.log(`원본 서비스 키 길이: ${SERVICE_KEY.length}`);

// XML 파서 인스턴스 생성 (배열 처리 간소화)
const parser = new xml2js.Parser({
  explicitArray: false,
  trim: true
});

// 응답 형식 변환 함수 (XML -> JSON)
const parseXmlResponse = async (xmlData) => {
  try {
    const result = await parser.parseStringPromise(xmlData);
    return result;
  } catch (error) {
    console.error("XML 파싱 오류:", error.message);
    throw new Error("XML 응답 파싱 실패");
  }
};

// API 응답 형식 확인 및 처리 함수
const handleApiResponse = async (response) => {
  const contentType = response.headers['content-type'];
  
  // XML 응답 처리
  if (contentType && contentType.includes('xml')) {
    const xmlData = response.data;
    const jsonData = await parseXmlResponse(xmlData);
    
    // 에러 코드 확인
    if (jsonData.OpenAPI_ServiceResponse && jsonData.OpenAPI_ServiceResponse.cmmMsgHeader) {
      const errorCode = jsonData.OpenAPI_ServiceResponse.cmmMsgHeader.returnReasonCode;
      const errorMessage = jsonData.OpenAPI_ServiceResponse.cmmMsgHeader.returnAuthMsg;
      
      if (errorCode !== "00") {
        throw new Error(`API 오류: ${errorMessage} (코드: ${errorCode})`);
      }
    }
    
    // 데이터 항목 가져오기
    if (jsonData.response && jsonData.response.body && jsonData.response.body.items) {
      const items = jsonData.response.body.items.item || [];
      return Array.isArray(items) ? items : [items];
    }
    
    return [];
  }
  
  // JSON 응답 처리
  if (contentType && contentType.includes('json')) {
    if (response.data.response && response.data.response.body && response.data.response.body.items) {
      const items = response.data.response.body.items.item || [];
      return Array.isArray(items) ? items : [items];
    }
    return [];
  }
  
  throw new Error("지원되지 않는 응답 형식");
};

app.get("/api/test", (req, res) => {
  res.json({ message: "서버 연결 성공!" });
});

// API 키 테스트 엔드포인트 추가
app.get("/api/test-key", async (req, res) => {
  try {
    console.log("API 서비스 키 테스트 시작");
    
    // 키 버전 선택 (원본, 디코딩, 인코딩)
    const keyVersion = req.query.version || 'decoded'; // 기본값은 디코딩 버전
    
    let serviceKeyToTest;
    if (keyVersion === 'original') {
      serviceKeyToTest = SERVICE_KEY;
      console.log("원본 서비스 키로 테스트");
    } else if (keyVersion === 'encoded') {
      serviceKeyToTest = SERVICE_KEY;
      console.log("인코딩된 서비스 키로 테스트");
    } else {
      serviceKeyToTest = SERVICE_KEY;
      console.log("디코딩된 서비스 키로 테스트");
    }
    
    // 서비스 키 확인 (일부만 로그로 표시)
    const serviceKeyLength = serviceKeyToTest.length;
    const maskedKey = serviceKeyToTest.substring(0, 10) + "..." + serviceKeyToTest.substring(serviceKeyLength - 10);
    console.log(`서비스 키(마스킹됨): ${maskedKey}, 길이: ${serviceKeyLength}`);
    
    // 서비스 키에 URL 인코딩이 되어 있는지 확인
    const hasUrlEncoding = serviceKeyToTest.includes('%');
    console.log(`서비스 키 URL 인코딩 여부: ${hasUrlEncoding}`);
    
    // 테스트용 간단한 API URL 작성 (실제 데이터 요청이 아닌 가벼운 요청)
    const testUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKeyToTest}&LAWD_CD=11110&DEAL_YMD=202404&type=json&numOfRows=1`;
    console.log(`테스트 URL: ${testUrl.substring(0, testUrl.indexOf('serviceKey') + 11)}[마스킹된 키]&LAWD_CD=11110&DEAL_YMD=202404&type=json&numOfRows=1`);
    
    const config = {
      headers: {
        'Accept': 'application/json, application/xml'
      },
      timeout: 10000
    };
    
    console.log("API 테스트 요청 전송 중...");
    const response = await axios.get(testUrl, config);
    
    console.log(`API 테스트 응답 상태 코드: ${response.status}`);
    
    // 응답 데이터 구조 확인
    if (response.data) {
      if (response.data.response && response.data.response.header) {
        console.log(`응답 결과 코드: ${response.data.response.header.resultCode}`);
        console.log(`응답 결과 메시지: ${response.data.response.header.resultMsg}`);
        
        // 응답 코드 확인하여 키 유효성 판단
        const resultCode = response.data.response.header.resultCode;
        let keyStatus = "알 수 없음";
        
        if (resultCode === "00") {
          keyStatus = "정상";
        } else if (resultCode === "01" || resultCode === "22") {
          keyStatus = "서비스 제한";
        } else if (resultCode === "20" || resultCode === "30") {
          keyStatus = "잘못된 키";
        } else if (resultCode === "11" || resultCode === "12") {
          keyStatus = "키 만료";
        }
        
        // 결과 반환
        return res.json({
          success: resultCode === "00",
          keyStatus: keyStatus,
          resultCode: resultCode,
          resultMsg: response.data.response.header.resultMsg
        });
      } else {
        // 응답 구조가 예상과 다를 경우
        console.log("API 응답 구조가 예상과 다릅니다:", JSON.stringify(response.data).substring(0, 500));
        return res.json({
          success: false,
          keyStatus: "응답 구조 문제",
          data: response.data
        });
      }
    } else {
      // 응답에 데이터가 없는 경우
      return res.json({
        success: false,
        keyStatus: "데이터 없음",
        statusCode: response.status
      });
    }
  } catch (error) {
    console.error("API 키 테스트 에러:", error.message);
    
    // 에러 상세 정보 수집
    let errorDetails = {};
    if (error.response) {
      errorDetails = {
        statusCode: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      };
      console.error(`응답 상태 코드: ${error.response.status}`);
      console.error(`응답 데이터:`, JSON.stringify(error.response.data).substring(0, 500));
    } else if (error.request) {
      errorDetails = {
        request: true,
        message: "요청 후 응답 없음 (타임아웃 또는 네트워크 오류)"
      };
    }
    
    return res.status(500).json({
      success: false,
      message: "API 키 테스트 실패",
      error: error.message,
      details: errorDetails
    });
  }
});

// 추천 API 엔드포인트 추가
app.get("/api/recommend", async (req, res) => {
  try {
    // 요청 파라미터 가져오기
    const { mode = 'gap', income = 5000, cash = 10000, lawdCd = '전체', dealYmd = '202404' } = req.query;
    
    console.log(`추천 API 호출: mode=${mode}, income=${income}, cash=${cash}, lawdCd=${lawdCd}, dealYmd=${dealYmd}`);
    
    // 필터링된 목업 데이터 사용
    const filteredApartments = mockApartments.filter(apt => {
      // 세대수 300 이상인 아파트만 필터링
      return apt.세대수 >= 300 && (new Date().getFullYear() - apt.건축년도) <= 15;
    });
    
    console.log(`Mock 데이터 아이템 수: ${filteredApartments.length}`);
    
    // 실거주 시나리오 계산
    if (mode === 'live') {
      const parsedIncome = parseInt(income, 10) || 5000; // 기본값 5천만원/년
      const loanAmount = calculateMaxLoanAmount(parsedIncome);
      console.log(`실거주 계산 결과: LTV 기반 최대=${loanAmount / 0.7}만원, DSR 기반 대출한도=${loanAmount}만원, 최종=${Math.round(loanAmount / 0.7)}만원`);
    }
    
    // 응답 반환
    res.json({
      result: filteredApartments,
      queryParams: { mode, income: parseInt(income, 10), cash: parseInt(cash, 10), lawdCd, dealYmd },
      calculatedMax: 1000000
    });
  } catch (error) {
    console.error('추천 API 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 모의 API 응답 데이터 (실제 API가 작동하지 않을 경우 사용)
const mockAptData = {
  response: {
    header: {
      resultCode: "00",
      resultMsg: "NORMAL SERVICE."
    },
    body: {
      items: {
        item: [
          {
            id: "0",
            건축년도: 2010,
            법정동: "중구 정동",
            아파트: "한국아파트",
            거래금액: "87250",
            전용면적: 84.43,
            층: 10,
            지번: "35-1",
            월: 4,
            일: 15,
            년: 2024,
            size: "24평",
            세대수: 310,
            전세가: "61000" // 약 70% 수준의 전세가
          },
          {
            id: "1",
            건축년도: 2005,
            법정동: "강남구 역삼동",
            아파트: "대한아파트",
            거래금액: "95000",
            전용면적: 105.82,
            층: 15,
            지번: "12-7",
            월: 4,
            일: 22,
            년: 2024,
            size: "32평",
            세대수: 450,
            전세가: "66500" // 약 70% 수준의 전세가
          },
          {
            id: "2",
            건축년도: 1990,
            법정동: "서초구 서초동",
            아파트: "서울아파트",
            거래금액: "123500",
            전용면적: 92.56,
            층: 8,
            지번: "55-3",
            월: 4,
            일: 10,
            년: 2024,
            size: "28평",
            세대수: 280,
            전세가: "86450" // 약 70% 수준의 전세가
          },
          {
            id: "3",
            건축년도: 2008,
            법정동: "송파구 잠실동",
            아파트: "현대아파트",
            거래금액: "98000",
            전용면적: 115.70,
            층: 20,
            지번: "27-8",
            월: 4,
            일: 5,
            년: 2024,
            size: "35평",
            세대수: 520,
            전세가: "68600" // 약 70% 수준의 전세가
          },
          {
            id: "4",
            건축년도: 2015,
            법정동: "마포구 공덕동",
            아파트: "삼성아파트",
            거래금액: "89500",
            전용면적: 85.95,
            층: 12,
            지번: "43-2",
            월: 4,
            일: 18,
            년: 2024,
            size: "26평",
            세대수: 350,
            전세가: "62650" // 약 70% 수준의 전세가
          },
          {
            id: "5",
            건축년도: 1997,
            법정동: "용산구 한남동",
            아파트: "롯데아파트",
            거래금액: "92000",
            전용면적: 99.14,
            층: 15,
            지번: "72-1",
            월: 4,
            일: 3,
            년: 2024,
            size: "30평",
            세대수: 200,
            전세가: "64400" // 약 70% 수준의 전세가
          },
          {
            id: "6",
            건축년도: 2009,
            법정동: "영등포구 여의도동",
            아파트: "LG아파트",
            거래금액: "101500",
            전용면적: 109.09,
            층: 25,
            지번: "13-4",
            월: 4,
            일: 12,
            년: 2024,
            size: "33평",
            세대수: 420,
            전세가: "71050" // 약 70% 수준의 전세가
          },
          {
            id: "7",
            건축년도: 2011,
            법정동: "강동구 천호동",
            아파트: "SK아파트",
            거래금액: "96000",
            전용면적: 89.26,
            층: 9,
            지번: "61-5",
            월: 4,
            일: 20,
            년: 2024,
            size: "27평",
            세대수: 380,
            전세가: "67200" // 약 70% 수준의 전세가
          },
          {
            id: "8",
            건축년도: 1996,
            법정동: "노원구 상계동",
            아파트: "KT아파트",
            거래금액: "94500",
            전용면적: 95.87,
            층: 14,
            지번: "32-6",
            월: 4,
            일: 8,
            년: 2024,
            size: "29평",
            세대수: 250,
            전세가: "66150" // 약 70% 수준의 전세가
          },
          {
            id: "9",
            건축년도: 2013,
            법정동: "관악구 신림동",
            아파트: "포스코아파트",
            거래금액: "88000",
            전용면적: 82.64,
            층: 7,
            지번: "49-3",
            월: 4,
            일: 25,
            년: 2024,
            size: "25평",
            세대수: 330,
            전세가: "61600" // 약 70% 수준의 전세가
          }
        ]
      },
      numOfRows: 10,
      pageNo: 1,
      totalCount: 10
    }
  }
};

// 세대수 필터 기준 (문자열을 세대수 범위로 변환)
const householdRanges = {
  '전체': { min: 0, max: 100000 },
  '100세대 이상': { min: 100, max: 100000 },
  '300세대 이상': { min: 300, max: 100000 },
  '500세대 이상': { min: 500, max: 100000 },
  '1000세대 이상': { min: 1000, max: 100000 },
  '3000세대 이상': { min: 3000, max: 100000 },
  '5000세대 이상': { min: 5000, max: 100000 }
};

// 연식 필터 기준 (문자열을 연식 범위로 변환)
const yearRanges = {
  '전체': { min: 0, max: 2025 },
  '3년 이내': { min: 2022, max: 2025 },
  '5년 이내': { min: 2020, max: 2025 },
  '10년 이내': { min: 2015, max: 2025 },
  '15년 이내': { min: 2010, max: 2025 },
  '25년 이상': { min: 0, max: 1999 },
  '30년 이상': { min: 0, max: 1994 }
};

// 기존 프론트엔드 포맷에 맞게 데이터 가공 및 필터링
const formatApartmentData = (maxLivePrice = 1000000, maxGapPrice = 1000000, household = '', year = '') => {
  const live = [];
  const gap = [];
  
  console.log(`필터링 조건: 최대실거주가격=${maxLivePrice}만원, 최대갭투자가격=${maxGapPrice}만원, 세대수=${household}, 연식=${year}`);
  
  // 세대수 필터 범위 설정
  let householdMin = 0;
  let householdMax = 100000;
  if (household && householdRanges[household]) {
    householdMin = householdRanges[household].min;
    householdMax = householdRanges[household].max;
  }
  
  // 연식 필터 범위 설정
  let yearMin = 0;
  let yearMax = 2025;
  if (year && yearRanges[year]) {
    yearMin = yearRanges[year].min;
    yearMax = yearRanges[year].max;
  }
  
  console.log(`세대수 범위: ${householdMin}~${householdMax}, 연식 범위: ${yearMin}~${yearMax}`);
  
  const items = mockAptData.response.body.items.item;
  
  // 아파트별 적합한 투자 방식 확인 및 분류
  items.forEach(apt => {
    const price = parseInt(apt.거래금액, 10);
    const jeonsePrice = parseInt(apt.전세가, 10) || Math.round(price * 0.7); // 전세가 정보가 없으면 가격의 70%로 추정
    const jeonseRatio = jeonsePrice / price; // 전세가 비율 계산
    const households = apt.세대수 || 0;
    const year = apt.건축년도 || 0;
    
    // 세대수 및 연식 필터 적용
    if (households < householdMin || households > householdMax) return;
    if (year < yearMin || year > yearMax) return;
    
    // 실거주 모드 필터링
    if (price <= maxLivePrice) {
      live.push({
        id: apt.id,
        name: apt.아파트,
        location: apt.법정동,
        price: formatPrice(price),
        priceValue: price,
        size: apt.size || `${Math.round(apt.전용면적 / 3.3)}평`,
        jeonsePrice: formatPrice(jeonsePrice),
        jeonsePriceValue: jeonsePrice,
        jeonseRatio: Math.round(jeonseRatio * 100) + '%', // 전세가 비율 표시
        households: apt.세대수 || '정보 없음',
        year: apt.건축년도 || '정보 없음'
      });
    }
    
    // 갭투자 모드 필터링
    // 갭투자는 전세가율이 높을수록 유리함
    const gapScore = jeonseRatio * 100; // 전세가율 점수 (높을수록 좋음)
    if (price <= maxGapPrice && jeonseRatio >= 0.65) { // 최소 65% 이상 전세가율이 투자에 유리
      gap.push({
        id: apt.id,
        name: apt.아파트,
        location: apt.법정동,
        price: formatPrice(price),
        priceValue: price,
        size: apt.size || `${Math.round(apt.전용면적 / 3.3)}평`,
        jeonsePrice: formatPrice(jeonsePrice),
        jeonsePriceValue: jeonsePrice,
        jeonseRatio: Math.round(jeonseRatio * 100) + '%',
        gapAmount: formatPrice(price - jeonsePrice), // 갭금액
        gapAmountValue: price - jeonsePrice,
        gapScore: Math.round(gapScore), // 갭투자 점수
        households: apt.세대수 || '정보 없음',
        year: apt.건축년도 || '정보 없음'
      });
    }
  });
  
  // 갭투자는 갭투자 점수(전세가율)가 높은 순으로 정렬
  gap.sort((a, b) => b.gapScore - a.gapScore);
  
  // 실거주는 가격이 낮은 순으로 정렬
  live.sort((a, b) => a.priceValue - b.priceValue);
  
  return { live, gap };
};

// 가격 형식화 (숫자 -> "X억 X,XXX만 원" 형태로)
function formatPrice(price) {
  // 입력 유효성 검사 추가
  if (price === null || price === undefined || isNaN(price)) {
    return '0원';
  }
  
  // 숫자로 변환 보장
  price = Number(price);
  if (price === 0) return '0원';
  
  const billion = Math.floor(price / 10000);
  const million = price % 10000;
  
  if (billion > 0 && million > 0) {
    return `${billion}억 ${million.toLocaleString()}만 원`;
  } else if (billion > 0) {
    return `${billion}억 원`;
  } else if (million > 0) {
    return `${million.toLocaleString()}만 원`;
  } else {
    return '0원';
  }
}

// 문자열 금액을 숫자로 변환 (예: "9억 8,637만 원" -> 98637)
function parsePrice(priceStr) {
  // 입력 유효성 검사 추가
  if (!priceStr || typeof priceStr !== 'string') {
    return 0;
  }
  
  let result = 0;
  
  try {
    // 억 단위 추출
    const billionMatch = priceStr.match(/(\d+)억/);
    if (billionMatch) {
      result += parseInt(billionMatch[1], 10) * 10000;
    }
    
    // 만 단위 추출 (콤마 제거)
    const millionMatch = priceStr.match(/(\d+(?:,\d+)*)만/);
    if (millionMatch) {
      const millionStr = millionMatch[1].replace(/,/g, '');
      result += parseInt(millionStr, 10);
    }
    
    return result;
  } catch (error) {
    console.error("가격 파싱 오류:", error.message);
    return 0;
  }
}

app.get("/api/apt", async (req, res) => {
  console.log("apt API 요청 받음:", req.query);
  const lawdCd = req.query.lawdCd || "11110"; // 서울 중구
  const dealYmd = req.query.dealYmd || "202404";

  try {
    // 실제 API 호출
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTradeDev?serviceKey=${SERVICE_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`;
    console.log("요청 URL:", url);
    
    const config = {
      headers: {
        'Accept': 'application/json, application/xml'
      }
    };
    
    // API 호출 시도
    try {
      const response = await axios.get(url, config);
      console.log("응답 상태 코드:", response.status);
      
      // 성공적으로 데이터를 받았으면 해당 데이터 반환
      if (response.data && response.status === 200) {
        return res.json(response.data);
      }
    } catch (apiError) {
      console.error("API 호출 오류:", apiError.message);
      console.log("API 호출 실패, 모의 데이터 반환");
    }
    
    // API 호출 실패 시 모의 데이터 반환
    res.json(mockAptData);
  } catch (error) {
    console.error("API 요청 오류:", error.message);
    if (error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
      console.error("응답 데이터:", error.response.data);
    }
    res.status(500).json({ error: "데이터 가져오기 실패", message: error.message });
  }
});

// API에서 전세 데이터 가져오는 새 엔드포인트 추가
app.get("/api/rent", async (req, res) => {
  console.log("전세 API 요청 받음:", req.query);
  const lawdCd = req.query.lawdCd || "11110"; // 서울 중구
  const dealYmd = req.query.dealYmd || "202404";

  try {
    // 실제 API 호출
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${SERVICE_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`;
    console.log("전세 API 요청 URL:", url);
    
    const config = {
      headers: {
        'Accept': 'application/json, application/xml'
      }
    };
    
    try {
      const response = await axios.get(url, config);
      console.log("전세 API 응답 상태 코드:", response.status);
      
      if (response.data && response.status === 200) {
        return res.json(response.data);
      }
    } catch (apiError) {
      console.error("전세 API 호출 오류:", apiError.message);
      console.log("전세 API 호출 실패, 모의 데이터 반환");
    }
    
    // 모의 전세 데이터 반환 (실제로는 구현 필요)
    res.json({ message: "모의 전세 데이터" });
  } catch (error) {
    console.error("전세 API 요청 오류:", error.message);
    res.status(500).json({ error: "전세 데이터 가져오기 실패", message: error.message });
  }
});

// 데이터를 메모리에 캐싱하는 변수
let cachedAptData = null;
let cachedRentData = null;
let lastUpdated = null;

// 캐시된 데이터를 가져오거나 API에서 새로 가져오는 함수
async function getApartmentData(lawdCd = "11110", dealYmd = "202404", forceRefresh = false) {
  try {
    console.log(`아파트 데이터 가져오기 시작: 지역코드=${lawdCd}, 계약월=${dealYmd}`);
    
    // 목업 데이터 사용 설정이 활성화된 경우 바로 목업 데이터 반환
    if (USE_MOCK_DATA) {
      console.log("목업 데이터 사용 설정이 활성화되어 있어 목업 데이터를 반환합니다.");
      return {
        items: mockApartments,
        rent: mockApartments.map(apt => ({
          ...apt,
          전월세구분: "전세",
          보증금액: apt.전세가,
          월세금액: "0"
        }))
      };
    }

    // 이 부분에서 계속 진행...
    const aptUrl = `${API_BASE_URL}/getRTMSDataSvcAptTrade?serviceKey=${SERVICE_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`;
    const rentUrl = `${RENT_API_URL}/getRTMSDataSvcAptRent?serviceKey=${SERVICE_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`;
    
    console.log(`아파트 매매 API URL: ${aptUrl.substring(0, aptUrl.indexOf('serviceKey') + 11)}[마스킹된 키]&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`);
    console.log(`아파트 전월세 API URL: ${rentUrl.substring(0, rentUrl.indexOf('serviceKey') + 11)}[마스킹된 키]&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`);
    
    // REST API 요청을 위한 설정
    const config = {
      headers: {
        'Accept': 'application/json, application/xml'
      },
      timeout: 10000  // 10초 타임아웃 설정
    };
    
    try {
      // 아파트 매매와 전세 데이터를 병렬로 가져오기
      const [aptResponse, rentResponse] = await Promise.all([
        axios.get(aptUrl, config),
        axios.get(rentUrl, config)
      ]);
      
      // 응답 처리
      return {
        items: aptResponse.data?.response?.body?.items?.item || [],
        rent: rentResponse.data?.response?.body?.items?.item || []
      };
    } catch (error) {
      console.error("API 호출 오류:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("데이터 가져오기 오류:", error.message);
    console.error("스택 트레이스:", error);
    console.log("예외 발생으로 목업 데이터 사용됨");
    
    // 오류 발생 시 목업 데이터 반환
    return {
      items: mockApartments,
      rent: mockApartments.map(apt => ({
        ...apt,
        전월세구분: "전세",
        보증금액: apt.전세가,
        월세금액: "0"
      }))
    };
  }
}

// 프론트엔드에 맞는 형식으로 데이터 제공하는 엔드포인트
app.get("/api/apartments", async (req, res) => {
  console.log("아파트 데이터 요청 받음", req.query);
  try {
    // 쿼리에서 필터 옵션 추출
    const { income, assets, investmentType, households, yearBuilt } = req.query;
    
    // 소득과 자산을 숫자로 변환
    const parsedIncome = parseInt(income, 10) || 5000; // 기본값 5000만원
    const parsedAssets = parseInt(assets, 10) || 10000; // 기본값 1억원
    
    console.log(`계산에 사용할 값: 소득=${parsedIncome}만원, 자산=${parsedAssets}만원, 투자유형=${investmentType}, 세대수=${households}, 연식=${yearBuilt}`);
    
    // 실제 데이터 가져오기
    const { apt, rent } = await getApartmentData();
    
    // 2025년 기준 새 공식으로 최대 구매 가능 금액 계산
    let maxLivePrice = 0;
    let maxGapPrice = 0;
    
    // 1. 실거주 계산 (DSR 40%, LTV 70%, 40년 만기, 금리 3.5%)
    const incomeWon = parsedIncome * 10000; // 만원 → 원
    const assetsWon = parsedAssets * 10000; // 만원 → 원
    
    // 연간 상환 가능액 = 연소득 × 0.4 (DSR 40%)
    const annualPayment = incomeWon * 0.4;
    
    // 대출 가능 금액 계산 - 금리와 기간을 고려한 상환계수 적용
    // 소득이 높을수록 더 유리한 상환계수 적용 (금리 할인 고려)
    let repaymentCoefficient = 0.0493; // 기본 상환계수
    if (parsedIncome > 10000) { // 연소득 1억 초과 시 유리한 계수 적용
      repaymentCoefficient = 0.0450;
    } else if (parsedIncome > 7000) { // 연소득 7천만원 초과 시 중간 수준 계수 적용
      repaymentCoefficient = 0.0470;
    }
    
    const loanAmount = annualPayment / repaymentCoefficient;
    
    // LTV 제한 적용 (고액 자산가는 더 높은 LTV 적용 가능)
    let ltvRate = 0.7; // 기본 LTV 70%
    if (parsedAssets > 50000) { // 자산 5억 초과 시
      ltvRate = 0.8; // LTV 80%로 상향
    } else if (parsedAssets > 30000) { // 자산 3억 초과 시
      ltvRate = 0.75; // LTV 75%로 상향
    }
    
    // LTV 제한 적용 금액 계산
    const ltvLimitAmount = loanAmount / ltvRate;
    
    // 최대 구매 가능 금액 = min(LTV 제한 금액, 대출금+보유금)
    const totalAvailableAmount = loanAmount + assetsWon;
    maxLivePrice = Math.min(ltvLimitAmount, totalAvailableAmount);
    maxLivePrice = Math.round(maxLivePrice / 10000); // 원 → 만원
    
    // 2. 갭투자 계산 - 각 아파트마다 전세가를 고려한 개별 계산 수행
    // 신용대출 (연소득의 120%)
    const creditLoanAmount = incomeWon * 1.2;
    
    // 기본 갭투자 능력 (신용대출 + 보유자산)
    const baseGapAmount = creditLoanAmount + assetsWon;
    
    // 여기서는 가장 높은 가능 금액을 계산 (실제 필터링은 아래 formatRealApartmentData에서 수행)
    maxGapPrice = Math.round((baseGapAmount + 100000 * 10000) / 10000); // 임시로 가장 높은 전세가 1억 가정
    
    console.log(`계산된 최대 구매 가능 금액: 실거주=${maxLivePrice}만원, 갭투자=${maxGapPrice}만원`);
    
    // 개별 아파트에 대한 갭투자 가능 여부를 계산하도록 수정된 로직 적용
    const formattedData = formatRealApartmentData(
      apt,
      rent,
      maxLivePrice, 
      baseGapAmount / 10000, // 만원 단위로 전달 
      parsedIncome,
      parsedAssets,
      households, 
      yearBuilt
    );
    
    console.log(`계산된 아파트 수: live=${formattedData.live.length}, gap=${formattedData.gap.length}`);
    
    // 계산 파라미터도 함께 반환
    const calculationParams = {
      income: parsedIncome,
      assets: parsedAssets,
      investmentType,
      maxLivePrice,
      maxGapPrice
    };
    
    res.json({
      success: true,
      apartments: formattedData,
      calculationParams
    });
  } catch (error) {
    console.error("데이터 포맷팅 오류:", error);
    res.status(500).json({ 
      success: false,
      error: "데이터 처리 실패", 
      message: error.message 
    });
  }
});

// 실제 API 데이터를 사용하여 아파트 데이터 형식화하는 함수
const formatRealApartmentData = (aptData, rentData, maxLivePrice = 1000000, baseGapAmount = 1000000, income, assets, household = '', year = '') => {
  const live = [];
  const gap = [];
  
  console.log(`실제 API 데이터로 필터링: 최대실거주가격=${maxLivePrice}만원, 기본갭투자능력=${baseGapAmount}만원, 세대수=${household}, 연식=${year}`);
  
  // 현재 연도 계산
  const CURRENT_YEAR = new Date().getFullYear();
  
  // 세대수 필터 범위 설정
  let householdMin = 0;
  let householdMax = 100000;
  if (household && householdRanges[household]) {
    householdMin = householdRanges[household].min;
    householdMax = householdRanges[household].max;
  }
  
  // 연식 필터 범위 설정
  let yearMin = 0;
  let yearMax = 2025;
  let isYearAfter = false; // 연도 조건이 '이상'인지 여부
  
  if (year && yearRanges[year]) {
    yearMin = yearRanges[year].min;
    yearMax = yearRanges[year].max;
    isYearAfter = year.includes('이상'); // '이상'이면 오래된 건물(연식이 많은), '이내'면 최근 건물
  }
  
  console.log(`세대수 범위: ${householdMin}~${householdMax}, 연식 범위: ${yearMin}~${yearMax}, 오래된 건물 조건: ${isYearAfter}`);
  
  try {
    // API 응답에서 실제 아파트 데이터 추출
    let items = [];
    
    if (aptData && Array.isArray(aptData.items)) {
      items = aptData.items;
      console.log("API에서 아파트 데이터 추출 성공");
    } else {
      // API 데이터가 없으면 모의 데이터 사용
      console.log("API 데이터 형식이 예상과 다르므로 모의 데이터 사용");
      items = mockApartments;
    }
    
    // 전세 데이터 매핑 생성
    const jeonseMap = {};
    
    if (rentData && Array.isArray(rentData.rent)) {
      const rentItems = rentData.rent;
      
      console.log(`전세 데이터 항목 수: ${rentItems.length}`);
      
      // 아파트 이름과 동으로 전세가 매핑
      rentItems.forEach(rentItem => {
        try {
          // 전세 데이터 키 생성 (아파트명-법정동)
          const aptName = String(rentItem.아파트 || rentItem.건물명 || '');
          const dongName = String(rentItem.법정동 || rentItem.지역코드 || '');
          const key = `${aptName}-${dongName}`;
          
          // 보증금액을 숫자로 변환 (API 응답에 따라 다양한 필드명과 형식 대응)
          let deposit = 0;
          if (rentItem.보증금액) {
            // 문자열인지 확인하고 변환
            const depositStr = String(rentItem.보증금액).replace(/,/g, '');
            deposit = parseFloat(depositStr);
          } else if (rentItem.보증금) {
            const depositStr = String(rentItem.보증금).replace(/,/g, '');
            deposit = parseFloat(depositStr);
          } else if (rentItem.거래금액) {
            const depositStr = String(rentItem.거래금액).replace(/,/g, '');
            deposit = parseFloat(depositStr);
          }
          
          // 기존 매핑보다 큰 경우에만 업데이트 (NaN 체크 추가)
          if (!isNaN(deposit) && (!jeonseMap[key] || deposit > jeonseMap[key])) {
            jeonseMap[key] = deposit;
          }
        } catch (err) {
          console.error("전세 데이터 처리 중 오류:", err.message);
        }
      });
      
      console.log(`전세 데이터 매핑 생성 완료: ${Object.keys(jeonseMap).length}건`);
    } else {
      console.log("전세 데이터가 없거나 형식이 예상과 다름");
    }
    
    console.log(`처리할 아파트 수: ${items.length}, 전세 데이터 수: ${Object.keys(jeonseMap).length}`);
    
    // 먼저 필터링한 후 아파트 데이터를 처리합니다
    const filteredItems = items.filter(apt => {
      try {
        // 세대수 필터링
        const households = apt.세대수 || Math.floor(Math.random() * 500) + 100; // 임시로 세대수 생성
        if (households < householdMin || households > householdMax) {
          return false;
        }
        
        // 건축년도 필터링
        const buildYearStr = String(apt.건축년도 || apt.건축년 || '');
        // 문자열을 숫자로 변환 (예: "2010" -> 2010)
        const buildYear = parseInt(buildYearStr, 10) || parseInt(String(apt.년 || ''), 10) - Math.floor(Math.random() * 20); // 임시로 건축년도 생성
        const buildAge = CURRENT_YEAR - buildYear; // 건물 연식 계산
        
        if (isYearAfter) {
          // 'N년 이상' 필터: 건물 연식이 N년 이상인지 확인
          if (buildAge < yearMin) {
            return false;
          }
        } else {
          // 'N년 이내' 필터: 건물 연식이 N년 이내인지 확인
          if (buildAge > yearMax) {
            return false;
          }
        }
        
        return true;
      } catch (error) {
        console.error("필터링 중 오류 발생:", error.message);
        return false;
      }
    });
    
    console.log(`필터링 후 아파트 수: ${filteredItems.length}`);
    
    // 필터링된 아파트에 대해 실거주/갭투자 여부 확인 및 분류
    filteredItems.forEach(apt => {
      try {
        // API 응답에서 거래금액 파싱 
        // 공공데이터 API는 "82,500" 또는 "82500" 형식으로 반환할 수 있음
        const priceStr = String(apt.거래금액 || apt.매매가 || "0").replace(/,/g, '').trim();
        // 만원 단위로 처리
        let price = 0;
        if (priceStr.length <= 5) {
          // 짧은 문자열(ex: "82500")은 만원 단위로 가정
          price = parseInt(priceStr, 10) * 10;
        } else {
          // 긴 문자열은 원 단위로 가정하고 만원 단위로 변환
          price = Math.round(parseInt(priceStr, 10) / 10000);
        }
        
        // 가격이 너무 작으면 목업 데이터 값 사용
        if (price < 1000) {
          price = 85000 + Math.floor(Math.random() * 20000);
        }
        
        // 세대수와 건축년도 정보
        const households = apt.세대수 || Math.floor(Math.random() * 500) + 100;
        const buildYearStr = String(apt.건축년도 || apt.건축년 || '');
        const buildYear = parseInt(buildYearStr, 10) || parseInt(String(apt.년 || ''), 10) - Math.floor(Math.random() * 20);
        const buildAge = CURRENT_YEAR - buildYear; // 건물 연식
        
        // 전세가 구하기
        const aptKey = `${String(apt.아파트 || apt.건물명 || '')}-${String(apt.법정동 || apt.지역코드 || '')}`;
        let jeonsePrice = jeonseMap[aptKey] || 0;
        
        // 전세가 정보가 없으면 매매가의 약 65~75% 수준으로 추정
        if (jeonsePrice === 0 || jeonsePrice < 1000) {
          const randomRatio = 0.65 + (Math.random() * 0.1); // 65~75% 사이 랜덤
          jeonsePrice = Math.round(price * randomRatio);
        }
        
        // 전세가율이 너무 높으면 조정
        const jeonseRatio = Math.min(jeonsePrice / price, 0.9); // 최대 90%로 제한
        
        // 면적을 평으로 변환
        const areaStr = String(apt.전용면적 || apt.면적 || "0").replace(/,/g, '');
        const sizeInPyeong = Math.round(parseFloat(areaStr) / 3.3);
        const sizeText = `${sizeInPyeong}평`;
        
        // 실거주 모드 필터링
        if (price <= maxLivePrice) {
          live.push({
            id: apt.id || apt.일련번호 || String(Math.random()).substring(2, 10), // 고유 ID 생성
            name: String(apt.아파트 || apt.건물명 || "이름 없음"),
            location: String(apt.법정동 || apt.지역명 || "위치 정보 없음"),
            price: formatPrice(price),
            priceValue: price,
            size: sizeText,
            jeonsePrice: formatPrice(jeonsePrice),
            jeonsePriceValue: jeonsePrice,
            jeonseRatio: Math.round(jeonseRatio * 100) + '%', // 전세가 비율 표시
            households: households,
            year: buildYear,
            age: buildAge // 건물 연식 추가
          });
        }
        
        // 갭투자 모드 필터링
        // 갭투자는 전세가율이 높을수록 유리함
        const gapScore = jeonseRatio * 100; // 전세가율 점수 (높을수록 좋음)
        if (price <= maxLivePrice && jeonseRatio >= 0.65) { // 최소 65% 이상 전세가율이 투자에 유리
          gap.push({
            id: apt.id || apt.일련번호 || String(Math.random()).substring(2, 10), // 고유 ID 생성
            name: String(apt.아파트 || apt.건물명 || "이름 없음"),
            location: String(apt.법정동 || apt.지역명 || "위치 정보 없음"),
            price: formatPrice(price),
            priceValue: price,
            size: sizeText,
            jeonsePrice: formatPrice(jeonsePrice),
            jeonsePriceValue: jeonsePrice,
            jeonseRatio: Math.round(jeonseRatio * 100) + '%',
            gapAmount: formatPrice(price - jeonsePrice), // 갭금액
            gapAmountValue: price - jeonsePrice,
            gapScore: Math.round(gapScore), // 갭투자 점수
            households: households,
            year: buildYear,
            age: buildAge // 건물 연식 추가
          });
        }
      } catch (error) {
        console.error("아파트 데이터 처리 중 오류:", error.message);
      }
    });
    
  } catch (error) {
    console.error("데이터 포맷팅 중 오류 발생:", error.message);
    // 오류 발생 시 빈 배열 반환하지 않고 목업 데이터로 대체
    return formatApartmentDataWithGap(maxLivePrice, baseGapAmount, income, assets, household, year);
  }
  
  // 갭투자는 갭투자 점수(전세가율)가 높은 순으로 정렬
  gap.sort((a, b) => b.gapScore - a.gapScore);
  
  // 실거주는 가격이 낮은 순으로 정렬
  live.sort((a, b) => a.priceValue - b.priceValue);
  
  // 빈 결과가 나오는 경우 일부 mockData로 보완
  if (live.length === 0) {
    console.log("실거주 목록이 비어 있어 목업 데이터로 보완합니다.");
    const mockResult = formatApartmentDataWithGap(maxLivePrice, baseGapAmount, income, assets, household, year);
    live.push(...mockResult.live.slice(0, 3)); // 목업 데이터 3개만 추가
  }
  
  if (gap.length === 0) {
    console.log("갭투자 목록이 비어 있어 목업 데이터로 보완합니다.");
    const mockResult = formatApartmentDataWithGap(maxLivePrice, baseGapAmount, income, assets, household, year);
    gap.push(...mockResult.gap.slice(0, 3)); // 목업 데이터 3개만 추가
  }
  
  return { live, gap };
};

// 갭투자 계산 함수
const calculateGapInvestment = (income, assets, jeonsePrice) => {
  // 만원 단위로 계산
  const incomeWon = income * 10000; // 만원 -> 원
  const assetsWon = assets * 10000; // 만원 -> 원
  const jeonsePriceWon = jeonsePrice * 10000; // 만원 -> 원
  
  // 신용대출 = 연소득의 120%
  const creditLoan = incomeWon * 1.2;
  
  // 갭투자 시나리오 계산
  // 전세가 활용 공식: 매매가 = (자산 + 신용대출) / (1 - 전세비율)
  const ownCapital = assetsWon + creditLoan;
  const avgJeonseRatio = jeonsePriceWon > 0 ? (jeonsePriceWon / (jeonsePriceWon + ownCapital)) : 0.7;
  const limitedJeonseRatio = Math.min(avgJeonseRatio, 0.85); // 최대 85%로 제한
  
  // 총 구매 가능 금액 계산
  const totalPurchasePower = ownCapital / (1 - limitedJeonseRatio);
  
  // 결과를 만원 단위로 변환
  return {
    creditLoan: Math.round(creditLoan / 10000),
    jeonse: Math.round(jeonsePriceWon / 10000),
    totalPurchasePower: Math.round(totalPurchasePower / 10000)
  };
};

// 갭투자까지 고려하여 데이터 필터링 및 포맷팅하는 함수 (mockData 기반)
const formatApartmentDataWithGap = (maxLivePrice = 1000000, baseGapAmount = 1000000, income, assets, household = '', year = '') => {
  const live = [];
  const gap = [];
  
  console.log(`목업 데이터 필터링: 최대실거주가격=${maxLivePrice}만원, 기본갭투자능력=${baseGapAmount}만원, 세대수=${household}, 연식=${year}`);
  
  // 현재 연도 계산
  const CURRENT_YEAR = new Date().getFullYear();
  
  // 세대수 필터 범위 설정
  let householdMin = 0;
  let householdMax = 100000;
  if (household && householdRanges[household]) {
    householdMin = householdRanges[household].min;
    householdMax = householdRanges[household].max;
  }
  
  // 연식 필터 범위 설정
  let yearMin = 0;
  let yearMax = 2025;
  let isYearAfter = false; // 연도 조건이 '이상'인지 여부
  
  if (year && yearRanges[year]) {
    yearMin = yearRanges[year].min;
    yearMax = yearRanges[year].max;
    isYearAfter = year.includes('이상'); // '이상'이면 오래된 건물(연식이 많은), '이내'면 최근 건물
  }
  
  console.log(`목업 필터링 - 세대수 범위: ${householdMin}~${householdMax}, 연식 범위: ${yearMin}~${yearMax}, 오래된 건물 조건: ${isYearAfter}`);
  
  const items = mockAptData.response.body.items.item;
  
  // 필터링된 아파트 목록 생성
  const filteredItems = items.filter(apt => {
    // 세대수 필터링
    const households = apt.세대수 || 0;
    if (households < householdMin || households > householdMax) {
      return false;
    }
    
    // 건축년도 필터링
    const buildYear = apt.건축년도 || parseInt(apt.년, 10) - Math.floor(Math.random() * 20); // 임시로 건축년도 생성
    const buildAge = CURRENT_YEAR - buildYear; // 건물 연식 계산
    
    if (isYearAfter) {
      // 'N년 이상' 필터: 건물 연식이 N년 이상인지 확인
      if (buildAge < yearMin) {
        return false;
      }
    } else {
      // 'N년 이내' 필터: 건물 연식이 N년 이내인지 확인
      if (buildAge > yearMax) {
        return false;
      }
    }
    
    return true;
  });
  
  console.log(`목업 데이터 필터링 후 아파트 수: ${filteredItems.length}`);
  
  // 아파트별 적합한 투자 방식 확인 및 분류
  filteredItems.forEach(apt => {
    const price = parseInt(apt.거래금액, 10);
    const jeonsePrice = parseInt(apt.전세가, 10) || Math.round(price * 0.7); // 전세가 정보가 없으면 가격의 70%로 추정
    const jeonseRatio = jeonsePrice / price; // 전세가 비율 계산
    const households = apt.세대수 || 0;
    const buildYear = apt.건축년도 || parseInt(apt.년, 10) - Math.floor(Math.random() * 20);
    const buildAge = CURRENT_YEAR - buildYear; // 건물 연식
    
    // 실거주 모드 필터링
    if (price <= maxLivePrice) {
      live.push({
        id: apt.id,
        name: apt.아파트,
        location: apt.법정동,
        price: formatPrice(price),
        priceValue: price,
        size: apt.size || `${Math.round(apt.전용면적 / 3.3)}평`,
        jeonsePrice: formatPrice(jeonsePrice),
        jeonsePriceValue: jeonsePrice,
        jeonseRatio: Math.round(jeonseRatio * 100) + '%', // 전세가 비율 표시
        households: households,
        year: buildYear,
        age: buildAge // 건물 연식 추가
      });
    }
    
    // 갭투자 모드 필터링
    // 갭투자는 전세가율이 높을수록 유리함
    const gapScore = jeonseRatio * 100; // 전세가율 점수 (높을수록 좋음)
    if (price <= maxLivePrice && jeonseRatio >= 0.65) { // 최소 65% 이상 전세가율이 투자에 유리
      gap.push({
        id: apt.id,
        name: apt.아파트,
        location: apt.법정동,
        price: formatPrice(price),
        priceValue: price,
        size: apt.size || `${Math.round(apt.전용면적 / 3.3)}평`,
        jeonsePrice: formatPrice(jeonsePrice),
        jeonsePriceValue: jeonsePrice,
        jeonseRatio: Math.round(jeonseRatio * 100) + '%',
        gapAmount: formatPrice(price - jeonsePrice), // 갭금액
        gapAmountValue: price - jeonsePrice,
        gapScore: Math.round(gapScore), // 갭투자 점수
        households: households,
        year: buildYear,
        age: buildAge // 건물 연식 추가
      });
    }
  });
  
  // 갭투자는 갭투자 점수(전세가율)가 높은 순으로 정렬
  gap.sort((a, b) => b.gapScore - a.gapScore);
  
  // 실거주는 가격이 낮은 순으로 정렬
  live.sort((a, b) => a.priceValue - b.priceValue);
  
  return { live, gap };
};

// 최대 대출 가능 금액 계산 함수
function calculateMaxLoanAmount(annualIncome) {
  // DSR 40% 기준: 연소득의 40%를 대출 상환에 사용 가능
  // 연 이자율 3.5%, 40년 만기 기준 계산
  const annualInterestRate = 0.035;
  const loanTermYears = 40;
  
  // 월 상환 가능액 계산 (연소득의 40% / 12)
  const monthlyPaymentCapacity = (annualIncome * 0.4) / 12;
  
  // 월 이자율 계산
  const monthlyInterestRate = annualInterestRate / 12;
  
  // 대출 가능 금액 계산 (원리금 균등상환 공식 활용)
  const paymentFactor = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermYears * 12)) / 
                      (Math.pow(1 + monthlyInterestRate, loanTermYears * 12) - 1);
  
  const dsrBasedLoanMax = monthlyPaymentCapacity / paymentFactor;
  
  return dsrBasedLoanMax;
}

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});