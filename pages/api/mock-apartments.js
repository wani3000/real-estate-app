// 목업 아파트 데이터 (API 호출이 실패했을 때를 대비)
const mockApartments = [
  {
    id: '0',
    name: '래미안아파트',
    location: '강남구 삼성동',
    size: '32평',
    price: '13억 7,250',
    rawPrice: 1372500000,
    buildYear: 2010,
    age: 13,
    floor: '15',
    date: '2023-12-10',
    households: 1250,
    jeonsePrice: 960750000 // 매매가의 약 70%
  },
  {
    id: '1',
    name: '반포자이',
    location: '서초구 반포동',
    size: '39평',
    price: '28억 5,000',
    rawPrice: 2850000000,
    buildYear: 2008,
    age: 15,
    floor: '12',
    date: '2023-12-15',
    households: 1680,
    jeonsePrice: 1995000000 // 매매가의 약 70%
  },
  {
    id: '2',
    name: '롯데캐슬',
    location: '송파구 잠실동',
    size: '29평',
    price: '22억 3,500',
    rawPrice: 2235000000,
    buildYear: 2005,
    age: 18,
    floor: '8',
    date: '2023-12-05',
    households: 950,
    jeonsePrice: 1564500000 // 매매가의 약 70%
  },
  {
    id: '3',
    name: '프라임아파트',
    location: '강동구 천호동',
    size: '24평',
    price: '18억 9,500',
    rawPrice: 1895000000,
    buildYear: 2014,
    age: 9,
    floor: '10',
    date: '2023-12-08',
    households: 580,
    jeonsePrice: 1326500000 // 매매가의 약 70%
  },
  {
    id: '4',
    name: '서강레미안',
    location: '마포구 서교동',
    size: '27평',
    price: '16억 8,000',
    rawPrice: 1680000000,
    buildYear: 2012,
    age: 11,
    floor: '7',
    date: '2023-12-20',
    households: 420,
    jeonsePrice: 1176000000 // 매매가의 약 70%
  },
  {
    id: '5',
    name: '한남더힐',
    location: '용산구 한남동',
    size: '43평',
    price: '32억 8,000',
    rawPrice: 3280000000,
    buildYear: 2011,
    age: 12,
    floor: '18',
    date: '2023-12-18',
    households: 780,
    jeonsePrice: 2296000000 // 매매가의 약 70%
  },
  {
    id: '6',
    name: '행당동아',
    location: '성동구 행당동',
    size: '22평',
    price: '19억 6,000',
    rawPrice: 1960000000,
    buildYear: 2001,
    age: 22,
    floor: '9',
    date: '2023-12-14',
    households: 320,
    jeonsePrice: 1372000000 // 매매가의 약 70%
  },
  {
    id: '7',
    name: '자양미소지움',
    location: '광진구 자양동',
    size: '25평',
    price: '25억 2,000',
    rawPrice: 2520000000,
    buildYear: 2017,
    age: 6,
    floor: '11',
    date: '2023-12-19',
    households: 460,
    jeonsePrice: 1764000000 // 매매가의 약 70%
  },
  {
    id: '8',
    name: '상계푸르지오',
    location: '노원구 상계동',
    size: '30평',
    price: '21억 4,500',
    rawPrice: 2145000000,
    buildYear: 2015,
    age: 8,
    floor: '14',
    date: '2023-12-12',
    households: 1120,
    jeonsePrice: 1501500000 // 매매가의 약 70%
  },
  {
    id: '9',
    name: '녹번SK뷰',
    location: '은평구 녹번동',
    size: '26평',
    price: '30억 1,500',
    rawPrice: 3015000000,
    buildYear: 2018,
    age: 5,
    floor: '6',
    date: '2023-12-13',
    households: 380,
    jeonsePrice: 2110500000 // 매매가의 약 70%
  }
];

export default function handler(req, res) {
  // 간단한 지연을 추가하여 실제 API처럼 느껴지게 합니다
  setTimeout(() => {
    res.status(200).json({
      apartments: mockApartments,
      total: mockApartments.length
    });
  }, 800);
} 