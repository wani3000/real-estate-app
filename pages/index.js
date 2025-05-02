import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const images = [1, 2, 3, 4]
  const repeatedImages = [...images, ...images, ...images]

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '내 소득에 딱 맞는 서울 부동산 찾기',
          text: '내 소득과 자산으로 살 수 있는 서울 부동산을 찾아보세요!',
          url: window.location.href
        })
      } else {
        alert('공유하기 기능을 지원하지 않는 브라우저입니다.')
      }
    } catch (error) {
      console.error('공유하기 오류:', error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>서울 부동산을 찾아보세요!</title>
        <meta name="description" content="서울 부동산 추천 서비스" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          내 소득에 딱 맞는<br />
          서울 부동산을 찾아보세요!
        </h1>
        <p className={styles.description}>
          투자와 실거주를 고려한<br />
          최적의 아파트를 찾아드려요
        </p>

        <div className={styles.cardContainer}>
          <div className={styles.grid}>
            {repeatedImages.map((num, index) => (
              <div key={`${num}-${index}`} className={styles.card}>
                <Image
                  src={`/card-0${num}.png`}
                  alt={`Card ${num}`}
                  width={222}
                  height={288}
                  className={styles.cardImage}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button 
            className={styles.startButton}
            onClick={() => router.push('/nickname')}
          >
            시작하기
          </button>
          <button 
            className={styles.shareButton}
            onClick={handleShare}
          >
            공유하기
          </button>
        </div>
      </main>
    </div>
  )
} 