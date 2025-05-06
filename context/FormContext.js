import { createContext, useContext, useState } from 'react'

const FormContext = createContext()

const householdDescriptions = {
  '전체': '세대수에 상관없이 모든 아파트를 확인할 수 있어요.',
  '100세대 이상': '100세대 이상은 기본적인 단지 형태를 갖춘 아파트예요.',
  '300세대 이상': '300세대 이상 아파트는 관리 효율이 높고 거래가 활발해 실거주와 투자 모두에 적합해요.',
  '500세대 이상': '500세대 이상은 커뮤니티 시설과 단지 자립도가 높아 실수요 선호도가 높아요.',
  '1000세대 이상': '1,000세대 이상은 랜드마크 단지로 주목받기 쉬워 자산가치가 안정적이에요.',
  '3000세대 이상': '3,000세대 이상은 지역 대표 대단지로 시세를 주도하는 중심 단지예요.',
  '5000세대 이상': '5,000세대 이상은 희소한 초대형 단지로 브랜드 가치와 유동성이 뛰어나요.'
}

const yearDescriptions = {
  '전체': '입주 시점에 관계없이 모든 아파트를 확인할 수 있어요.',
  '3년 이내': '3년 이내 아파트는 최신 설계와 마감재를 갖춘 신축 단지예요.',
  '5년 이내': '5년 이내 아파트는 신축 프리미엄과 실입주 선호도가 모두 높은 구간이에요.',
  '10년 이내': '10년 이내는 실거주 만족도와 관리상태가 균형 잡힌 준신축이에요.',
  '15년 이내': '15년 이내 아파트는 상품성과 전세 수요가 안정적이라 실거주와 투자 모두에 적합해요.',
  '25년 이상': '25년 이상은 리모델링이나 재건축 가능성이 생기기 시작하는 구간이에요.',
  '30년 이상': '30년 이상은 재건축 기대감이 있는 노후 단지로 장기 투자 검토 대상이에요.'
}

export function FormProvider({ children }) {
  const [formData, setFormData] = useState({
    nickname: '',
    income: '',
    assets: '',
    household: '300세대 이상',
    year: '15년 이내',
    householdDescription: householdDescriptions['300세대 이상'],
    yearDescription: yearDescriptions['15년 이내']
  })

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'household' && { householdDescription: householdDescriptions[value] }),
      ...(field === 'year' && { yearDescription: yearDescriptions[value] })
    }))
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData, setFormData }}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormData() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormData must be used within a FormProvider')
  }
  return context
} 