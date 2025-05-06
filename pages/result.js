import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styles from '../styles/Result.module.css'
import { useFormData } from '../context/FormContext'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { getApiUrl, API_ENDPOINTS } from "../utils/api";

// Lottie 컴포넌트를 클라이언트 사이드에서만 렌더링하도록 설정
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import loadingAnimation from '../public/loading.json'

export default function Result() {
  const router = useRouter()
  const { formData } = useFormData()
  const [activeTab, setActiveTab] = useState('gap')
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [maxPurchaseAmount, setMaxPurchaseAmount] = useState({ live: 0, gap: 0 })
  const [apiError, setApiError] = useState(false)
  
  console.log('Result 페이지 렌더링:', { formData })

  // 최대 구매 가능 금액 계산 함수
  const calculateMaxPurchaseAmount = (income, assets) => {
    // 소득과 자산을 숫자로 변환 (빈 값이면 기본값 사용)
    const parsedIncome = parseInt(income, 10) || 5000; // 기본값 5000만원
    const parsedAssets = parseInt(assets, 10) || 10000; // 기본값 1억원
    
    console.log(`소득: ${parsedIncome}만원, 자산: ${parsedAssets}만원으로 최대 구매 가능 금액 계산 중`);
    
    // 소득과 자산을 원 단위로 변환
    const incomeWon = parsedIncome * 10000; // 만원 단위를 원 단위로 변환
    const assetsWon = parsedAssets * 10000; // 만원 단위를 원 단위로 변환
    
    // 금리 설정
    const interestRate = 0.035; // 3.5%
    
    // 1. 실거주 계산: DSR 50%, 40년 만기, LTV 70% 기준 계산 (2025년 기준)
    // 원리금 균등상환 상환계수 0.0493 (3.5% 금리, 40년 기준)
    const dsrRatio = 0.5; // DSR 50%
    const annualPaymentRatio = 0.0493; // 상환계수
    
    // 연간 상환 가능액 = 연소득 × 0.5
    const annualPayment = incomeWon * dsrRatio;
    
    // 대출 가능 금액 = 연간 상환 가능액 ÷ 상환계수(0.0493)
    const maxLoanAmount = annualPayment / annualPaymentRatio;
    
    // LTV 제한 적용 금액 = 대출 가능 금액 ÷ 0.7
    const ltvLimitAmount = maxLoanAmount / 0.7;
    
    // 최대 구매 가능 금액 = min(LTV 제한 적용 금액, 대출 가능 금액 + 보유금액)
    const maxLiveAmount = Math.min(ltvLimitAmount, maxLoanAmount + assetsWon);
    
    // 2. 갭투자 계산 
    // 신용대출(연소득의 120%)
    const creditLoanAmount = incomeWon * 1.2;
    
    // 기본 계산식 (최대 구매 가능 금액 추정용)
    // 실제로는 전세가를 API에서 가져와 사용하는 것이 정확함
    // 전세가를 아파트별로 적용하려면 백엔드에서 처리해야 함
    const maxGapAmount = creditLoanAmount + assetsWon; // 여기에 전세가를 더해야 함
    
    // 원 단위를 만원 단위로 변환 (계산 결과를 만원 단위로 반환)
    const maxLiveAmountInManWon = Math.round(maxLiveAmount / 10000);
    const maxGapAmountInManWon = Math.round(maxGapAmount / 10000);
    
    console.log(`계산된 최대 구매 가능 금액: 실거주=${maxLiveAmountInManWon}만원, 갭투자=${maxGapAmountInManWon}만원(전세가 제외)`);
    
    return {
      live: maxLiveAmountInManWon,
      gap: maxGapAmountInManWon
    };
  };

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

  // 데이터 로드
  useEffect(() => {
    // 브라우저에서만 실행
    if (typeof window !== 'undefined') {
      try {
        // 소득 자산 기본값 설정 (없는 경우)
        if (!formData.income) {
          formData.income = '5000'; // 기본 소득 5000만원
        }
        if (!formData.assets) {
          formData.assets = '10000'; // 기본 자산 1억원
        }

        // 최대 구매 가능 금액 계산
        const maxAmounts = calculateMaxPurchaseAmount(formData.income, formData.assets);
        setMaxPurchaseAmount(maxAmounts);
        
        // 백엔드 API에서 아파트 데이터 가져오기
        const fetchApartmentsData = async () => {
          setLoading(true);
          try {
            // FormData에서 소득과 자산 값 가져오기
            const income = parseInt(formData.income, 10) || 5000; // 기본값 5000만원
            const assets = parseInt(formData.assets, 10) || 10000; // 기본값 1억원
            
            // 실제 금액 값과 필터 조건 설정
            const params = {
              mode: activeTab,
              income: income,
              cash: assets,
              lawdCd: formData.region || '전체',
              dealYmd: '202404'
            };
            
            console.log('API 호출 파라미터:', params);
            
            // recommend API 호출
            try {
              console.log('API 호출 시작:', getApiUrl(API_ENDPOINTS.RECOMMEND));
              const recommendResponse = await axios.get(getApiUrl(API_ENDPOINTS.RECOMMEND), { 
                params,
                timeout: 10000 // 10초 타임아웃 설정
              });
              
              console.log('추천 API 응답 상태:', recommendResponse.status);
              console.log('추천 API 응답 데이터:', recommendResponse.data ? '데이터 있음' : '데이터 없음');
              
              if (recommendResponse.data && recommendResponse.data.result && recommendResponse.data.result.length > 0) {
                // API 응답 데이터 변환
                const formattedData = recommendResponse.data.result.map(apt => ({
                  id: apt.id || String(Math.random()).slice(2, 10),
                  name: apt.아파트,
                  location: apt.법정동,
                  size: apt.size || `${Math.round(apt.전용면적 / 3.3)}평`,
                  price: `${Math.floor(parseInt(apt.거래금액) / 10000)}억 ${parseInt(apt.거래금액) % 10000 > 0 ? parseInt(apt.거래금액) % 10000 + '만 ' : ''}원`,
                  priceValue: parseInt(apt.거래금액),
                  sqm: apt.전용면적,
                  floor: apt.층,
                  year: apt.건축년도,
                  date: `${apt.년}-${apt.월}-${apt.일}`,
                  households: apt.세대수,
                  jeonsePrice: apt.전세가 ? `${Math.floor(parseInt(apt.전세가) / 10000)}억 ${parseInt(apt.전세가) % 10000 > 0 ? parseInt(apt.전세가) % 10000 + '만 ' : ''}원` : '정보 없음',
                  jeonsePriceValue: parseInt(apt.전세가) || 0
                }));
                
                console.log('포맷된 데이터:', formattedData);
                setApartments(formattedData);
                setApiError(false);
                
                // 세션 스토리지에 데이터 저장
                const storageData = {
                  live: activeTab === 'live' ? formattedData : [],
                  gap: activeTab === 'gap' ? formattedData : []
                };
                sessionStorage.setItem('apartmentsData', JSON.stringify(storageData));
              } else {
                // 응답은 성공했지만 데이터가 없는 경우
                console.warn('API 응답에 아파트 데이터가 없습니다');
                setApiError(true);
              }
            } catch (error) {
              console.error('API 호출 오류:', error);
              setApiError(true);
            } finally {
              setLoading(false);
            }
          } catch (error) {
            console.error('데이터 로드 오류:', error);
            setLoading(false);
            setApiError(true);
          }
        };
        
        fetchApartmentsData();
      } catch (error) {
        console.error('데이터 로드 오류:', error);
        setLoading(false);
        setApiError(true);
      }
    }
  }, [formData, activeTab]);
  
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

  // 탭 변경 처리
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // 모달 토글
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
              {formatPrice(maxPurchaseAmount[activeTab] * 10000)}까지 가능해요
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

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <p>부동산 정보를 불러오는 중...</p>
            </div>
          ) : apiError ? (
            <div className={styles.errorContainer}>
              <p>데이터를 불러오지 못했습니다</p>
              <button onClick={() => window.location.reload()} className={styles.retryButton}>
                다시 시도
              </button>
            </div>
          ) : apartments.length > 0 ? (
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