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
  stocks.value = res.data
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
    <!-- 타이틀 -->
    <h1 class="main-title">SKALA 주식 시장</h1>

    <!-- 로그아웃 버튼 -->
    <div v-if="isLoggedIn" class="top-right">
      <button @click="logout">로그아웃</button>
    </div>

    <!-- 로그인 폼 -->
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
    
    <!-- 로그인 후 자산 -->
    <div v-if="isLoggedIn" class="welcome">
      <h2 class="welcome-title">🎉 {{ id }}님 환영합니다!</h2>
      <p class="money-text">💰 초기 자본: <strong>{{ player.money.toLocaleString() }} 원</strong></p>
    </div>

    <!-- 보유 주식 -->
    <div v-if="isLoggedIn && player.stocks.length">
      <h3>📦 보유 주식</h3>
      <ul class="stock-list">
        <li v-for="s in player.stocks" :key="s.name">
          {{ s.name }} - {{ s.quantity }}주 ({{ s.price.toLocaleString() }}원)
        </li>
      </ul>
    </div>

    <!-- 주식 목록 -->
    <div v-if="isLoggedIn" class="stock-container">
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

    <!-- 에러 메시지 -->
    <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
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

.animation-box img {
  max-width: 280px;
  margin: 1.5rem auto;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

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
  width: 50%;
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

.top-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.welcome {
  margin-top: 2rem;
  font-size: 1.1rem;
}

.stock-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 2rem;
}

.stock-container {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 2rem auto;
  background-color: #fdfdfd;
  border-radius: 8px;
  max-width: 700px;

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

.money-text {
  font-size: 1.1rem;
  color: #333;
}

.stock-container {
  border: 1px solid #ccc;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 800px;
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

}
</style>
