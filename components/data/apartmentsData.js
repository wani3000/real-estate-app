const apartments = [
  {
    name: "삼성아파트",
    location: "서울시 강남구",
    size: 84,
    price: 120000,
    builtYear: 2005,
    floor: 10,
    households: 500,
    jeonsePrice: 60000 // <-- Added field
  },
  {
    name: "한강타워",
    location: "서울시 용산구",
    size: 100,
    price: 150000,
    builtYear: 2010,
    floor: 15,
    households: 300,
    jeonsePrice: 80000
  },
  // other apartment objects...
];

// Example gap 투자 계산 함수 referencing jeonsePrice
function calculateGapInvestment(apartment) {
  const gap = apartment.price - apartment.jeonsePrice;
  const isAffordable = gap < 50000; // example threshold
  return { gap, isAffordable };
}

export { apartments, calculateGapInvestment }; 