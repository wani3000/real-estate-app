import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import { useFormData } from '../context/FormContext';

export default function Header() {
  const router = useRouter();
  const { setFormData } = useFormData();

  const handleBack = () => {
    const currentPath = router.pathname;
    
    switch (currentPath) {
      case '/result':
        router.replace('/filter');
        break;
      case '/filter':
        router.replace('/income');
        break;
      case '/income':
        router.replace('/nickname');
        break;
      case '/nickname':
        router.replace('/');
        break;
      default:
        router.back();
    }
  };

  const handleEditIncome = () => {
    // FormData 초기화 (소득과 자산 관련 데이터만)
    setFormData(prevData => ({
      ...prevData,
      income: '',
      assets: '',
      // 다른 소득/자산 관련 필드가 있다면 여기에 추가
    }));
    router.push('/income');
  };

  const showEditButton = router.pathname === '/result';

  return (
    <header className={styles.header}>
      <button 
        className={styles.backButton}
        onClick={handleBack}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#212529" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {showEditButton && (
        <button 
          className={styles.editIncomeButton}
          onClick={handleEditIncome}
        >
          소득·자산 수정
        </button>
      )}
    </header>
  );
} 