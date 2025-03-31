<template>
  <div class="player-wrapper">
    <h2 class="player-title">👤 플레이어 목록</h2>

    <ul class="player-list">
      <li v-for="player in players" :key="player.id" class="player-box">
        <h3>{{ player.id }} 님</h3>
        <p class="money">💰 보유 자산: {{ player.money.toLocaleString() }} 원</p>

        <div v-if="player.stocks.length">
          <h4 class="stock-title">📦 보유 주식</h4>
          <ul class="stock-list">
            <li v-for="stock in player.stocks" :key="stock.name">
              {{ stock.name }} - {{ stock.quantity }}주 ({{ stock.price.toLocaleString() }}원)
            </li>
          </ul>
        </div>
        <div v-else class="no-stock">
          보유한 주식이 없습니다.
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const players = ref([])

const fetchPlayers = async () => {
  const res = await axios.get('/api/players')
  players.value = res.data
}

onMounted(() => {
  fetchPlayers()
})
</script>

<style scoped>
.player-wrapper {
  padding: 3rem 1rem;
  background: linear-gradient(to bottom, #f9f9f9, #e0ecff);
  min-height: 100vh;
  text-align: center;
}

.player-title {
  font-size: 2.2rem;
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

.player-list {
  list-style: none;
  padding: 0;
  max-width: 700px;
  margin: 0 auto;
}

.player-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: left;
  transition: transform 0.2s;
}

.player-box:hover {
  transform: scale(1.02);
}

.player-box h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.money {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #34495e;
}

.stock-title {
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.stock-list {
  list-style: none;
  padding-left: 1rem;
  color: #555;
}

.stock-list li::before {
  content: "📌 ";
  margin-right: 4px;
}

.no-stock {
  color: #999;
  font-style: italic;
  margin-top: 0.5rem;
}
</style>
