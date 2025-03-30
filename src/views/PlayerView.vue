<!-- src/views/PlayerView.vue -->
<template>
    <div>
      <h2>사용자 목록</h2>
      <ul>
        <li v-for="player in players" :key="player.id">
          {{ player.id }} - 보유 금액: {{ player.money }}원
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const players = ref([])
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/players')
      players.value = response.data
    } catch (error) {
      console.error('플레이어 목록 불러오기 실패:', error)
    }
  })
  </script>
  