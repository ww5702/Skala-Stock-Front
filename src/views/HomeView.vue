<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const id = ref('')
const password = ref('')
const money = ref(null)
const isLoggedIn = ref(false)
const errorMessage = ref('')
const stocks = ref([])

// 로그인 요청
const login = async () => {
  try {
    const res = await axios.post('/api/players/login', { id: id.value, password: password.value })
    isLoggedIn.value = true
    await fetchPlayerMoney()
    await fetchStocks()
  } catch (e) {
    alert('로그인 실패: ' + (e.response?.data?.message || e.message))
  }
}

// 사용자 정보 조회
const fetchPlayerMoney = async () => {
  const res = await axios.get(`/api/players/${id.value}`)
  money.value = res.data.money
}

// 전체 주식 목록 조회
const fetchStocks = async () => {
  const res = await axios.get('/api/stocks')
  stocks.value = res.data
}

// 매수 요청
const buyStock = async (stockName) => {
  try {
    await axios.post('/api/trade/buy', { playerId: id.value, stockName })
    await fetchPlayerMoney()
    alert(`${stockName} 매수 성공!`)
  } catch (e) {
    alert('매수 실패: ' + (e.response?.data?.message || e.message))
  }
}

// 매도 요청
const sellStock = async (stockName) => {
  try {
    await axios.post('/api/trade/sell', { playerId: id.value, stockName })
    await fetchPlayerMoney()
    alert(`${stockName} 매도 성공!`)
  } catch (e) {
    alert('매도 실패: ' + (e.response?.data?.message || e.message))
  }
}
// 로그아웃
const logout = () => {
  id.value = ''
  password.value = ''
  welcomeMessage.value = ''
  isLoggedIn.value = false
  money.value = null
  errorMessage.value = ''
}
</script>

<template>
  <div class="home-container">
    <!-- 오른쪽 상단 로그아웃 버튼 -->
    <div v-if="isLoggedIn" class="top-right">
      <button @click="logout">로그아웃</button>
    </div>

    <!-- 로그인 폼 -->
    <div v-if="!isLoggedIn">
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <div>
          <label for="id">아이디:</label>
          <input id="id" v-model="id" required />
        </div>
        <div>
          <label for="password">비밀번호:</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>

    <!-- 로그인 결과 -->
    <div v-if="isLoggedIn" class="welcome">
      <h3>{{ id }}님 환영합니다!</h3>
      <p v-if="money !== null">초기 자본: {{ money.toLocaleString() }} 원</p>
    </div>

    <!-- 📦 주식 목록 박스 -->
    <div v-if="isLoggedIn" class="stock-container">
      <h3>📈 주식 목록</h3>
      <table border="1" cellpadding="10">
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
            <td><button @click="">매수</button></td>
            <td><button @click="">매도</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="errorMessage" style="color: red">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  position: relative;
}

.top-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

form {
  margin-bottom: 1rem;
}

.welcome {
  margin-top: 2rem;
}

.stock-container {
  border: 1px solid #ccc;
  padding: 16px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>
