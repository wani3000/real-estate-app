import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../../styles/ApartmentDetail.module.css'
import { useFormData } from '../../context/FormContext'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import axios from 'axios'
import Link from 'next/link'

// html2canvas를 클라이언트 사이드에서만 로드합니다
const Html2Canvas = dynamic(() => import('html2canvas'), { ssr: false })

// 폴백용 샘플 데이터
const sampleApartments = [
  { name: '한국아파트', location: '성동구 금호동', size: '24평', price: '13억 7,250' },
  { name: '대한아파트', location: '강남구 역삼동', size: '32평', price: '28억 5,000' },
  { name: '서울아파트', location: '서초구 서초동', size: '28평', price: '22억 3,500' },
  { name: '현대아파트', location: '송파구 잠실동', size: '35평', price: '32억 8,000' },
  { name: '삼성아파트', location: '마포구 공덕동', size: '26평', price: '18억 9,500' },
  { name: '롯데아파트', location: '용산구 한남동', size: '30평', price: '25억 2,000' },
  { name: 'LG아파트', location: '영등포구 여의도동', size: '33평', price: '30억 1,500' },
  { name: 'SK아파트', location: '강동구 천호동', size: '27평', price: '19억 6,000' },
  { name: 'KT아파트', location: '노원구 상계동', size: '29평', price: '21억 4,500' },
  { name: '포스코아파트', location: '관악구 신림동', size: '25평', price: '16억 8,000' },
];

const illustrations = [
  '/img_illustration_01.png',
  '/img_illustration_02.png',
  '/img_illustration_03.png',
  '/img_illustration_04.png'
];

const gradientClasses = [
  styles.illustration1, // 파란색 계열 (#EEF 0%, #FFF 50%, #EEF 100%)
  styles.illustration2, // 주황색 계열 (#FEC69E 0%, #FFF 50%, #FFF0E5 100%)
  styles.illustration3, // 하늘색 계열 (#A6E9FF 0%, #FFF 50%, #DEF7FF 100%)
  styles.illustration4  // 노란색 계열 (#FFE799 0%, #FFF 50%, #FFF5D4 100%)
];

