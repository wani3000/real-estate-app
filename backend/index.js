const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "서버 연결 성공!" });
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});