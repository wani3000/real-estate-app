import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/common.module.css'
import { useState } from 'react'
import { useFormData } from '../context/FormContext'

export default function Nickname() {
  const router = useRouter()
  const { formData, updateFormData } = useFormData()
  const [nickname, setNickname] = useState(formData.nickname)

  const handleNicknameChange = (e) => {
    const value = e.target.value
    setNickname(value)
  }

  const handleNext = () => {
    updateFormData('nickname', nickname)
    router.push('/income')
  }

  const handleBack = () => {
    router.push('/')
  }

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
          닉네임을 알려주세요
        </h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>닉네임</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={handleNicknameChange}
            />
          </div>
        </div>
      </main>

      <div className={styles.buttonContainer}>
        <button 
          className={styles.button}
          onClick={handleNext}
          disabled={!nickname.trim()}
        >
          다음
        </button>
      </div>
    </div>
  )
} 