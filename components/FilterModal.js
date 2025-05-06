import styles from './FilterModal.module.css'
import { useFormData } from '../context/FormContext'
import { useState, useEffect } from 'react'

export default function FilterModal({ 
  isOpen, 
  onClose, 
  type, 
  title 
}) {
  const { formData, updateFormData } = useFormData()
  const [selectedValue, setSelectedValue] = useState(type === 'household' ? '300세대 이상' : '15년 이내')

  useEffect(() => {
    // 모달이 열릴 때마다 현재 formData의 값으로 selectedValue 업데이트
    if (isOpen) {
      setSelectedValue(type === 'household' ? formData.household : formData.year)
    }
  }, [isOpen, type, formData])

  const householdOptions = [
    { value: '전체', label: '전체' },
    { value: '100세대 이상', label: '100세대 이상' },
    { value: '300세대 이상', label: '300세대 이상' },
    { value: '500세대 이상', label: '500세대 이상' },
    { value: '1000세대 이상', label: '1000세대 이상' },
    { value: '3000세대 이상', label: '3000세대 이상' },
    { value: '5000세대 이상', label: '5000세대 이상' },
  ]

  const yearOptions = [
    { value: '전체', label: '전체' },
    { value: '3년 이내', label: '3년 이내' },
    { value: '5년 이내', label: '5년 이내' },
    { value: '10년 이내', label: '10년 이내' },
    { value: '15년 이내', label: '15년 이내' },
    { value: '25년 이상', label: '25년 이상' },
    { value: '30년 이상', label: '30년 이상' },
  ]

  const options = type === 'household' ? householdOptions : yearOptions

  const handleSelect = (value) => {
    setSelectedValue(value)
  }

  const handleConfirm = () => {
    updateFormData(type, selectedValue)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.chipContainer}>
            {options.map((option) => (
              <button
                key={option.value}
                className={`${styles.chip} ${selectedValue === option.value ? styles.selected : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  )
} 