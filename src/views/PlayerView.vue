<template>
  <div class="player-list">
    <h2>플레이어 목록</h2>
    <ul>
      <li v-for="player in players" :key="player.id" class="player-box">
        <h3>{{ player.id }} 님</h3>
        <p>보유 자산: {{ player.money.toLocaleString() }} 원</p>

        <div v-if="player.stocks.length">
          <h4>📦 보유 주식</h4>
          <ul>
            <li v-for="stock in player.stocks" :key="stock.name">
              {{ stock.name }} - {{ stock.quantity }}주 ({{ stock.price.toLocaleString() }}원)
            </li>
          </ul>
        </div>
        <div v-else>
          <p>보유한 주식이 없습니다.</p>
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
.player-box {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
}
.player-list ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.player-list {
  padding: 1rem;
}

.player-list ul {
  list-style: none;       /* 불릿 제거 */
  padding-left: 0;
}

.player-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fffdf9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.player-box h3 {
  margin: 0 0 8px 0;
}

.player-box p {
  margin: 4px 0;
}

.player-box ul {
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.player-box li::before {
  content: "📌 ";
  margin-right: 4px;
  color: #555;
}


</style>