export default function ApartmentDetail() {
  const router = useRouter()
  const { formData } = useFormData()
  const { id } = router.query
  const [apartment, setApartment] = useState(null)
  const [illustrationIndex, setIllustrationIndex] = useState(0)
  const cardRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [allApartments, setAllApartments] = useState([])
  const [gapInvestment, setGapInvestment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('card') // 'card' 또는 'finance'

  useEffect(() => {
    // API 또는 세션스토리지에서 모든 아파트 데이터 가져오기
    const fetchApartmentData = async () => {
      try {
        // 먼저 sessionStorage 확인
        const storedData = sessionStorage.getItem('apartmentsData')
        
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          // live와 gap 배열 합치기
          const combinedApartments = [...parsedData.live, ...parsedData.gap]
          setAllApartments(combinedApartments)
        } else {
          // sessionStorage에 없으면 API 직접 호출
          const response = await axios.get('http://localhost:4000/api/apartments')
          const apiData = response.data
          // live와 gap 배열 합치기
          const combinedApartments = [...apiData.live, ...apiData.gap]
          setAllApartments(combinedApartments)
          
          // 데이터 저장
          sessionStorage.setItem('apartmentsData', JSON.stringify(apiData))
        }
      } catch (error) {
        console.error('아파트 데이터 가져오기 오류:', error)
        // 오류 시 샘플 데이터 사용
        setAllApartments(sampleApartments)
      }
    }
    
    fetchApartmentData()
  }, [])

  useEffect(() => {
    if (id !== undefined && allApartments.length > 0) {
      // id에 해당하는 아파트 찾기
      const apt = allApartments.find(a => a.id === id) || allApartments[0]
      
      if (apt) {
        setApartment(apt)
        
        // id를 4로 나눈 나머지를 사용하여 순차적으로 이미지 표시
        const idNum = parseInt(id) || 0
        setIllustrationIndex(idNum % 4)

        // 갭투자 계산 (전세가가 있는 경우)
        if (apt.jeonsePriceValue) {
          const income = parseInt(formData.income, 10) || 5000; // 기본값 5000만원
          const assets = parseInt(formData.assets, 10) || 10000; // 기본값 1억원
          const jeonsePrice = apt.jeonsePriceValue;
          
          // 갭투자 계산
          calculateGapInvestment(income, assets, jeonsePrice);
        }
      }
    }
    setLoading(false)
  }, [id, allApartments, formData.income, formData.assets])

  const handleBack = () => {
    router.push('/result')
  }

  // 이미지 저장 함수
  const handleSaveImage = async () => {
    if (!cardRef.current || typeof window === 'undefined') return
    
    try {
      setIsLoading(true)
      
      // 카드 영역을 캔버스로 변환
      const canvas = await Html2Canvas(cardRef.current, {
        scale: 2, // 고해상도를 위해 스케일 조정
        useCORS: true, // 외부 이미지 로드를 위한 CORS 활성화
        backgroundColor: null // 투명 배경
      })
      
      // 캔버스를 이미지로 변환
      const image = canvas.toDataURL('image/png')
      
      // 이미지 다운로드 링크 생성
      const link = document.createElement('a')
      link.href = image
      link.download = `${apartment.name}-${new Date().getTime()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setIsLoading(false)
    } catch (error) {
      console.error('이미지 저장 중 오류 발생:', error)
      setIsLoading(false)
      alert('이미지 저장 중 오류가 발생했습니다.')
    }
  }

  // 공유하기 함수
  const handleShare = async () => {
    if (!cardRef.current || typeof window === 'undefined') return
    
    try {
      setIsLoading(true)
      
      // 카드 영역을 캔버스로 변환
      const canvas = await Html2Canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      })
      
      // 캔버스를 Blob으로 변환
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png')
      })
      
      // Web Share API가 지원되는지 확인
      if (navigator.share) {
        await navigator.share({
          title: `${formData.nickname}님을 위한 ${apartment.name}`,
          text: `${apartment.location}에 위치한 ${apartment.name} 정보입니다. 가격: ${apartment.price}`,
          files: [new File([blob], `${apartment.name}.png`, { type: 'image/png' })]
        })
      } else {
        // Web Share API가 지원되지 않는 경우 이미지 다운로드로 대체
        const image = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = `${apartment.name}-${new Date().getTime()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('공유하기가 지원되지 않는 환경입니다. 이미지가 저장되었습니다.')
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('공유하기 중 오류 발생:', error)
      setIsLoading(false)
      alert('공유하기 중 오류가 발생했습니다.')
    }
  }

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
    const result = {
      creditLoan: Math.round(creditLoan / 10000),
      jeonse: jeonsePrice,
      totalPurchasePower: Math.round(totalPurchasePower / 10000)
    };
    
    setGapInvestment(result);
    console.log("갭투자 계산 결과:", result);
    
    return result;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>아파트 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (!apartment) {
    return (
      <div className={styles.errorContainer}>
        <p>아파트 정보를 찾을 수 없습니다.</p>
        <button className={styles.backButton} onClick={handleBack}>
          돌아가기
        </button>
      </div>
    )
  }

  // 가격 숫자로 파싱 (예: "9억 8,000만 원" -> 98000)
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    
    let result = 0;
    const billionMatch = priceStr.match(/(\d+)억/);
    if (billionMatch) {
      result += parseInt(billionMatch[1], 10) * 10000;
    }
    
    const millionMatch = priceStr.match(/(\d+(?:,\d+)*)만/);
    if (millionMatch) {
      const millionStr = millionMatch[1].replace(/,/g, '');
      result += parseInt(millionStr, 10);
    }
    
    return result;
  };

  // 원 형식으로 포맷
  const formatKRW = (price) => {
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
  };
  
  // 위치 정보 추출
  const location = apartment.location || '';
  const locationParts = location.split(' ');
  const gu = locationParts[0] || '';
  const dong = locationParts[1] || '';

  // 그라데이션 클래스 가져오기
  const gradientClass = gradientClasses[illustrationIndex];

  return (
    <div className={styles.container}>
      <Head>
        <title>{apartment.name} | 아파트 상세</title>
        <meta name="description" content={`${apartment.name} 상세 정보`} />
      </Head>

      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={handleBack}
        >
          <Image 
            src="/back-arrow.svg" 
            alt="뒤로가기" 
            width={24} 
            height={24}
          />
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabContainer}>
        <div className={styles.tabMenu}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'card' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('card')}
          >
            카드
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'finance' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            자금계획
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'card' && (
          <div className={styles.cardTabContent}>
            {/* 공유 카드 */}
            <div className={styles.cardWrapper} ref={cardRef}>
              <div className={`${styles.card} ${gradientClass}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <p className={styles.titleText}>{formData.nickname || '고객'} 님이</p>
                    <p className={styles.titleText}>살 수 있는 아파트는</p>
                  </div>
                </div>
                <div className={styles.illustrationContainer}>
                  <Image 
                    src={illustrations[illustrationIndex]}
                    alt="아파트 일러스트"
                    width={302}
                    height={182}
                    style={{ 
                      objectFit: 'contain',
                      width: '100%',
                      height: '182px'
                    }}
                    priority
                  />
                </div>
                <div className={styles.textContent}>
                  <h2 className={styles.location}>{apartment.name}</h2>
                  <p className={styles.district}>{gu} {dong}</p>
                  <p className={styles.price}>{apartment.price}</p>
                </div>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button 
                className={styles.saveButton} 
                onClick={handleSaveImage}
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '이미지 저장'}
              </button>
              <button 
                className={styles.shareButton}
                onClick={handleShare}
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '공유하기'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className={styles.financeTabContent}>
            {/* 아파트 정보 컨테이너 추가 */}
            <div className={styles.apartmentInfoContainer}>
              <h2 className={styles.apartmentName}>{apartment.name}</h2>
              <p className={styles.apartmentLocation}>{gu} {dong}</p>
              <p className={styles.apartmentPrice}>{apartment.price}</p>
            </div>
            
            {/* 아파트 상세 정보 */}
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>아파트 정보</h3>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>면적</span>
                  <span className={styles.detailValue}>{apartment.size} ({apartment.sqm}㎡)</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>건축년도</span>
                  <span className={styles.detailValue}>{apartment.year}년</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>층수</span>
                  <span className={styles.detailValue}>{apartment.floor}층</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>세대수</span>
                  <span className={styles.detailValue}>{apartment.households}세대</span>
                </div>
                {apartment.jeonsePrice && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>전세가</span>
                    <span className={styles.detailValue}>{apartment.jeonsePrice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 갭투자 시뮬레이션 섹션 (전세가가 있는 경우) */}
            {gapInvestment && (
              <div className={styles.gapInvestmentSection}>
                <h3 className={styles.sectionTitle}>자금계획</h3>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>신용대출</span>
                    <span className={styles.detailValue}>{formatKRW(gapInvestment.creditLoan)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>전세금</span>
                    <span className={styles.detailValue}>{formatKRW(gapInvestment.jeonse)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>보유자산</span>
                    <span className={styles.detailValue}>{formatKRW(parseInt(formData.assets, 10) || 10000)}</span>
                  </div>
                  <div className={`${styles.detailItem} ${styles.totalItem}`}>
                    <span className={styles.detailLabel}>총 투자 가능액</span>
                    <span className={styles.detailValue}>{formatKRW(gapInvestment.totalPurchasePower)}</span>
                  </div>
                </div>
                <p className={styles.gapInvestmentNote}>* 연소득의 120% 대출, 전세금, 보유자산을 활용한 시뮬레이션입니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 