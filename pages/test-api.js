import { useState, useEffect } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../utils/api';

export default function TestAPI() {
  const [result, setResult] = useState('테스트 중...');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // 환경 변수 확인
    const envUrl = process.env.NEXT_PUBLIC_API_URL || '환경변수 없음';
    setApiUrl(envUrl);
    
    // 백엔드 연결 테스트
    async function testAPI() {
      try {
        const response = await fetch(getApiUrl('/'));
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        setResult(`오류 발생: ${error.message}`);
      }
    }
    
    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>API 연결 테스트</h1>
      <div style={{ margin: '20px 0' }}>
        <h3>환경 변수 값:</h3>
        <pre>{apiUrl}</pre>
      </div>
      <div>
        <h3>API 응답:</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          {result}
        </pre>
      </div>
    </div>
  );
} 