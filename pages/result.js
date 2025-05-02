import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/Result.module.css'
import { useFormData } from '../context/FormContext'
import dynamic from 'next/dynamic'

// Lottie 컴포넌트를 클라이언트 사이드에서만 렌더링하도록 설정
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import loadingAnimation from '../public/loading.json'

export default function Result() {
  const router = useRouter()
  const { formData } = useFormData()
  const [activeTab, setActiveTab] = useState('gap')
  const [apartments, setApartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [maxPurchaseAmount, setMaxPurchaseAmount] = useState({ live: 0, gap: 0 })
  
  console.log('Result 페이지 렌더링:', { formData })
  
  // 하드코딩된 아파트 목업 데이터 (fallback으로만 사용)
  const mockApartments = {
    live: [
      {
        id: '0',
        name: '한국아파트',
        location: '성동구 금호동',
        size: '24평',
        price: '13억 7,250만 원'
      },
      {
        id: '1',
        name: '대한아파트',
        location: '강남구 역삼동',
        size: '32평',
        price: '28억 5,000만 원'
      },
      {
        id: '2',
        name: '서울아파트',
        location: '서초구 서초동',
        size: '28평',
        price: '22억 3,500만 원'
      },
      {
        id: '3',
        name: '현대아파트',
        location: '송파구 잠실동',
        size: '35평',
        price: '32억 8,000만 원'
      },
      {
        id: '4',
        name: '삼성아파트',
        location: '마포구 공덕동',
        size: '26평',
        price: '18억 9,500만 원'
      }
    ],
    gap: [
      {
        id: '5',
        name: '롯데아파트',
        location: '용산구 한남동',
        size: '30평',
        price: '25억 2,000만 원'
      },
      {
        id: '6',
        name: 'LG아파트',
        location: '영등포구 여의도동',
        size: '33평',
        price: '30억 1,500만 원'
      },
      {
        id: '7',
        name: 'SK아파트',
        location: '강동구 천호동',
        size: '27평',
        price: '19억 6,000만 원'
      },
      {
        id: '8',
        name: 'KT아파트',
        location: '노원구 상계동',
        size: '29평',
        price: '21억 4,500만 원'
      },
      {
        id: '9',
        name: '포스코아파트',
        location: '관악구 신림동',
        size: '25평',
        price: '16억 8,000만 원'
      }
    ]
  }

  // 뒤로가기
  const handleBack = () => {
    router.push('/filter')
  }

  // 소득·자산 수정 페이지로 이동
  const handleEditIncome = () => {
    router.push('/income')
  }

  // 공유하기
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '내 소득에 딱 맞는 서울 부동산 찾기',
          text: `${formData.nickname || '사용자'}님을 위한 부동산 추천 결과입니다.`,
          url: window.location.href
        })
      } else {
        alert('공유하기 기능을 지원하지 않는 브라우저입니다.')
      }
    } catch (error) {
      console.error('공유하기 오류:', error)
    }
  }

  // 문자열 가격(xx억 xx,xxx만 원)을 반환하는 함수
  const formatPrice = (price) => {
    if (!price) return '0원';
    
    const billion = Math.floor(price / 100000000);
    const million = Math.floor((price % 100000000) / 10000);
    
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

  // 최대 구매 가능 금액 계산 함수
  const calculateMaxPurchaseAmount = (income, assets) => {
    // 소득과 자산을 숫자로 변환
    const parsedIncome = parseInt(income, 10) * 10000 || 0; // 만원 단위를 원 단위로 변환
    const parsedAssets = parseInt(assets, 10) * 10000 || 0; // 만원 단위를 원 단위로 변환
    
    // 금리 설정
    const interestRate = 0.035; // 3.5%
    
    // 갭투자: 신용대출(연소득의 120%) + 보유 자산 + 전세가(가정: 매매가의 70%)
    // 여기서는 간단히 신용대출 + 자산만 계산 (전세가는 개별 아파트에 따라 다르므로 제외)
    const creditLoanAmount = parsedIncome * 1.2;
    const maxGapAmount = parsedAssets + creditLoanAmount;
    
    // 실거주: DSR 40%, 40년 만기, LTV 70% 기준 계산
    // 원리금 균등상환 계산식을 사용하여 대출 가능 금액 계산
    const dsrRatio = 0.4;
    const annualRepayment = parsedIncome * dsrRatio;
    const monthlyRepayment = annualRepayment / 12;
    const monthlyInterestRate = interestRate / 12;
    const loanTermMonths = 40 * 12;
    
    const numerator = Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1;
    const denominator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths);
    
    // 최대 대출 가능 금액
    const maxLoanAmount = monthlyRepayment * numerator / denominator;
    
    // LTV 70% 기준 최대 구매 가능 아파트 가격
    const maxLiveAmount = (maxLoanAmount / 0.7) + parsedAssets;
    
    return {
      live: Math.round(maxLiveAmount),
      gap: Math.round(maxGapAmount)
    };
  };

  // 데이터 로드 (sessionStorage에서 가져옴)
  useEffect(() => {
    // 브라우저에서만 실행
    if (typeof window !== 'undefined') {
      try {
        // sessionStorage에서 데이터 가져오기
        const storedData = sessionStorage.getItem('apartmentsData')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          console.log('세션스토리지에서 데이터 로드:', parsedData)
          setApartments(parsedData[activeTab] || [])
          
          // 계산 파라미터에서 최대 구매 가능 금액 추출
          const params = JSON.parse(sessionStorage.getItem('calculationParams'))
          if (params) {
            setMaxPurchaseAmount({
              live: params.maxAffordablePriceLive || 0,
              gap: params.maxAffordablePriceGap || 0
            })
          } else {
            // 세션 스토리지에 계산 데이터가 없는 경우 직접 계산
            const maxAmounts = calculateMaxPurchaseAmount(formData.income, formData.assets);
            setMaxPurchaseAmount(maxAmounts);
          }
        } else {
          // 저장된 데이터가 없으면 목업 데이터 사용
          console.log('저장된 데이터 없음, 목업 데이터 사용')
          setApartments(mockApartments[activeTab] || [])
          
          // 직접 계산
          const maxAmounts = calculateMaxPurchaseAmount(formData.income, formData.assets);
          setMaxPurchaseAmount(maxAmounts);
        }
      } catch (error) {
        console.error('데이터 로드 오류:', error)
        setApartments(mockApartments[activeTab] || [])
        
        // 오류 발생 시에도 계산 시도
        const maxAmounts = calculateMaxPurchaseAmount(formData.income, formData.assets);
        setMaxPurchaseAmount(maxAmounts);
      }
    }
  }, [activeTab, formData.income, formData.assets])

  // 탭 전환 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // 모달 열기/닫기
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>추천 결과</title>
        <meta name="description" content="내 소득에 딱 맞는 서울 부동산" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.content}>
        <div className={styles.stickyHeader}>
          <div className={styles.headerRow}>
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
            <button 
              className={styles.editIncomeButton}
              onClick={handleEditIncome}
            >
              소득·자산 수정
            </button>
          </div>
          <h1 className={styles.title}>
            <span className={styles.nickname}>{formData.nickname || '사용자'}</span> 님의 소득과 자산,<br />
            투자와 실거주를 모두 고려한<br />
            최적의 아파트목록이에요
          </h1>

          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'gap' ? styles.active : ''}`}
              onClick={() => handleTabChange('gap')}
            >
              갭투자
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'live' ? styles.active : ''}`}
              onClick={() => handleTabChange('live')}
            >
              실거주
            </button>
          </div>
        </div>

        <div className={styles.scrollContent}>
          <div className={styles.maxAmountContainer}>
            <p className={styles.maxAmount}>
              {formatPrice(maxPurchaseAmount[activeTab])}까지 가능해요
              <button className={styles.questionButton} onClick={toggleModal}>
                <Image 
                  src="/ic_question.svg" 
                  alt="도움말" 
                  width={24} 
                  height={24}
                />
              </button>
            </p>
          </div>
          <p className={styles.apartmentCount}>총 {apartments.length}개의 아파트</p>

          {apartments.length > 0 ? (
            <div className={styles.apartmentList}>
              {apartments.map((apartment) => (
                <Link
                  href={`/apartment/${apartment.id}`}
                  key={apartment.id}
                >
                  <div className={styles.apartmentItem}>
                    <h3 className={styles.apartmentTitle}>{apartment.name}</h3>
                    <p className={styles.location}>{apartment.location} · {apartment.size}</p>
                    <p className={styles.price}>{apartment.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyApartmentList}>
              <Image 
                src="/img_aprt_gray.png"
                alt="아파트 없음"
                width={120}
                height={120}
              />
              <p className={styles.emptyMessage}>현재 살 수 있는 아파트가 없어요</p>
            </div>
          )}
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>최대 구매 가능 금액 안내</h3>
              <button className={styles.closeButton} onClick={toggleModal}>
                <Image 
                  src="/close-icon.svg" 
                  alt="닫기" 
                  width={24} 
                  height={24}
                />
              </button>
            </div>
            <div className={styles.modalBody}>
              {activeTab === 'live' ? (
                <div>
                  <p>실거주 시나리오에서의 최대 구매 가능 금액은 다음과 같이 계산됩니다:</p>
                  <ul>
                    <li>DSR 40%: 연 소득의 40%까지 대출 상환에 사용 가능</li>
                    <li>LTV 70%: 주택 가격의 최대 70%까지 대출 가능</li>
                    <li>40년 만기: 장기 모기지론 기준</li>
                    <li>금리 3.5%: 현재 시중 금리 기준</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p>갭투자 시나리오에서의 최대 구매 가능 금액은 다음과 같이 계산됩니다:</p>
                  <ul>
                    <li>신용대출: 연 소득의 120%까지 대출 가능</li>
                    <li>보유 자산: 현금 등 보유 자산 활용</li>
                    <li>전세가: 매매가의 약 70% 수준 가정</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 