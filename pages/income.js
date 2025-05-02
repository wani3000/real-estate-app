import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/common.module.css'
import { useFormData } from '../context/FormContext'

export default function Income() {
  const router = useRouter()
  const { formData, updateFormData } = useFormData()
  const [income, setIncome] = useState(formData.income)
  const [assets, setAssets] = useState(formData.assets)

  const formatNumber = (value) => {
    const number = value.replace(/[^0-9]/g, '')
    if (number === '') return ''
    return new Intl.NumberFormat('ko-KR').format(number)
  }

  const convertToKoreanCurrency = (value) => {
    if (!value) return ''
    const num = parseInt(value.replace(/,/g, ''))
    if (isNaN(num)) return ''
    
    if (num >= 10000) {
      const uk = Math.floor(num / 10000)
      const man = num % 10000
      if (man === 0) {
        return `${uk}억 원`
      } else {
        return `${uk}억 ${man.toLocaleString()}만 원`
      }
    } else {
      return `${num.toLocaleString()}만 원`
    }
  }

  const handleIncomeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value === '' || /^\d+$/.test(value)) {
      setIncome(value)
      updateFormData('income', value)
    }
  }

  const handleAssetsChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value === '' || /^\d+$/.test(value)) {
      setAssets(value)
      updateFormData('assets', value)
    }
  }

  const handleBack = () => {
    router.push('/nickname')
  }

  const handleNext = () => {
    console.log('다음 버튼 클릭됨:', { income, assets, formData });
    
    // 정수 변환 전에 값이 비어있는지 먼저 확인
    if (!income || !assets) {
      console.error('소득 또는 자산이 입력되지 않았습니다.');
      return;
    }
    
    // 음수 체크 (formatNumber 함수에서 이미 숫자만 입력받기 때문에 필요 없을 수 있음)
    if (parseInt(income) < 0 || parseInt(assets) < 0) {
      console.error('소득과 자산은 음수가 될 수 없습니다.');
      return;
    }

    // formData에 값을 저장
    updateFormData('income', income);
    updateFormData('assets', assets);
    
    console.log('필터 페이지로 이동:', { 
      nickname: formData.nickname, 
      income, 
      assets 
    });
    
    // 페이지 이동 시도
    router.push('/filter');
  }

  const isFormValid = income !== '' && assets !== ''

  return (
    <div className={styles.container}>
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
        <h1 className={styles.title}>
          내 연 소득과 현재 보유자산이<br />
          얼마인가요?
        </h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>연소득 (만 원)</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="10000"
              value={formatNumber(income)}
              onChange={handleIncomeChange}
            />
            <span className={styles.unit}>만 원</span>
          </div>
          {income && (
            <span className={styles.helpText}>{convertToKoreanCurrency(income)}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>현재 보유자산 (만 원)</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="10000"
              value={formatNumber(assets)}
              onChange={handleAssetsChange}
            />
            <span className={styles.unit}>만 원</span>
          </div>
          {assets && (
            <span className={styles.helpText}>{convertToKoreanCurrency(assets)}</span>
          )}
        </div>
      </main>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.button}
          disabled={!isFormValid}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  )
} 