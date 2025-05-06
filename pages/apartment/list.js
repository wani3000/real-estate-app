import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/ApartmentList.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { getApiUrl, API_ENDPOINTS } from "../../utils/api";

export default function ApartmentList() {
  const [aptList, setAptList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${getApiUrl(API_ENDPOINTS.APT)}?lawdCd=11110&dealYmd=202404`)
      .then((res) => {
        const items = res.data.response.body.items.item;
        setAptList(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("데이터 요청 실패:", err);
        setError("아파트 데이터를 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>아파트 실거래가 목록</title>
        <meta name="description" content="서울 아파트 실거래가 목록" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>실거래가 아파트 목록</h1>
        <p className={styles.description}>
          서울 중구 2024년 4월 아파트 실거래 정보
        </p>

        {loading ? (
          <div className={styles.loading}>불러오는 중...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.list}>
            {aptList.length === 0 ? (
              <p className={styles.empty}>거래 내역이 없습니다.</p>
            ) : (
              <ul className={styles.apartmentList}>
                {aptList.map((apt, index) => (
                  <li key={index} className={styles.apartmentItem}>
                    <div className={styles.apartmentInfo}>
                      <h3 className={styles.apartmentName}>{apt.아파트}</h3>
                      <p className={styles.location}>{apt.법정동} {apt.지번}</p>
                      <div className={styles.details}>
                        <span>{apt.전용면적}㎡</span>
                        <span>{apt.층}층</span>
                        <span>{apt.건축년도}년 건축</span>
                      </div>
                    </div>
                    <div className={styles.priceInfo}>
                      <span className={styles.price}>{apt.거래금액}만원</span>
                      <span className={styles.date}>{apt.년}.{apt.월}.{apt.일} 거래</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            뒤로 가기
          </button>
        </div>
      </main>
    </div>
  );
} 