import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../../styles/ApartmentDetail.module.css'
import { useFormData } from '../../context/FormContext'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

// html2canvas를 클라이언트 사이드에서만 로드합니다
const Html2Canvas = dynamic(() => import('html2canvas'), { ssr: false })

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

export default function ApartmentDetail() {
  const router = useRouter()
  const { formData } = useFormData()
  const { id } = router.query
  const [apartment, setApartment] = useState(null)
  const [illustrationIndex, setIllustrationIndex] = useState(0)
  const cardRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (id !== undefined) {
      // id를 4로 나눈 나머지를 사용하여 순차적으로 이미지 표시
      const idNum = parseInt(id) || 0
      setIllustrationIndex(idNum % 4)
      
      // 목업 데이터에서 아파트 정보 가져오기
      const apt = sampleApartments[idNum % sampleApartments.length]
      if (apt) {
        setApartment(apt)
      }
    }
  }, [id])

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
          text: `${apartment.location}에 위치한 ${apartment.name} 정보입니다. 가격: ${apartment.price}만 원`,
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

  if (!apartment) {
    return null
  }

  const [gu, dong] = apartment.location.split(' ')

  return (
    <div className={styles.container}>
      <Head>
        <title>{apartment.name} - 부동산 추천</title>
        <meta name="description" content={`${apartment.location}의 ${apartment.name}, 가격: ${apartment.price}`} />
      </Head>
      
      <header className={styles.header}>
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
      </header>

      <main className={styles.main}>
        <div 
          ref={cardRef} 
          className={`${styles.card} ${styles[`illustration${illustrationIndex + 1}`]}`}
        >
          <h1 className={styles.title}>
            {formData.nickname} 님이<br />
            살 수 있는 아파트는
          </h1>

          <div className={styles.apartmentInfo}>
            <div className={styles.cityImage}>
              <Image
                src={illustrations[illustrationIndex]}
                alt="도시 일러스트"
                width={302}
                height={180}
                priority
              />
            </div>
            <div className={styles.textContent}>
              <h2 className={styles.location}>{apartment.name}</h2>
              <p className={styles.district}>{gu} {dong}</p>
              <p className={styles.price}>{apartment.price}만 원</p>
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
      </main>
    </div>
  )
} 