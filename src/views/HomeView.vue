<script setup>
import { ref } from 'vue'
import axios from 'axios'

const id = ref('')
const password = ref('')
const isLoggedIn = ref(false)
const errorMessage = ref('')
const stocks = ref([])
const player = ref({ money: 0, stocks: [] })

// 로그인 요청
const login = async () => {
  try {
    const res = await axios.post('/api/players/login', { id: id.value, password: password.value })
    isLoggedIn.value = true
    await fetchPlayer()
    await fetchStocks()
    startStockPolling() // 주식 갱신 지속
  } catch (e) {
    alert('로그인 실패: ' + (e.response?.data?.message || e.message))
  }
}

// 플레이어 전체 정보 조회
const fetchPlayer = async () => {
  const res = await axios.get(`/api/players/${id.value}/details`)
  player.value = res.data
}

// 전체 주식 목록 조회
const fetchStocks = async () => {
  const res = await axios.get('/api/stocks')
  stocks.value = [...res.data]
}

// 5초마다 주식 갱신
const startStockPolling = () => {
  setInterval(fetchStocks, 5000)
}


// 매수
const buyStock = async (stockName) => {
  const quantity = parseInt(prompt(`${stockName} 몇 주 매수하시겠습니까?`), 10)
  if (isNaN(quantity) || quantity <= 0) {
    alert('올바른 수량을 입력해주세요.')
    return
  }

  try {
    await axios.post('/api/trade/buy', {
      playerId: id.value,
      stockName,
      quantity
    })
    await fetchPlayer()
    alert(`${stockName} ${quantity}주 매수 성공!`)
  } catch (e) {
    const message = e.response?.data?.message || e.message
    alert('매수 실패: ' + message)
  }
}

// 매도
const sellStock = async (stockName) => {
  const quantity = parseInt(prompt(`${stockName} 몇 주 매도하시겠습니까?`), 10)
  if (isNaN(quantity) || quantity <= 0) {
    alert('올바른 수량을 입력해주세요.')
    return
  }

  try {
    const res = await axios.post('/api/trade/sell', {
      playerId: id.value,
      stockName,
      quantity
    })
    await fetchPlayer()
    alert(`${stockName} ${quantity}주 매도 성공!`)
  } catch (e) {
    const message = e.response?.data?.message || e.message
    alert('매도 실패: ' + message)
  }
}

// 로그아웃
const logout = () => {
  id.value = ''
  password.value = ''
  isLoggedIn.value = false
  player.value = { money: 0, stocks: [] }
  stocks.value = []
  errorMessage.value = ''
}
</script>

<template>
  <div class="main-wrapper">
    <h1 class="main-title">SKALA 주식 시장</h1>

    <!-- 로그아웃 버튼 -->
    <div v-if="isLoggedIn" class="top-right">
      <button @click="logout">로그아웃</button>
    </div>

    <!-- 로그인 박스 -->
    <div v-if="!isLoggedIn" class="login-box">
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="id">아이디:</label>
          <input id="id" v-model="id" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호:</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit" class="login-btn">로그인</button>
      </form>
    </div>

    <!-- 로그인 후 화면 -->
    <div v-if="isLoggedIn" class="welcome">
      <h2 class="welcome-title">🎉 {{ id }}님 환영합니다!</h2>
      <hr class="divider" />

      <div class="layout-grid centered-layout align-top">
        <!-- 왼쪽: 주식 목록 -->
        <div class="stock-container bordered-box">
          <h3 class="stock-title">📈 주식 목록</h3>
          <table class="stock-table">
            <thead>
              <tr>
                <th>주식 이름</th>
                <th>가격</th>
                <th>매수</th>
                <th>매도</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in stocks" :key="stock.name">
                <td>{{ stock.name }}</td>
                <td>{{ stock.price.toLocaleString() }} 원</td>
                <td><button class="trade-btn buy" @click="buyStock(stock.name)">매수</button></td>
                <td><button class="trade-btn sell" @click="sellStock(stock.name)">매도</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 오른쪽: 초기 자본 + 보유 주식 -->
        <div class="player-info-column align-start">
          <div class="money-box bordered-box">
            <p>💰 초기 자본:</p>
            <p class="bold-money">{{ player.money.toLocaleString() }} 원</p>
          </div>

          <div class="stocks-box bordered-box">
            <p class="stock-title">📦 보유 주식</p>
            <div class="scrollable-stocks">
              <p v-if="player.stocks.length === 0">보유한 주식이 없습니다.</p>
              <ul v-else>
                <li v-for="s in player.stocks" :key="s.name">
                  {{ s.name }} - {{ s.quantity }}주 ({{ s.price.toLocaleString() }}원)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
/* 전체 페이지 배경 및 타이틀 */
.main-wrapper {
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(to bottom, #f9f9f9, #e0ecff);
  min-height: 100vh;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 2rem;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 로그인 박스 */
.login-box {
  background-color: #ffffff;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #34495e;
}

/* 로그아웃 버튼 */
.top-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

/* 로그인 후 사용자 정보 */
.welcome {
  margin-top: 2rem;
  text-align: center;
}

.welcome-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.divider {
  border: none;
  height: 2px;
  background-color: #ccc;
  width: 400%;
  margin: 1.2rem auto;
}

/* 사용자 정보 좌우 정렬 */
.player-info-wrapper {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.money-box, .stocks-box {
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  min-width: 260px;
  max-width: 400px;
  text-align: left;
}

.money-box p {
  margin: 0.2rem 0;
}

.bold-money {
  font-weight: bold;
  font-size: 1.2rem;
}

.stock-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.scrollable-stocks {
  max-height: 800px;      /* 최대 높이 제한 */
  overflow-y: auto;       /* 수직 스크롤 허용 */
  border-top: 1px solid #eee;
  padding-top: 0.5rem;
}


/* 주식 목록 테이블 */
.stock-container {
  border: 1px solid #ccc;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 1200px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stock-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  text-align: left;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
}

.stock-table th,
.stock-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.trade-btn {
  padding: 6px 14px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.trade-btn.buy {
  background-color: #3498db;
  color: white;
}

.trade-btn.sell {
  background-color: #e74c3c;
  color: white;
}

.trade-btn:hover {
  opacity: 0.85;
}
.layout-grid {
  display: flex;
  align-items: flex-start; 
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.centered-layout {
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
}

.player-info-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}

.bordered-box {
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #ccc;
  min-width: 260px;
  max-width: 400px;
  text-align: left;
}

.stock-container,
.money-box,
.stocks-box {
  margin-top: 0;
}
</style>

