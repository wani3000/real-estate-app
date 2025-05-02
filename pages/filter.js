import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Filter.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFormData } from '../context/FormContext'
import FilterModal from '../components/FilterModal'

export default function Filter() {
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false)
  const [isYearModalOpen, setIsYearModalOpen] = useState(false)
  const router = useRouter()
  const { formData } = useFormData()
  const { nickname, income, assets } = router.query
  
  const [investmentType, setInvestmentType] = useState('live')
  const [households, setHouseholds] = useState('')
  const [yearBuilt, setYearBuilt] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)
  
  useEffect(() => {
    if (!router.isReady) return
    
    console.log('Filter 페이지 라우터 준비됨:', { 
      query: router.query,
      formData
    })
    
    if (router.query.investmentType) {
      setInvestmentType(router.query.investmentType)
    }
    if (router.query.households) {
      setHouseholds(router.query.households)
    }
    if (router.query.yearBuilt) {
      setYearBuilt(router.query.yearBuilt)
    }
  }, [router.isReady, router.query, formData])
  
  useEffect(() => {
    const isValid = true // 항상 활성화 상태로 변경
    setIsFormValid(isValid)
    
    console.log('폼 유효성 검사:', { 
      formDataValues: { 
        nickname: formData.nickname, 
        income: formData.income, 
        assets: formData.assets 
      },
      queryValues: { nickname, income, assets },
      isValid: isValid
    })
  }, [formData, nickname, income, assets])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('loading 페이지로 이동', { 
      nickname: formData.nickname || nickname || '기본값',
      income: formData.income || income || '기본값',
      assets: formData.assets || assets || '기본값',
      investmentType
    })
    
    router.push('/loading')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>필터 설정</title>
        <meta name="description" content="부동산 필터 설정" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => router.back()}
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
        <h1 className={styles.title}>
          투자와 실거주를 고려한<br />
          최적의 아파트를 검색해요
        </h1>

        <div className={styles.filterSection}>
          <div className={styles.filterItem}>
            <div className={styles.filterTitleBox}>
              <span className={styles.filterTitle}>세대수</span>
              <button 
                className={styles.editButton}
                onClick={() => setIsHouseholdModalOpen(true)}
              >
                편집하기
                <Image
                  src="/ic_arrow_right_gray.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
              </button>
            </div>
            <div className={styles.filterBox}>
              <h3 className={styles.filterValue}>{formData.household}</h3>
              <p className={styles.filterDescription}>
                {formData.householdDescription}
              </p>
            </div>
          </div>

          <div className={styles.filterItem}>
            <div className={styles.filterTitleBox}>
              <span className={styles.filterTitle}>입주년차</span>
              <button 
                className={styles.editButton}
                onClick={() => setIsYearModalOpen(true)}
              >
                편집하기
                <Image
                  src="/ic_arrow_right_gray.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
              </button>
            </div>
            <div className={styles.filterBox}>
              <h3 className={styles.filterValue}>{formData.year}</h3>
              <p className={styles.filterDescription}>
                {formData.yearDescription}
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.button}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          찾아주세요
        </button>
      </div>

      <FilterModal
        isOpen={isHouseholdModalOpen}
        onClose={() => setIsHouseholdModalOpen(false)}
        type="household"
        title="세대수"
      />

      <FilterModal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        type="year"
        title="입주년차"
      />
    </div>
  )
} 