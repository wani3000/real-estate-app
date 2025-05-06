import Head from 'next/head'
import { useEffect } from 'react'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import styles from '../styles/common.module.css'

// Lottie 컴포넌트를 클라이언트 사이드에서만 렌더링하도록 설정
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import loadingAnimation from '../public/loading.json'

export default function Loading() {
  const router = useRouter()
  
  // 하드코딩된 아파트 목업 데이터
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

  // 데이터 로딩 및 5초 후 결과 페이지로 이동
  useEffect(() => {
    // API 호출 및 데이터 준비
    const prepareData = async () => {
      try {
        // 쿼리 파라미터 가져오기
        const income = router.query.income || 0;
        const assets = router.query.assets || 0;
        const investmentType = router.query.investmentType || 'live';
        
        // FormContext에 저장된 값을 가져오거나 쿼리 파라미터 사용
        let households = '';
        let yearBuilt = '';
        
        try {
          // sessionStorage에서 formData 정보 확인
          const storedFormData = JSON.parse(sessionStorage.getItem('formData'));
          if (storedFormData) {
            households = storedFormData.household || '';
            yearBuilt = storedFormData.year || '';
          }
        } catch (err) {
          console.error('세션 스토리지 파싱 오류:', err);
        }
        
        // 세션에 없으면 쿼리 파라미터나 기본값 사용
        households = households || router.query.households || '';
        yearBuilt = yearBuilt || router.query.yearBuilt || '';
        
        console.log('Loading 페이지에서 데이터 준비 중:', { 
          income, assets, investmentType, households, yearBuilt 
        });
        
        try {
          // 새로 구현한 API 엔드포인트 호출
          const apiUrl = `/api/apartments?income=${income}&assets=${assets}&investmentType=${investmentType}&households=${encodeURIComponent(households)}&yearBuilt=${encodeURIComponent(yearBuilt)}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data && data.success && data.apartments) {
            // API 데이터 저장
            sessionStorage.setItem('apartmentsData', JSON.stringify(data.apartments));
            sessionStorage.setItem('calculationParams', JSON.stringify(data.calculationParams));
            console.log('API에서 아파트 데이터 로드 완료:', data);
          } else {
            // API 실패 시 목업 데이터 사용
            sessionStorage.setItem('apartmentsData', JSON.stringify(mockApartments));
            console.log('API 실패, 목업 데이터 사용');
          }
        } catch (error) {
          console.error('API 호출 오류:', error);
          // 오류 발생 시 목업 데이터 사용
          sessionStorage.setItem('apartmentsData', JSON.stringify(mockApartments));
          console.log('API 오류, 목업 데이터 사용');
        }
        
        // 상세 페이지용 세션스토리지 저장 (필요 시 사용)
        const allApartments = [];
        try {
          const storedData = sessionStorage.getItem('apartmentsData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.live) allApartments.push(...parsedData.live);
            if (parsedData.gap) allApartments.push(...parsedData.gap);
          }
        } catch (err) {
          console.error('저장된 데이터 처리 오류:', err);
          // 오류 시 모의 데이터 사용
          allApartments.push(...mockApartments.live, ...mockApartments.gap);
        }
        
        // 모든 아파트 데이터 저장
        sessionStorage.setItem('recommendedApartments', JSON.stringify(allApartments));
      } catch (err) {
        console.error('데이터 준비 오류:', err);
        sessionStorage.setItem('apartmentsData', JSON.stringify(mockApartments));
      }
    }

    // 데이터 준비 실행
    prepareData();
    
    // 5초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      router.push('/result');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  // Google AdSense 광고 초기화
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>아파트 찾는 중...</title>
        <meta name="description" content="최적의 아파트를 찾고 있어요" />
        <link rel="icon" href="/favicon.ico" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR-CLIENT-ID"
          crossOrigin="anonymous"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.loadingContent}>
          <div className={styles.lottieContainer}>
            <Lottie 
              animationData={loadingAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 250, height: 250, marginBottom: '-20px' }}
            />
          </div>
          <p className={styles.loadingText}>
            투자와 실거주 모두 고려한<br />
            서울 아파트를 찾고 있어요
          </p>
        </div>

        {/* Google AdSense 광고 */}
        <div className={styles.adContainer}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="YOUR-CLIENT-ID"
            data-ad-slot="YOUR-AD-SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </main>
    </div>
  );
} 