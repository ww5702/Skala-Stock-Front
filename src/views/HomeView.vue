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

// 플레이어 전체 정보 조회 (자산 + 보유 주식)
const fetchPlayer = async () => {
  const res = await axios.get(`/api/players/${id.value}/details`)
  player.value = res.data
}

// 전체 주식 목록 조회
const fetchStocks = async () => {
  const res = await axios.get('/api/stocks')
  stocks.value = res.data
}

// 매수 요청
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


// 매도 요청
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

    <!-- 로그인 후 환영 메시지 및 자산 -->
    <div v-if="isLoggedIn" class="welcome">
      <h3>{{ id }}님 환영합니다!</h3>
      <p>초기 자본: {{ player.money.toLocaleString() }} 원</p>
    </div>

    <!-- 보유 주식 -->
    <div v-if="isLoggedIn && player.stocks.length">
      <h3>📦 보유 주식</h3>
      <ul>
        <li v-for="s in player.stocks" :key="s.name">
          {{ s.name }} - {{ s.quantity }}주 ({{ s.price.toLocaleString() }}원)
        </li>
      </ul>
    </div>

    <!-- 📈 주식 목록 -->
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
            <td><button @click="buyStock(stock.name)">매수</button></td>
            <td><button @click="sellStock(stock.name)">매도</button></td>
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
