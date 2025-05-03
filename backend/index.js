const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 서비스 키 설정
const SERVICE_KEY = "NmuQ26kkGuNHAePDkB71bKSID9V0LZG7po75Axh0DvSsJ%2BldwBWOziJ9G97m%2FP6mj9BvLZD0F3%2FcpI4rCW%2B1%2FQ%3D%3D";

app.get("/api/test", (req, res) => {
  res.json({ message: "서버 연결 성공!" });
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
  '300세대 이상': { min: 300, max: 100000 },
  '100~300세대': { min: 100, max: 299 },
  '100세대 미만': { min: 0, max: 99 }
};

// 연식 필터 기준 (문자열을 연식 범위로 변환)
const yearRanges = {
  '5년 이내': { min: 2020, max: 2025 },
  '5~15년': { min: 2010, max: 2019 },
  '15~25년': { min: 2000, max: 2009 },
  '25년 이상': { min: 0, max: 1999 }
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
  
  // 갭투자 계산 함수
  const calculateGapInvestment = (income, assets, jeonsePrice) => {
    // 만원 단위로 계산
    const incomeWon = income * 10000; // 만원 -> 원
    const assetsWon = assets * 10000; // 만원 -> 원
    const jeonsePriceWon = jeonsePrice * 10000; // 만원 -> 원
    
    // 신용대출 = 연소득의 120%
    const creditLoan = incomeWon * 1.2;
    
    // 총 갭투자 능력 = 신용대출 + 보유자산 + 전세금
    const totalPurchasePower = creditLoan + assetsWon + jeonsePriceWon;
    
    // 결과를 만원 단위로 변환
    return {
      creditLoan: Math.round(creditLoan / 10000),
      jeonse: jeonsePrice,
      totalPurchasePower: Math.round(totalPurchasePower / 10000)
    };
  };
  
  // 아이템을 실거주와 갭투자로 나누기 (홀수 ID는 gap, 짝수 ID는 live로 임시 분류)
  items.forEach(item => {
    // 가격을 숫자로 변환
    const price = parseInt(item.거래금액, 10);
    const jeonsePrice = parseInt(item.전세가, 10);
    
    // 세대수와 연식 조건 확인
    const householdMatch = !household || (item.세대수 >= householdMin && item.세대수 <= householdMax);
    const yearMatch = !year || (item.건축년도 >= yearMin && item.건축년도 <= yearMax);
    
    // 필터 조건을 모두 충족하는지 확인
    if (householdMatch && yearMatch) {
      const formattedPrice = formatPrice(price);
      const formattedJeonsePrice = formatPrice(jeonsePrice);
      
      const formatted = {
        id: item.id,
        name: item.아파트,
        location: item.법정동,
        size: item.size,
        price: formattedPrice,
        // 추가 필드
        sqm: item.전용면적,
        floor: item.층,
        year: item.건축년도,
        date: `${item.년}-${item.월}-${item.일}`,
        households: item.세대수,
        jeonsePrice: formattedJeonsePrice,
        jeonsePriceValue: jeonsePrice // 숫자 값으로도 전달
      };
      
      // 실거주/갭투자 구분 및 가격 필터링
      const id = parseInt(item.id);
      if (id % 2 === 0) { // 실거주
        if (price <= maxLivePrice) {
          live.push(formatted);
        }
      } else { // 갭투자
        if (price <= maxGapPrice) {
          gap.push(formatted);
        }
      }
    }
  });
  
  console.log(`필터링 결과: 실거주=${live.length}개, 갭투자=${gap.length}개`);
  return { live, gap };
};

// 가격 형식화 (숫자 -> "X억 X,XXX만 원" 형태로)
function formatPrice(price) {
  if (!price) return '0원';
  
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
  if (!priceStr) return 0;
  
  let result = 0;
  
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
}

app.get("/api/apt", async (req, res) => {
  console.log("apt API 요청 받음:", req.query);
  const lawdCd = req.query.lawdCd || "11110"; // 서울 중구
  const dealYmd = req.query.dealYmd || "202404";

  try {
    // 모의 데이터 반환 (실제 API 작동 안될 경우)
    // 공공데이터포털 API가 때때로 불안정할 수 있으므로 모의 데이터로 테스트
    res.json(mockAptData);
    
    // 아래는 실제 API 호출 코드 (주석 처리)
    /*
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTradeDev?serviceKey=${SERVICE_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&type=json`;
    console.log("요청 URL:", url);
    
    const config = {
      headers: {
        'Accept': 'application/json, application/xml'
      }
    };
    
    const response = await axios.get(url, config);
    console.log("응답 상태 코드:", response.status);
    console.log("응답 헤더:", response.headers);
    
    res.send(response.data);
    */
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

// 프론트엔드에 맞는 형식으로 데이터 제공하는 엔드포인트
app.get("/api/apartments", (req, res) => {
  console.log("아파트 데이터 요청 받음", req.query);
  try {
    // 쿼리에서 필터 옵션 추출
    const { income, assets, investmentType, households, yearBuilt } = req.query;
    
    // 소득과 자산을 숫자로 변환
    const parsedIncome = parseInt(income, 10) || 5000; // 기본값 5000만원
    const parsedAssets = parseInt(assets, 10) || 10000; // 기본값 1억원
    
    console.log(`계산에 사용할 값: 소득=${parsedIncome}만원, 자산=${parsedAssets}만원, 투자유형=${investmentType}, 세대수=${households}, 연식=${yearBuilt}`);
    
    // 2025년 기준 새 공식으로 최대 구매 가능 금액 계산
    let maxLivePrice = 0;
    let maxGapPrice = 0;
    
    // 1. 실거주 계산 (DSR 50%, LTV 70%, 40년 만기, 금리 3.5%)
    const incomeWon = parsedIncome * 10000; // 만원 → 원
    const assetsWon = parsedAssets * 10000; // 만원 → 원
    
    // 연간 상환 가능액 = 연소득 × 0.5 (DSR 50%)
    const annualPayment = incomeWon * 0.5;
    
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
    
    // 여기서는 가장 높은 가능 금액을 계산 (실제 필터링은 아래 formatApartmentData에서 수행)
    maxGapPrice = Math.round((baseGapAmount + 100000 * 10000) / 10000); // 임시로 가장 높은 전세가 1억 가정
    
    console.log(`계산된 최대 구매 가능 금액: 실거주=${maxLivePrice}만원, 갭투자=${maxGapPrice}만원`);
    
    // 개별 아파트에 대한 갭투자 가능 여부를 계산하도록 수정된 로직 적용
    const formattedData = formatApartmentDataWithGap(
      maxLivePrice, 
      baseGapAmount / 10000, // 만원 단위로 전달 
      parsedIncome,
      parsedAssets,
      households, 
      yearBuilt
    );
    
    console.log(`계산된 아파트 수: live=${formattedData.live.length}, gap=${formattedData.gap.length}`);
    
    res.json(formattedData);
  } catch (error) {
    console.error("데이터 포맷팅 오류:", error);
    res.status(500).json({ error: "데이터 처리 실패", message: error.message });
  }
});

// 갭투자까지 고려하여 데이터 필터링 및 포맷팅하는 함수
const formatApartmentDataWithGap = (maxLivePrice = 1000000, baseGapAmount = 1000000, income, assets, household = '', year = '') => {
  const live = [];
  const gap = [];
  
  console.log(`필터링 조건: 최대실거주가격=${maxLivePrice}만원, 기본갭투자능력=${baseGapAmount}만원, 세대수=${household}, 연식=${year}`);
  
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
  
  // 모든 아이템을 무조건 표시하도록 설정 (필터링 조건 무시)
  items.forEach(item => {
    // 가격을 숫자로 변환
    const price = parseInt(item.거래금액, 10);
    const jeonsePrice = parseInt(item.전세가, 10);
    
    const formattedPrice = formatPrice(price);
    const formattedJeonsePrice = formatPrice(jeonsePrice);
    
    // 갭투자 능력 계산 (개별 아파트의 전세가 고려)
    const gapInvestmentPower = calculateGapInvestment(income, assets, jeonsePrice);
    const maxGapPrice = gapInvestmentPower.totalPurchasePower;
    
    const formatted = {
      id: item.id,
      name: item.아파트,
      location: item.법정동,
      size: item.size,
      price: formattedPrice,
      // 추가 필드
      sqm: item.전용면적,
      floor: item.층,
      year: item.건축년도,
      date: `${item.년}-${item.월}-${item.일}`,
      households: item.세대수,
      jeonsePrice: formattedJeonsePrice,
      jeonsePriceValue: jeonsePrice, // 숫자 값으로도 전달
      priceValue: price, // 숫자 아파트 가격
      gapInvestmentPower: maxGapPrice // 해당 아파트에 대한 갭투자 능력
    };
    
    // 실거주/갭투자 구분 (필터링 무시하고 모두 포함)
    const id = parseInt(item.id);
    if (id % 2 === 0) { // 실거주
      live.push(formatted);
    } else { // 갭투자
      gap.push(formatted);
    }
  });
  
  console.log(`필터링 결과: 실거주=${live.length}개, 갭투자=${gap.length}개`);
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
  
  // 총 갭투자 능력 = 신용대출 + 보유자산 + 전세금
  const totalPurchasePower = creditLoan + assetsWon + jeonsePriceWon;
  
  // 결과를 만원 단위로 변환
  return {
    creditLoan: Math.round(creditLoan / 10000),
    jeonse: jeonsePrice,
    totalPurchasePower: Math.round(totalPurchasePower / 10000)
  };
};

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});