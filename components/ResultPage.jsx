import { useEffect, useState } from "react";
import styles from "../styles/ApartmentDetail.module.css";
import { getApiUrl, API_ENDPOINTS } from "../utils/api";

const ResultPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const income = params.get("income");
    const cash = params.get("cash");
    const lawdCd = params.get("lawdCd");
    const dealYmd = params.get("dealYmd");

    fetch(`${getApiUrl(API_ENDPOINTS.RECOMMEND)}?mode=${mode}&income=${income}&cash=${cash}&lawdCd=${lawdCd}&dealYmd=${dealYmd}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.result);
      })
      .catch(error => {
        console.error("API 요청 실패:", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.resultHeader}>Result Page</h1>
      <div>
        {data.map((apt, idx) => (
          <div key={idx} className={styles.apartmentCard}>
            <h3 className={styles.apartmentTitle}>{apt.아파트} ({apt.법정동})</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>거래가:</span>
              <span className={styles.infoValue}>{apt.거래금액}만원</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>전용면적:</span>
              <span className={styles.infoValue}>{apt.전용면적}㎡</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>층수:</span>
              <span className={styles.infoValue}>{apt.층}층</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>건축년도:</span>
              <span className={styles.infoValue}>{apt.건축년도}년</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>입주년차:</span>
              <span className={styles.infoValue}>{new Date().getFullYear() - apt.건축년도}년차</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage; 