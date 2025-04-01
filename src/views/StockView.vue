<template>
  <div class="stock-wrapper">
    <h1 class="stock-title">📈 전체 주식 목록</h1>
    <h4 class="stock-subtitle">5초마다 가격이 변동됩니다.</h4>
    <ul class="stock-list">
      <li v-for="stock in stocks" :key="stock.name">
        <span class="stock-name">{{ stock.name }}</span>
        <span class="stock-price">{{ stock.price.toLocaleString() }}원</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stocks = ref([])

const fetchStocks = async () => {
  const res = await axios.get('http://localhost:8080/api/stocks')
  stocks.value = res.data
}

onMounted(() => {
  fetchStocks()
  setInterval(fetchStocks, 5000) // ⏱ 5초마다 자동으로 주식 다시 가져오기
})
</script>

<style scoped>
.stock-wrapper {
  padding: 3rem 1rem;
  background: linear-gradient(to bottom, #f9f9f9, #e0ecff);
  min-height: 100vh;
  text-align: center;
}

.stock-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 2rem;
  animation: fadeInDown 1s ease-out;
}
.stock-subtitle {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 2rem;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.stock-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.stock-list li {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  color: #2c3e50;
}

.stock-list li:last-child {
  border-bottom: none;
}

.stock-name {
  font-weight: bold;
}

.stock-price {
  color: #34495e;
}
</style>
